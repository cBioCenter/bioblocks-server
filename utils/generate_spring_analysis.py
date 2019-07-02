import spring_load_preprocess
import io
import json
import requests
import uuid
import zipfile
import gzip
import shutil
import traceback

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import (create_directory,
                                         delete_directory,
                                         post_bioblocks_analysis,
                                         send_get,
                                         send_patch)

from datetime import datetime
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
    dataset_id = dataset['_id']
    matrix_location = dataset['matrixLocation']
    # dataset_id = 'f83165c5-e2ea-4d15-a5cf-33f3550bffde'
    # matrix_location = 'https://s3.amazonaws.com/dcp-matrix-service-results-prod/c34ccb0e-e4fa-4c08-8d76-84aca71dfc99.mtx.zip'

    print('analyzing dataset directory \'{}\' with matrix_location \'{}\''.format(dataset_dir, matrix_location))
    if (matrix_location.endswith('.zip') is False and matrix_location.endswith('mtx') is False):
        bioblocks_log('Dataset \'{}\' has a invalid matrix location: {}, not running SPRING.'.format(
            dataset_id, matrix_location))
        return

    for analysis in dataset_analyses:
        if analysis['processType'] == 'SPRING':
            bioblocks_log('SPRING process already found for dataset \'{}\', skipping'.format(
                dataset_id))
            return

    analysis_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    bioblocks_log('Starting SPRING analysis \'{}\' for dataset \'{}\''.format(
        analysis_id, dataset_id))

    try:
        zip_request = session.get(matrix_location)
    except Exception as e:
        bioblocks_log('Error getting matrix file: {}'.format(e))
        return

    tmp_dir = ''
    with zipfile.ZipFile(io.BytesIO(zip_request.content)) as z:
        z.extractall(dataset_dir)
        for name in z.namelist():
            tmp_dir = name.split('/')[0]
            final_file_name = name.split('/', 1)[-1][:-3]
            full_path = '{}/{}'.format(dataset_dir, name)
            create_directory('{}/matrix'.format(dataset_dir))
            with gzip.open(full_path, 'rb') as f_in:
                with open('{}/matrix/{}'.format(dataset_dir, final_file_name), 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)

        spring_load_preprocess.run_spring_preprocessing(
            mtx_file='{}/matrix/matrix.mtx'.format(dataset_dir),
            gene_file='{}/matrix/genes.tsv'.format(dataset_dir),
            cell_labels_file='{}/matrix/cells.tsv'.format(
                dataset_dir),
            main_dir='{}/analyses/{}'.format(dataset_dir, analysis_id),
            subplot_name=dataset['name']
            # subplot_name='Fetal/Maternal Interface'
        )

    delete_directory('{}/{}'.format(dataset_dir, tmp_dir))
    end_time = datetime.utcnow()
    bioblocks_log('Finished SPRING analysis \'{}\' for dataset \'{}\'. Duration: {}'.format(
        analysis_id, dataset_id, end_time - start_time))

    post_bioblocks_analysis(analysis_id, 'SPRING')
    patch_analysis_for_dataset(dataset, analysis_id)


def start_analysis():
    # dataset_dir = 'files/datasets/091cf39b-01bc-42e5-9437-f419a66c8a45'
    # analyze_dataset('091cf39b-01bc-42e5-9437-f419a66c8a45', dataset_dir)
    # return

    dataset_url = 'dataset?embedded={"analyses":1}'
    r = send_get(dataset_url)
    if (r.ok is False):
        bioblocks_log('Error getting dataset analyes: {}'.format(r.text))
    else:
        datasets = json.loads(r.text)['_items']

        for dataset in datasets:
            dataset_id = dataset['_id']
            dataset_dir = 'files/datasets/{}'.format(dataset_id)
            if 'matrixLocation' in dataset:
                try:
                    analyze_dataset(dataset, dataset_dir)
                except Exception as e:
                    bioblocks_log('Exception found running SPRING: {}'.format(e))
                    traceback.print_exc()

            else:
                bioblocks_log('Dataset {} has no matrix, not running SPRING.'.format(dataset_id))


def run(args):
    start_analysis()
