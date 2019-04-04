import spring_load_preprocess
import datetime
import io
import json
import requests
import socket
import zipfile

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

RFC_1123_FORMAT = "%a, %d %b %Y %H:%M:%S GMT"
MAX_DAYS_JOB_KEEP_ALIVE = 1

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

bioblocks_local_url = 'http://localhost:11037/{}'

r = session.get(bioblocks_local_url.format('dataset'))
datasets = json.loads(r.text)['_items']

for dataset in datasets:
    dataset_dir = 'files/datasets/{}'.format(dataset['_id'])
    if 'matrixLocation' in dataset:
        zip_request = requests.get(dataset['matrixLocation'])
        z = zipfile.ZipFile(io.BytesIO(zip_request.content))
        z.extractall('{}/'.format(dataset_dir))
        spring_load_preprocess.run_spring_preprocessing(
            mtx_file='{}/matrix/matrix.mtx'.format(dataset_dir),
            gene_file='{}/matrix/gene_id.csv'.format(dataset_dir),
            cell_labels_file='{}/matrix/cell_id.csv'.format(dataset_dir),
            main_dir='{}/analysis'.format(dataset_dir),
            subplot_name=dataset['name']
        )
    else:
        print('Dataset {} has no matrix'.format(dataset['_id']))
