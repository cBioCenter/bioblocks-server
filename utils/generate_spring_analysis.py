import spring_load_preprocess
import io
import json
import requests
import uuid
import zipfile

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

RFC_1123_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
MAX_DAYS_JOB_KEEP_ALIVE = 1

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

bioblocks_local_url = 'http://localhost:11037/{}'


def post_bioblocks_analysis(analysis_id, process_type):
    print('POSTing analysis with analysis_id=\'{}\''.format(analysis_id))
    r = session.post(
        url=bioblocks_local_url.format('analysis'),
        data=json.dumps({
            '_id': analysis_id,
            'processType': process_type,
        }),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    print('Returned status from bioblocks analysis request: {}'.format(r.status_code))
    if r.ok is False:
        print(r.text)
    else:
        return json.loads(r.text)['_etag']


def patch_analysis_for_dataset(dataset, analysis_id):
    dataset_id = dataset['_id']
    dataset_etag = dataset['_etag']
    dataset_analyses = dataset['analyses']
    dataset_analyses.append(analysis_id)
    print('PATCHing dataset with new analysis=\'{}\''.format(analysis_id))
    r = session.patch(
        url='{}/{}'.format(bioblocks_local_url.format('dataset'),
                           dataset_id),
        data=json.dumps({
            'analyses': dataset_analyses,
        }),
        headers={'Content-type': 'application/json',
                 'If-Match': dataset_etag},
        timeout=None
    )
    print('Returned status from dataset PATCH: {}'.format(r.status_code))
    if r.ok is False:
        print(r.text)
    else:
        return json.loads(r.text)['_etag']


def analyze_dataset(dataset, dataset_dir):
    dataset_analyses = dataset['analyses']
    matrix_location = dataset['matrixLocation']
    if (matrix_location.endswith('.zip') is False and matrix_location.endswith('mtx') is False):
        print('Dataset \'{}\' has a invalid matrix location: {}'.format(
            dataset['_id'], matrix_location))
        return
    for analysis in dataset_analyses:
        if analysis['processType'] == 'SPRING':
            print('SPRING process already found for dataset \'{}\', skipping'.format(
                dataset['_id']))
            return

    analysis_id = str(uuid.uuid4())
    zip_request = requests.get(matrix_location)
    z = zipfile.ZipFile(io.BytesIO(zip_request.content))
    z.extractall('{}/'.format(dataset_dir))
    spring_load_preprocess.run_spring_preprocessing(
        mtx_file='{}/matrix/matrix.mtx'.format(dataset_dir),
        gene_file='{}/matrix/gene_id.csv'.format(dataset_dir),
        cell_labels_file='{}/matrix/cell_id.csv'.format(
            dataset_dir),
        main_dir='{}/analyses/{}'.format(dataset_dir, analysis_id),
        subplot_name=dataset['name']
    )

    post_bioblocks_analysis(analysis_id, 'SPRING')
    patch_analysis_for_dataset(dataset, analysis_id)


def start_analysis():
    dataset_url = '{}?embedded={{"analyses":1}}'.format(
        bioblocks_local_url.format('dataset'))
    r = session.get(dataset_url)
    datasets = json.loads(r.text)['_items']

    for dataset in datasets:
        dataset_dir = 'files/datasets/{}'.format(dataset['_id'])
        if 'matrixLocation' in dataset and dataset['_id'] == 'e8642221-4c2c-4fd7-b926-a68bce363c88':
            analyze_dataset(dataset, dataset_dir)
        else:
            print('Dataset {} has no matrix'.format(dataset['_id']))


start_analysis()
