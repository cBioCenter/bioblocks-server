# import io
# import uuid
# import os
# import zipfile
# import gzip
# import shutil
import random
import requests
from scipy.io import mminfo

from bioblocks_logger import bioblocks_log
from generate_spring_analysis import run_spring_analysis
from portal_spring_helper import load_genes
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

MAX_CELLS_COUNT = 500000


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


def create_subsampled_matrix(large_matrix_location, gene_file=None, MAX_CELLS_COUNT=MAX_CELLS_COUNT):
    mtx_info = mminfo(large_matrix_location)
    num_rows = mtx_info[0]
    num_cols = mtx_info[1]
    num_cells = num_cols

    bioblocks_log('mtx rows: {}'.format(num_rows))
    bioblocks_log('mtx cols: {}'.format(num_cols))
    bioblocks_log('mtx entries: {}'.format(mtx_info[2]))
    bioblocks_log(mtx_info)

    if gene_file is not None:
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
    else:
        gene_list = ['']

    subsampled_indices = random.sample(range(1, num_cells + 1), MAX_CELLS_COUNT)

    if (num_cells > MAX_CELLS_COUNT):
        subsampled_matrix_location = '{}_sub.mtx'.format(large_matrix_location[0:len(large_matrix_location) - 4])
        output_lines = ''
        with open(subsampled_matrix_location, 'a') as subsampled_matrix:
            with open(large_matrix_location) as large_matrix:
                line = large_matrix.readline()
                output_lines += '{}\n'.format(line)
                subsampled_matrix.write(line)
                line = large_matrix.readline()
                if sample_rows is True:
                    output_lines += '{}\n'.format(
                        '{} {} {}'.format(MAX_CELLS_COUNT, len(gene_list), len(gene_list) * MAX_CELLS_COUNT))
                else:
                    output_lines += '{}\n'.format(
                        '{} {} {}'.format(len(gene_list), MAX_CELLS_COUNT, len(gene_list) * MAX_CELLS_COUNT))

                while line:
                    line = large_matrix.readline()
                    matrix_index = -1
                    if sample_rows is True and line.split(' ')[0].isnumeric():
                        matrix_index = int(line.split(' ')[0])
                    elif line.split(' ')[1].isnumeric():
                        matrix_index = int(line.split(' ')[1])

                    if matrix_index in subsampled_indices:
                        output_lines += '{}\n'.format(line)
            subsampled_matrix.write(output_lines)
        sub_mtx_info = mminfo(subsampled_matrix_location)
        bioblocks_log(sub_mtx_info)


def test_large_matrix_parser():

    dataset_dir = '/Users/andrewd/Desktop/Bioblocks-Datasets/cc95ff89-2e68-4a08-a234-480eca21ce79'

    dataset = {
        'analyses': [],
        '_etag': 'foooooo',
        '_id': 'cc95ff89-2e68-4a08-a234-480eca21ce79',
        'matrixLocation': '{}/matrix/matrix.mtx'.format(dataset_dir),
        'name': 'Panic Attack'
    }

    # dataset_analyses = dataset['analyses']
    dataset_id = dataset['_id']
    matrix_location = dataset['matrixLocation']

    bioblocks_log('analyzing dataset directory \'{}\' with matrix_location \'{}\''.format(dataset_dir, matrix_location))
    # ends_with_zip = matrix_location.endswith('.zip')
    # ends_with_mtx = matrix_location.endswith('mtx')
    # ends_with_mtx_gz = matrix_location.endswith('mtx.gz')

    # zip_location = open(matrix_location, 'r')

    # Unzip the matrix and write it to the local file system.
    tmp_dir = 'cc95ff89-2e68-4a08-a234-480eca21ce79.mtx'

    gene_file = '{}/matrix/genes.tsv'.format(dataset_dir)

    create_subsampled_matrix(large_matrix_location=matrix_location, gene_file=gene_file)

    # run_spring_analysis(dataset_dir=dataset_dir, dataset_id=dataset_id,
    #                     dataset=dataset, MAX_CELLS_COUNT=MAX_CELLS_COUNT, tmp_dir=tmp_dir)


test_large_matrix_parser()
