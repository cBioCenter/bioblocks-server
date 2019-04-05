import io
import json
import numpy as np
import os
import portal_spring_helper
import portal_spring_upload_functions
import requests
import uuid

from MulticoreTSNE import MulticoreTSNE as TSNE
from requests.adapters import HTTPAdapter
from sklearn.decomposition import PCA
from urllib3.util.retry import Retry

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
    if r.ok == False:
        print(r.text)
    else:
        return json.loads(r.text)['_etag']


def patch_analysis_for_dataset(dataset, analysis_id):
    dataset_id = dataset['_id']
    dataset_etag = dataset['_etag']

    dataset_analyses = [analysis_id]
    for analysis in dataset['analyses']:
        dataset_analyses.append(analysis['_id'])
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
    if r.ok == False:
        print(r.text)
    else:
        return json.loads(r.text)['_etag']


def analyze_dataset(dataset):
    dataset_analyses = dataset['analyses']
    pca_location = ''
    for analysis in dataset_analyses:
        if analysis['processType'] == 'TSNE':
            print('TSNE process already found for dataset \'{}\', skipping'.format(
                dataset['_id']))
            return
        elif analysis['processType'] == 'SPRING':
            pca_location = 'files/datasets/{}/analyses/{}/counts_norm.npz'.format(
                dataset['_id'], analysis['_id'])

    analysis_id = str(uuid.uuid4())

    data = portal_spring_helper.get_pca(
        portal_spring_upload_functions.load_npz(pca_location), keep_sparse=True, normalize=False)
    tsne = TSNE(n_jobs=4)
    Y = tsne.fit_transform(data)

    output_dir = 'files/datasets/{}/analyses/{}'.format(
        dataset['_id'], analysis_id)
    os.mkdir(output_dir)
    np.savetxt('{}/tsne_matrix.csv'.format(output_dir), Y, delimiter=",")

    post_bioblocks_analysis(analysis_id, 'TSNE')
    patch_analysis_for_dataset(dataset, analysis_id)


def start_analysis():
    dataset_url = '{}?embedded={{"analyses":1}}'.format(
        bioblocks_local_url.format('dataset'))
    r = session.get(dataset_url)

    datasets = json.loads(r.text)['_items']

    for dataset in datasets:
        if 'matrixLocation' in dataset and dataset['_id'] == 'e8642221-4c2c-4fd7-b926-a68bce363c88':
            analyze_dataset(dataset)
        else:
            print('Dataset {} has no matrix'.format(dataset['_id']))


start_analysis()
