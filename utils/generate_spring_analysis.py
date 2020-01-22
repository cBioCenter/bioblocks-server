import spring_load_preprocess
import io
import json
import requests
import uuid
import os
import zipfile
import gzip
import shutil
import traceback
from scipy.io import mminfo

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import (create_directory,
                                         delete_directory,
                                         post_bioblocks_analysis,
                                         send_get,
                                         send_patch)
from portal_spring_helper import load_genes
from format_helper import get_numeric_shorthand_suffix

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

    bioblocks_log('Returned status from dataset PATCH of analysis: {}'.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
        return dataset_etag
    else:
        return json.loads(r.text)['_etag']


def patch_matrix_info_for_dataset(dataset, mtx_info, matrix_location=None):
    dataset_id = dataset['_id']
    dataset_etag = dataset['_etag']

    if matrix_location is None:
        matrix_location = dataset['matrixLocation']

    r = send_patch('{}/{}'.format('dataset', dataset_id), json.dumps({
        'matrixInfo': {
            'colCount': mtx_info[1],
            'rowCount': mtx_info[0]
        },
        'matrixLocation': matrix_location,
    }), {'Content-type': 'application/json',
         'If-Match': dataset_etag})
    bioblocks_log('Returned status from dataset PATCH of matrix info: {}'.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
        return dataset_etag
    else:
        return json.loads(r.text)['_etag']


def get_cell_subsample_ranges(num_cells):
    if num_cells >= 100000:
        return [1000, 5000, 10000, 100000]
    elif num_cells >= 10000:
        return [1000, 5000, 10000, num_cells]
    elif num_cells >= 5000:
        return [1000, 5000, num_cells]
    elif num_cells >= 1000:
        return [1000, num_cells]
    else:
        return [num_cells]


def run_spring_analysis(dataset_dir, dataset_id, dataset, MAX_CELLS_COUNT, tmp_dir):
    mtx_file = '{}/matrix/matrix.mtx'.format(dataset_dir)
    gene_file = '{}/matrix/genes.tsv'.format(dataset_dir)
    bioblocks_log('mtx_file = {}'.format(mtx_file))
    mtx_info = mminfo(mtx_file)

    mtx_info = mminfo(mtx_file)
    num_rows = mtx_info[0]
    num_cols = mtx_info[1]
    bioblocks_log('mtx rows: {}'.format(num_rows))
    bioblocks_log('mtx cols: {}'.format(num_cols))
    bioblocks_log('mtx entries: {}'.format(mtx_info[2]))
    bioblocks_log(mtx_info)

    gene_list = load_genes(gene_file,
                           delimiter='\t' if gene_file.endswith('tsv') else None,
                           skip_rows=1 if gene_file.endswith('tsv') else 0)

    if num_rows == len(gene_list):
        bioblocks_log('Genes are rows, Cells are cols')
        num_cells = num_cols
        sample_rows = False
    else:
        bioblocks_log('Cells are rows, Genes are cols')
        num_cells = num_rows
        sample_rows = True

    if num_cells >= MAX_CELLS_COUNT:
        bioblocks_log(
            'Not running SPRING - {} cells detected with max allowed of {}'.format(num_cells, MAX_CELLS_COUNT
                                                                                   ))
        return
    else:
        subsample_ranges = get_cell_subsample_ranges(num_cells)

    bioblocks_log('Attempting to run SPRING with subsample ranges {}'.format(subsample_ranges))

    for subsample_range in subsample_ranges:
        analysis_id = str(uuid.uuid4())
        start_time = datetime.utcnow()
        bioblocks_log('Starting SPRING analysis \'{}\' for dataset \'{}\''.format(
            analysis_id, dataset_id))

        main_dir = '{}/analyses/{}'.format(dataset_dir, analysis_id)

        spring_load_preprocess.run_spring_preprocessing(
            mtx_file=mtx_file,
            gene_file=gene_file,
            cell_labels_file='{}/matrix/cells.tsv'.format(
                dataset_dir),
            main_dir=main_dir,
            subplot_name=dataset['name'],
            sample_rows=sample_rows,
            subsample_range=subsample_range,
            num_cells=num_cells
        )

        try:
            dataset['_etag'] = patch_matrix_info_for_dataset(dataset, mtx_info, mtx_file)
            analysis = {
                '_id': analysis_id,
                'process_type': 'SPRING',
                'name': '{} - {}'.format(dataset['name'], get_numeric_shorthand_suffix(subsample_range))
            }
            post_bioblocks_analysis(analysis)
            dataset['_etag'] = patch_analysis_for_dataset(dataset, analysis_id)
        except Exception as e:
            bioblocks_log('Error with compression of matrix file: {}'.format(e))
            return

    try:
        # bioblocks_log('Compressing file: {}'.format(mtx_file))
        # with open(mtx_file, 'rb') as f_in:
        #     with gzip.open('{}.gz'.format(mtx_file), 'wb') as f_out:
        #         shutil.copyfileobj(f_in, f_out)
        # bioblocks_log('Finished compressing file: {}'.format(mtx_file))

        delete_directory('{}/{}'.format(dataset_dir, tmp_dir))
        os.remove(mtx_file)

    except Exception as e:
        bioblocks_log('Error with cleanup of matrix file: {}'.format(e))

    end_time = datetime.utcnow()
    bioblocks_log('Finished SPRING analysis \'{}\' for dataset \'{}\'. Duration: {}'.format(
        analysis_id, dataset_id, end_time - start_time))


def analyze_dataset(dataset, dataset_dir, MAX_CELLS_COUNT=500000):
    dataset_analyses = dataset['analyses']
    dataset_id = dataset['_id']
    matrix_location = dataset['matrixLocation']
    # dataset_id = 'f83165c5-e2ea-4d15-a5cf-33f3550bffde'
    # matrix_location =
    # 'https://s3.amazonaws.com/dcp-matrix-service-results-prod/c34ccb0e-e4fa-4c08-8d76-84aca71dfc99.mtx.zip'

    bioblocks_log('analyzing dataset directory \'{}\' with matrix_location \'{}\''.format(dataset_dir, matrix_location))
    ends_with_zip = matrix_location.endswith('.zip')
    ends_with_mtx = matrix_location.endswith('mtx')
    ends_with_mtx_gz = matrix_location.endswith('mtx.gz')

    if (
        ends_with_zip is False and ends_with_mtx is False and ends_with_mtx_gz is False
    ):
        bioblocks_log('Dataset \'{}\' has a invalid matrix location: {}, not running SPRING.'.format(
            dataset_id, matrix_location))
        return

    for analysis in dataset_analyses:
        if analysis['processType'] == 'SPRING':
            bioblocks_log('SPRING process already found for dataset \'{}\', skipping'.format(
                dataset_id))
            return

    if (matrix_location.endswith('.zip') is True or ends_with_mtx is True):
        zip_request = session.get(matrix_location)
        zip_location = zip_request.content
    else:
        zip_location = matrix_location

    # Unzip the matrix and write it to the local file system.
    tmp_dir = ''
    with zipfile.ZipFile(io.BytesIO(zip_location)) as z:
        z.extractall(dataset_dir)
        for name in z.namelist():
            tmp_dir = name.split('/')[0]
            final_file_name = name.split('/', 1)[-1][:-3]
            full_path = '{}/{}'.format(dataset_dir, name)
            create_directory('{}/matrix'.format(dataset_dir))
            with gzip.open(full_path, 'rb') as f_in:
                with open('{}/matrix/{}'.format(dataset_dir, final_file_name), 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
        run_spring_analysis(dataset_dir=dataset_dir, dataset_id=dataset_id,
                            dataset=dataset, MAX_CELLS_COUNT=MAX_CELLS_COUNT, tmp_dir=tmp_dir)


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
