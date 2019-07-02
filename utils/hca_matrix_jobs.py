import datetime
import json
import requests

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import send_delete, send_get, send_patch, send_post
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

RFC_1123_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
MAX_DAYS_JOB_KEEP_ALIVE = 1
TSV_PUBLIC_URL = 'https://bioblocks.org'
MATRIX_SERVICE_V0_URL = 'https://matrix.data.humancellatlas.org/v0/matrix'
MATRIX_SERVICE_V1_URL = 'https://matrix.data.humancellatlas.org/v1/matrix'

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


""" Matrix Service V1 API
{
    "fields": [
        "files.specimen_from_organism_json.biomaterial_core.biomaterial_id"
    ],
  "filter": {
        "op": "=",
        "value": "HumanMousePancreas",
        "field": "project.project_core.project_short_name"
    },
 "format": "mtx"
}
"""


def days_between_dates(date1, date2):
    return (date1 - date2).days


def create_bioblocks_job(request_id, dataset):
    r = send_post('job', json.dumps({
        '_id': request_id,
        'associatedDataset': {
            'dataset': dataset['_id'],
            'etag': dataset['_etag']
        },
        'link': '{}/{}'.format(MATRIX_SERVICE_V0_URL, request_id),
        'status': 'IN_PROGRESS'
    }))

    if (r.ok):
        bioblocks_log('Successfully created job \'{}\''.format(request_id))
    else:
        bioblocks_log('Error creating job \'{}\': \'{}\''.format(request_id, r.text))


def patch_dataset_for_job(request_id, result_location, associated_dataset):
    r = send_patch('{}/{}'.format('dataset', associated_dataset['dataset']), json.dumps({
        'matrixLocation': result_location,
    }), {'Content-type': 'application/json',
         'If-Match': associated_dataset['etag']})

    if (r.ok):
        bioblocks_log('Successfully patched job \'{}\''.format(request_id))
        return json.loads(r.text)['_etag']
    else:
        bioblocks_log('Error patching job \'{}\': \'{}\''.format(request_id, r.text))


def delete_bioblocks_job(job):
    job_id = job['_id']
    etag = job['_etag']
    send_delete('{}/{}'.format('job', job_id), {'If-Match': etag})


def handle_hca_matrix_job_status(job):
    r = session.get(
        url=job['link'],
        timeout=None
    )
    job_id = job['_id']
    if r.ok is False:
        bioblocks_log('Job \'{}\' link returned error: {}'.format(job_id, r.text))
    else:
        result = json.loads(r.text)
        if result['status'] == 'In Progress':
            print('IN PROGRESS')
            bioblocks_log('Job \'{}\' is still in progress'.format(job_id))
        elif result['status'] == 'Failed':
            print('FAILED')
            bioblocks_log('Job \'{}\' failed with message \'{}\''.format(job_id, result['message']))
            delete_bioblocks_job(job)
        elif result['status'] == 'Complete':
            print('COMPLETE')
            matrix_location = result['matrix_location']
            bioblocks_log('Job \'{}\' is complete! Storing matrix location of \'{}\''.format(
                job_id, matrix_location))
            patch_dataset_for_job(
                job_id, result['matrix_location'], job['associatedDataset'])
            delete_bioblocks_job(job)
        else:
            bioblocks_log('Unhandled status \'{}\' with message \'{}\''.format(
                result['status'], result['message']))


def send_hca_matrix_job_request(dataset):
    """ V0
    bundle_fqids_url = '{}/datasets/{}/{}_fqids.tsv'.format(TSV_PUBLIC_URL,
                                                            dataset['_id'], dataset['name'])
    bioblocks_log('POST-ing matrix job with bundle_fqid_url=\'{}\''.format(bundle_fqids_url))
    r = session.post(
        url=MATRIX_SERVICE_V0_URL,
        data=json.dumps({
            'bundle_fqids_url': bundle_fqids_url,
            'format': 'mtx',
        }),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    """
    r = session.post(
        url=MATRIX_SERVICE_V1_URL,
        data=json.dumps({
            'fields': [
                'specimen_from_organism.provenance.document_id'
            ],
            'filter': {
                'op': '=',
                'value': dataset['name'],
                'field': 'project.project_core.project_short_name'
            },
            'format': 'mtx',
        }),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    bioblocks_log('Returned status from matrix service: {}'.format(r.status_code))
    if (r.ok):
        result = json.loads(r.text)
        request_id = result['request_id']
        associated_dataset = {'dataset': dataset['_id'], 'etag': dataset['_etag']}
        if result['status'] == 'In Progress':
            dataset['_etag'] = patch_dataset_for_job(
                request_id, 'IN_PROGRESS - CHECK JOB {}'.format(request_id), associated_dataset)
            create_bioblocks_job(request_id, dataset)
        elif result['status'] == 'Failed':
            bioblocks_log('Matrix job failed with message: \'{}\''.format(result['message']))
        else:
            bioblocks_log('Unhandled status \'{}\' from matrix service'.format(
                result['status']))
    else:
        bioblocks_log(r.text)


def create_hca_matrix_jobs():
    r = send_get('dataset')

    if (r.ok):
        datasets = json.loads(r.text)['_items']
        for dataset in datasets:
            if 'matrixLocation' in dataset:
                bioblocks_log('Not creating job for dataset \'{}\', it already has a matrix field'.format(
                    dataset['_id']))
            else:
                send_hca_matrix_job_request(dataset)
    else:
        bioblocks_log('Unable to get datasets from bioblocks: {}'.format(r.text))


def check_bioblocks_jobs():
    r = send_get('job')
    jobs = json.loads(r.text)['_items']
    for job in jobs:
        try:
            handle_hca_matrix_job_status(job)
            job_id = job['_id']
            started = job['_created']
            job_age_days = days_between_dates(datetime.datetime.utcnow(),
                                              datetime.datetime.strptime(started, RFC_1123_FORMAT))
            if job_age_days >= MAX_DAYS_JOB_KEEP_ALIVE:
                delete_bioblocks_job(job)
            else:
                bioblocks_log('Not deleting job \'{}\', less than {} days old'.format(job_id, MAX_DAYS_JOB_KEEP_ALIVE))
        except Exception as e:
            bioblocks_log('Exception checking job id \'{}\': {}'.format(job_id, e))


def run(args):
    create_hca_matrix_jobs()
    check_bioblocks_jobs()
