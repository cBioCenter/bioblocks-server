#!/usr/bin/env python

from scipy.io import mmread
import numpy as np
import scipy.sparse
import os


# ============================================================
#          Reading data

def load_genes(filename, delimiter='\t', column=0, skip_rows=0):
    gene_list = []
    gene_dict = {}

    with open(filename) as f:
        for iL in range(skip_rows):
            f.readline()
        for l in f:
            if delimiter is None:
                gene = l.strip('\n').replace('\t', ' ')
            else:
                gene = l.strip('\n').split(delimiter)[column]
            if gene in gene_dict:
                gene_dict[gene] += 1
                gene_list.append(gene + '__' + str(gene_dict[gene]))
                if gene_dict[gene] == 2:
                    i = gene_list.index(gene)
                    gene_list[i] = gene + '__1'
            else:
                gene_dict[gene] = 1
                gene_list.append(gene)
    return gene_list


def load_mtx(file_data):
    ''' Reads mtx file or, supposedly, an open file object
        Returns scipy.sparse.coo_matrix (if sparse)'''

    return mmread(file_data).tocsc()


def load_npz(file_data):
    return scipy.sparse.load_npz(file_data).tocsc()


def load_npy(file_data):
    return scipy.sparse.csc_matrix(np.load(file_data))


def load_text(file_data, delim='\t'):
    X_data = []
    X_row = []
    X_col = []

    start_column = -1
    start_row = -1
    for row_ix, dat in enumerate(file_data):
        dat = dat.strip('\n').split(delim)

        if start_row == -1:
            current_col = 0
            found_float = False
            while not found_float and current_col < len(dat):
                try:
                    tmp = float(dat[current_col])

                    try:
                        rowdat = np.array(map(float, dat[current_col:]))
                        ncol = len(rowdat)
                        col_ix = np.nonzero(rowdat)[0]

                        found_float = True
                        start_row = row_ix
                        start_column = current_col

                        X_col.extend(col_ix)
                        X_row.extend([row_ix - start_row] * len(col_ix))
                        X_data.extend(rowdat[col_ix])

                    except:
                        current_col += 1

                except:
                    current_col += 1
        else:
            try:
                rowdat = np.array(map(float, dat[start_column:]))
                if len(rowdat) != ncol:
                    return 'ERROR: Expression matrix rows have different numbers of numeric columns. Problem encountered in row %i. Previous rows have %i numeric columns. Row %i has %i numeric columns.' % (row_ix + 1, ncol, row_ix, len(rowdat))
                col_ix = np.nonzero(rowdat)[0]
                X_col.extend(col_ix)
                X_row.extend([row_ix - start_row] * len(col_ix))
                X_data.extend(rowdat[col_ix])
            except:
                return 'ERROR: Expression matrix rows have different numbers of numeric columns. Problem encountered in row %i' % (row_ix + 1)

    if start_row == -1:
        return 'ERROR: No numeric values found in expression matrix'

    nrow = row_ix - start_row + 1
    E = scipy.sparse.coo_matrix(
        (X_data, (X_row, X_col)), dtype=float, shape=(nrow, ncol)).tocsc()

    return E


def text_to_sparse(file_data, delim='\t', start_row=0, start_column=0, data_type=float):
    output = [[]]

    X_data = []
    X_row = []
    X_col = []

    for row_ix, dat in enumerate(file_data):
        dat = dat.strip('\n').split(delim)
        if row_ix >= start_row:
            rowdat = np.array(map(data_type, dat[start_column:]))
            col_ix = np.nonzero(rowdat)[0]
            X_col.extend(col_ix)
            X_row.extend([row_ix - start_row] * len(col_ix))
            X_data.extend(rowdat[col_ix])

    ncol = len(rowdat)
    nrow = row_ix - start_row + 1

    E = scipy.sparse.coo_matrix(
        (X_data, (X_row, X_col)), dtype=data_type, shape=(nrow, ncol))

    return E

# ============================================================
#          Saving data


def save_hdf5_genes(E, gene_list, filename):
    '''SPRING standard: filename = main_spring_dir + "counts_norm_sparse_genes.hdf5"'''

    import h5py

    E = E.tocsc()

    hf = h5py.File(filename, 'w')
    counts_group = hf.create_group('counts')
    cix_group = hf.create_group('cell_ix')

    hf.attrs['ncells'] = E.shape[0]
    hf.attrs['ngenes'] = E.shape[1]

    for iG, g in enumerate(gene_list):
        counts = E[:, iG].A.squeeze()
        cell_ix = np.nonzero(counts)[0]
        counts = counts[cell_ix]
        counts_group.create_dataset(g, data=counts)
        cix_group.create_dataset(g, data=cell_ix)

    hf.close()


def save_hdf5_cells(E, filename):
    '''SPRING standard: filename = main_spring_dir + "counts_norm_sparse_cells.hdf5" '''
    import h5py

    E = E.tocsr()

    hf = h5py.File(filename, 'w')
    counts_group = hf.create_group('counts')
    gix_group = hf.create_group('gene_ix')

    hf.attrs['ncells'] = E.shape[0]
    hf.attrs['ngenes'] = E.shape[1]

    for iC in range(E.shape[0]):
        counts = E[iC, :].A.squeeze()
        gene_ix = np.nonzero(counts)[0]
        counts = counts[gene_ix]
        counts_group.create_dataset(str(iC), data=counts)
        gix_group.create_dataset(str(iC), data=gene_ix)

    hf.close()


def save_sparse_npz(E, filename, compressed=False):
    ''' SPRING standard: filename = main_spring_dir + "/counts_norm.npz"'''
    E = E.tocsc()
    scipy.sparse.save_npz(filename, E, compressed=compressed)
