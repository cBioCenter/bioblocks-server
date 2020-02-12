from bioblocks_logger import bioblocks_log
from bisect import bisect_left
from portal_spring_helper import load_genes
from requests.adapters import HTTPAdapter
from scipy.io import mminfo
from urllib3.util.retry import Retry
import os
import random
import requests

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

MAX_CELLS_COUNT = 200000


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
    subsampled_indices.sort()
    if (num_cells > MAX_CELLS_COUNT):
        subsampled_matrix_location = '{}_sub.mtx'.format(large_matrix_location[0:len(large_matrix_location) - 4])
        with open(subsampled_matrix_location, 'w') as subsampled_matrix:
            with open(large_matrix_location) as large_matrix:
                matrix_header = large_matrix.readline()
                num_entries = 0
                output_lines = []
                line = large_matrix.readline()
                while line:
                    line = large_matrix.readline()
                    matrix_index = -1
                    if sample_rows is True and line.split(' ')[0].isnumeric():
                        matrix_index = int(line.split(' ')[0])
                        num_entries += 1
                    elif len(line.split(' ')) >= 2 and line.split(' ')[1].isnumeric():
                        matrix_index = int(line.split(' ')[1])
                        num_entries += 1

                    bisect_index = bisect_left(subsampled_indices, matrix_index)

                    if bisect_index != len(subsampled_indices) and subsampled_indices[bisect_index] == matrix_index:
                        output_lines.append(line)

                if sample_rows is True:
                    matrix_header = '{}{}'.format('{} {} {}'.format(
                        MAX_CELLS_COUNT, len(gene_list), num_entries), matrix_header)
                else:
                    matrix_header = '{}{}'.format(matrix_header, '{} {} {}'.format(
                        len(gene_list), MAX_CELLS_COUNT, num_entries))
                subsampled_matrix.write(matrix_header)
                for line in output_lines:
                    subsampled_matrix.write(line)
        os.remove(large_matrix_location)
        os.rename(subsampled_matrix_location, large_matrix_location)
