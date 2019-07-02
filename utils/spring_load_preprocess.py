import pickle
import time
import sys
import os
import json
import numpy as np

from bioblocks_logger import bioblocks_log
from portal_spring_helper import *
import portal_spring_upload_functions as up

#========================================================================================#
# INPUTS


def run_spring_preprocessing(
    # Input files
    mtx_file='matrix.mtx',
    gene_file='gene_id.csv',
    cell_labels_file=None,
    custom_colors_file=None,

    # Main dataset directory (for storing counts matrices, gene names, subplots)
    main_dir='example_dataset',

    # Subplot directory (all cells used for first subplot; subsets of cells
    # can be used to make additional subplots from within SPRING viewer)
    subplot_name='all_cells',

    # Get pre-processing parameters.
    # On our server, these are specified by the user.
    # For now, I've just hard-coded some (probably)
    # reasonable defaults.
    cell_min_counts=0,
    gene_min_cells=3,
    gene_min_counts=3,
    gene_var_pctl=85,
    n_neighbors=5,
    n_prin_comps=30,
    n_force_iter=500,
    MAX_CELLS_COUNT=500000,
):

    #========================================================================================#
    # Initialize some stuff
    cell_labels = {}
    custom_color_tracks = {}
    gene_sets = {}
    subplot_dir = '{}/{}'.format(main_dir, subplot_name)

    bioblocks_log('SPRING parameters: \n\
        \'mtx_file\': {}\n\
        \'gene_file\': {}\n\
        \'cell_labels_file\': {}\n\
        \'main_dir\': {}\n\
        \'subplot_name\': {}\n\
        \'subplot_dir\': {}'
                  .format(mtx_file, gene_file, cell_labels_file, main_dir, subplot_dir, subplot_dir))

    #========================================================================================#
    # LOAD DATA

    # Load expression matrix - supporting mtx files, but I also have code for
    # many other formats. Let me know if you want something more flexible.
    E = up.load_mtx(mtx_file)
    gene_list = load_genes(gene_file,
                           delimiter='\t' if gene_file.endswith('tsv') else None,
                           skip_rows=1 if gene_file.endswith('tsv') else 0)

    num_rows = E.shape[0]

    if num_rows >= MAX_CELLS_COUNT:
        bioblocks_log('Not running SPRING - # of cells is {}, maximum allowed is {}'.format(num_rows, MAX_CELLS_COUNT))
        return
    else:
        bioblocks_log('Running SPRING - # of cells is {}'.format(num_rows))

    # Find dimension of counts matrix that matches number of genes.
    # If necessary, transpose counts matrix with
    # rows=cells and columns=genes.
    if num_rows == len(gene_list):
        E = E.T.tocsc()

    # Deal with gene names that are empty strings by removing them
    # from the gene list and the counts matrix. I assume this won't
    # be an issue with DCP/matrix service-generated files, but
    # I'll leave it in for now.
    valid_gene_mask = np.ones(len(gene_list)) == 1
    for iG, g in enumerate(gene_list):
        if len(g) == 0:
            valid_gene_mask[iG] = False

    gene_list = [g for iG, g in enumerate(gene_list) if valid_gene_mask[iG]]
    E = E[:, valid_gene_mask]

    # Load cell_labels (categorical variables) if file has been specified
    # if cell_labels_file is not None:
    # cell_labels = load_custom_data(cell_labels_file)

    # Load custom_colors (continuous variables) if file has been specified
    # if custom_colors_file is not None:
    # custom_color_tracks = load_custom_data(custom_colors_file)

    #========================================================================================#
    # PROCESS DATA

    # Make main directory
    if not os.path.exists(main_dir):
        os.makedirs(main_dir)

    # Perform cell filtering, removing cells with less than minimum
    # number of total counts
    total_counts = E.sum(1).A.squeeze()
    if cell_min_counts > 0:
        cell_filter = (total_counts >= cell_min_counts)
    else:
        cell_filter = (total_counts > 0)

    total_counts = total_counts[cell_filter]

    # Save cell filter
    np.save('{}/cell_filter_mask.npy'.format(main_dir), cell_filter)

    # Save gene list
    np.savetxt('{}/genes.txt'.format(main_dir), gene_list, fmt='%s')

    # Calculate stress signature: fraction of counts from mitochondrially
    # encoded genes (genes starting with "mt-" or "MT-")
    mito_ix = np.array([iG for iG, g in enumerate(gene_list)
                        if g.startswith('mt-') or g.startswith('MT-')], dtype=int)
    if len(mito_ix) > 0:
        mito_frac = E[:, mito_ix][cell_filter, :].sum(
            1).A.squeeze() / total_counts.astype(float)
        custom_color_tracks['Mito. frac.'] = mito_frac

    # Normalize counts matrix
    E = tot_counts_norm(E[cell_filter, :])[0]
    # E = tot_counts_norm(E[0])[0]

    # Save counts matrix as hdf5 files for fast loading in SPRING
    save_hdf5_genes(
        E, gene_list, '{}/counts_norm_sparse_genes.hdf5'.format(main_dir))
    save_hdf5_cells(E, '{}/counts_norm_sparse_cells.hdf5'.format(main_dir))
    save_sparse_npz(E, '{}/counts_norm.npz'.format(main_dir))

    # Save total counts per cell
    np.savetxt('{}/total_counts.txt'.format(main_dir), total_counts)

    # Set default cell label - same for all cells
    cell_labels['Default'] = ['All cells' for i in range(E.shape[0])]

    # Calculate gene set signatures if gene sets are provided
    if len(gene_sets) > 0:
        for kk, vv in gene_sets.items():
            custom_color_tracks[kk] = average_profile(E, gene_list, vv)

    # Use Truncated SVD and approximate nearest neighbors if >100,000 cells
    if E.shape[0] < 100000:
        sparse_pca = False
        use_approxnn = False
    else:
        sparse_pca = True
        use_approxnn = True

    # Run SPRING pre-processing
    out = make_spring_subplot(
        E,
        gene_list,
        subplot_dir,
        normalize=False,
        min_counts=gene_min_counts,
        min_cells=gene_min_cells,
        min_vscore_pctl=gene_var_pctl,
        num_pc=n_prin_comps,
        sparse_pca=sparse_pca,
        k_neigh=n_neighbors,
        cell_groupings=cell_labels,
        num_force_iter=n_force_iter,
        custom_colors=custom_color_tracks,
        use_approxnn=use_approxnn,
        tot_counts_final=total_counts
    )

    # Save pre-processing parameters
    new_params = {
        'min_reads': cell_min_counts,
        'min_cells': gene_min_cells,
        'min_counts': gene_min_counts,
        'vscore_pctl': gene_var_pctl,
        'k': n_neighbors,
        'p': n_prin_comps
    }

    print('{}/params.p'.format(subplot_dir))
    pickle.dump(new_params, open('{}/params.p'.format(subplot_dir), 'wb'))

    # Save cell filter files
    np.savetxt('{}/cell_filter.txt'.format(subplot_dir),
               np.arange(E.shape[0]), fmt='%i')
    np.save('{}/cell_filter.npy'.format(subplot_dir), np.arange(E.shape[0]))
