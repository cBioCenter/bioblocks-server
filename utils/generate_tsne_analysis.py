import json
import numpy as np
import os
import portal_spring_helper
import portal_spring_upload_functions
import requests
import uuid

from bioblocks_server_api_helper import post_bioblocks_analysis, send_get, send_patch
from bioblocks_logger import bioblocks_log
from datetime import datetime
from MulticoreTSNE import MulticoreTSNE as TSNE
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def create_analysis_directory(dataset_dir, analysis_id):
    try:
        analysis_dir = '{}/analyses'.format(dataset_dir)
        os.mkdir(analysis_dir)
        bioblocks_log('Created new directory \'{}\''.format(analysis_dir))
    except Exception:
        bioblocks_log('Analyses directory \'{}\' already exists, skipping!'.format(analysis_dir))

    try:
        output_dir = '{}/{}'.format(analysis_dir, analysis_id)
        os.mkdir(output_dir)
        bioblocks_log('Created new directory \'{}\''.format(output_dir))
    except Exception:
        bioblocks_log('Analyses directory \'{}\' already exists, skipping!'.format(output_dir))
    finally:
        return output_dir


def patch_analysis_for_dataset(dataset, analysis_id):
    dataset_id = dataset['_id']
    dataset_etag = dataset['_etag']

    dataset_analyses = [analysis_id]
    for analysis in dataset['analyses']:
        dataset_analyses.append(analysis['_id'])
    bioblocks_log('PATCHing dataset with new analysis=\'{}\''.format(analysis_id))

    r = send_patch('{}/{}'.format('dataset', dataset_id),
                   json.dumps({
                       'analyses': dataset_analyses,
                   }), {'Content-type': 'application/json', 'If-Match': dataset_etag})

    bioblocks_log('Returned status from dataset PATCH: {}'.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
    else:
        return json.loads(r.text)['_etag']


def analyze_dataset(dataset):
    dataset_analyses = dataset['analyses']
    dataset_id = dataset['_id']
    pca_location = ''
    for analysis in dataset_analyses:
        if analysis['processType'] == 'TSNE':
            bioblocks_log('T-SNE process already found for dataset \'{}\', skipping'.format(
                dataset_id))
            return
        elif analysis['processType'] == 'SPRING':
            pca_location = 'files/datasets/{}/analyses/{}/counts_norm.npz'.format(
                dataset_id, analysis['_id'])

    if pca_location == '':
        bioblocks_log('Unable to find counts_norm.npz for dataset \'{}\', skipping T-SNE'.format(dataset_id))
        return

    analysis_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    bioblocks_log('Starting TensorFlow T-SNE analysis \'{}\' for dataset \'{}\''.format(
        analysis_id, dataset_id))

    try:
        npz_file = portal_spring_upload_functions.load_npz(pca_location)
    except Exception as e:
        bioblocks_log(e)
        return

    data = portal_spring_helper.get_pca(npz_file, keep_sparse=True, normalize=False)
    tsne = TSNE(n_jobs=4)
    Y = tsne.fit_transform(data)

    end_time = datetime.utcnow()
    bioblocks_log('Finished TensorFlow T-SNE analysis \'{}\' for dataset \'{}\'. Duration: {}'.format(
        analysis_id, dataset_id, end_time - start_time))

    output_dir = create_analysis_directory('files/datasets/{}'.format(dataset_id), analysis_id)

    np.savetxt('{}/tsne_matrix.csv'.format(output_dir), Y, delimiter=',')

    post_bioblocks_analysis(analysis_id, 'TSNE')
    patch_analysis_for_dataset(dataset, analysis_id)


def start_analysis():
    dataset_url = 'dataset?embedded={"analyses":1}'
    r = send_get(dataset_url)
    if (r.ok is False):
        bioblocks_log('Error getting dataset analyes: {}'.format(r.text))
    else:
        datasets = json.loads(r.text)['_items']
        for dataset in datasets:
            if 'matrixLocation' in dataset:
                analyze_dataset(dataset)
            else:
                bioblocks_log('Dataset {} has no matrix'.format(dataset['_id']))


def run(args):
    start_analysis()
