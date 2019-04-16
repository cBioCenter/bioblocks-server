import spring_load_preprocess
import io
import json
import requests
import uuid
import zipfile

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import post_bioblocks_analysis, send_get, send_patch
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

RFC_1123_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
MAX_DAYS_JOB_KEEP_ALIVE = 1

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def patch_analysis_for_dataset(dataset, analysis_id):
    dataset_id = dataset['_id']
    dataset_etag = dataset['_etag']
    dataset_analyses = dataset['analyses']
    dataset_analyses.append(analysis_id)
    bioblocks_log('PATCHing dataset \'{}\' with analysis \'{}\''.format(dataset_id, analysis_id))
    r = send_patch('{}/{}'.format('dataset', dataset_id), json.dumps({
        'analyses': dataset_analyses,
    }), {'Content-type': 'application/json',
         'If-Match': dataset_etag})

    bioblocks_log('Returned status from dataset PATCH: {}'.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
    else:
        return json.loads(r.text)['_etag']


def analyze_dataset(dataset, dataset_dir):
    dataset_analyses = dataset['analyses']
    matrix_location = dataset['matrixLocation']
    if (matrix_location.endswith('.zip') is False and matrix_location.endswith('mtx') is False):
        bioblocks_log('Dataset \'{}\' has a invalid matrix location: {}, not running SPRING.'.format(
            dataset['_id'], matrix_location))
        return

    for analysis in dataset_analyses:
        if analysis['processType'] == 'SPRING':
            bioblocks_log('SPRING process already found for dataset \'{}\', skipping'.format(
                dataset['_id']))
            return

    analysis_id = str(uuid.uuid4())

    bioblocks_log('Starting SPRING analysis \'{}\' for dataset \'{}\''.format(
        analysis_id, dataset['_id']))

    try:
        zip_request = session.get(matrix_location)
    except Exception as e:
        bioblocks_log('Error getting matrix file: {}'.format(e))
        return

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
    bioblocks_log('Finished SPRING analysis \'{}\' for dataset \'{}\''.format(
        analysis_id, dataset['_id']))

    post_bioblocks_analysis(analysis_id, 'SPRING')
    patch_analysis_for_dataset(dataset, analysis_id)


def start_analysis():
    dataset_url = 'dataset?embedded={"analyses":1}'
    r = send_get(dataset_url)
    if (r.ok is False):
        bioblocks_log('Error getting dataset analyes: {}'.format(r.text))
    else:
        datasets = json.loads(r.text)['_items']

        for dataset in datasets:
            dataset_dir = 'files/datasets/{}'.format(dataset['_id'])
            if 'matrixLocation' in dataset:
                analyze_dataset(dataset, dataset_dir)
            else:
                bioblocks_log('Dataset {} has no matrix, not running SPRING.'.format(dataset['_id']))


def run(args):
    start_analysis()
