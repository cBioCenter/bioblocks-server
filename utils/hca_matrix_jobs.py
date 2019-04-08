import datetime
import json
import requests
import socket

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

RFC_1123_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
MAX_DAYS_JOB_KEEP_ALIVE = 1

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

hostname = socket.gethostname()
bioblocks_public_url = 'https://www.{}'.format(hostname)
bioblocks_local_url = 'http://localhost:11037/{}'
matrix_service_url = 'https://matrix.data.humancellatlas.org/v0/matrix'


def days_between_dates(date1, date2):
    return (date1 - date2).days


def create_bioblocks_job(request_id, dataset):
    print('POSTing bioblocks job with request_id=\'{}\''.format(request_id))
    r = session.post(
        url=bioblocks_local_url.format('job'),
        data=json.dumps({
            '_id': request_id,
            'associatedDataset': {
                'dataset': dataset['_id'],
                'etag': dataset['_etag']
            },
            'link': '{}/{}'.format(matrix_service_url, request_id),
            'status': 'IN_PROGRESS'
        }),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    print('Returned status from bioblocks job: {}'.format(r.status_code))
    if r.ok is False:
        print(r.text)


def patch_dataset_for_job(request_id, result_location, associated_dataset):
    print('PATCHing bioblocks job with request_id=\'{}\''.format(request_id))
    r = session.patch(
        url='{}/{}'.format(bioblocks_local_url.format('dataset'),
                           associated_dataset['dataset']),
        data=json.dumps({
            'matrixLocation': result_location,
        }),
        headers={'Content-type': 'application/json',
                 'If-Match': associated_dataset['etag']},
        timeout=None
    )
    print('Returned status from bioblocks job: {}'.format(r.status_code))
    if r.ok is False:
        print(r.text)
    else:
        return json.loads(r.text)['_etag']


def delete_bioblocks_job(job):
    job_id = job['_id']
    etag = job['_etag']
    print('DELETE-ing bioblocks job with request_id=\'{}\''.format(job_id))
    r = session.delete(
        url='{}/{}'.format(bioblocks_local_url.format('job'), job_id),
        timeout=None,
        headers={'If-Match': etag},
    )
    print('Returned status from bioblocks job: {}'.format(r.status_code))


def handle_hca_matrix_job_status(job):
    r = session.get(
        url=job['link'],
        timeout=None
    )
    result = json.loads(r.text)
    job_id = job['_id']
    if result['status'] == 'In Progress':
        print('Job \'{}\' is still in progress'.format(job_id))
    elif result['status'] == 'Complete':
        matrix_location = result['matrix_location']
        print('Job \'{}\' is complete! Storing matrix location of \'{}\''.format(
            job_id, matrix_location))
        patch_dataset_for_job(
            job_id, result['matrix_location'], job['associatedDataset'])
        delete_bioblocks_job(job)
    else:
        print('Unhandled status \'{}\' with message \'{}\''.format(
            result['status'], result['message']))


def send_hca_matrix_job_request(dataset):
    bundle_fqids_url = '{}/datasets/{}/{}_fqids.tsv'.format(bioblocks_public_url,
                                                            dataset['_id'], dataset['name'])
    print('POSTing matrix job with bundle_fqid_url=\'{}\''.format(bundle_fqids_url))
    r = session.post(
        url=matrix_service_url,
        data=json.dumps({
            'bundle_fqids_url': bundle_fqids_url,
            'format': 'mtx',
        }),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    print('Returned status from matrix service: {}'.format(r.status_code))
    result = json.loads(r.text)
    request_id = result['request_id']
    associated_dataset = {'dataset': dataset['_id'], 'etag': dataset['_etag']}
    if result['status'] == 'In Progress':
        dataset['_etag'] = patch_dataset_for_job(
            request_id, 'IN_PROGRESS - CHECK JOB {}'.format(request_id), associated_dataset)
        create_bioblocks_job(request_id, dataset)
    else:
        print('Unhandled status \'{}\' from matrix service.'.format(
            result['status']))


def create_hca_matrix_jobs():
    r = session.get(bioblocks_local_url.format('dataset'))

    if (r.ok):
        datasets = json.loads(r.text)['_items']
        for dataset in datasets:
            if 'matrixLocation' in dataset:
                print('Dataset with id \'{}\' already has a matrix.'.format(
                    dataset['_id']))
            else:
                send_hca_matrix_job_request(dataset)
    else:
        print('Unable to get datasets from bioblocks: {}'.format(r.text))


def check_bioblocks_jobs():
    r = session.get(bioblocks_local_url.format('job'))
    jobs = json.loads(r.text)['_items']
    for job in jobs:
        handle_hca_matrix_job_status(job)
        started = job['_created']
        job_age_days = days_between_dates(datetime.datetime.utcnow(),
                                          datetime.datetime.strptime(started, RFC_1123_FORMAT))
        if job_age_days >= MAX_DAYS_JOB_KEEP_ALIVE:
            delete_bioblocks_job(job['_id'])


create_hca_matrix_jobs()
check_bioblocks_jobs()
