import json
import requests
import os
import shutil
import time

from bioblocks_logger import bioblocks_log
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def setup_api_helper(api_url, verify_flag=True):
    global bioblocks_api_url
    global verify

    bioblocks_api_url = api_url + '/{}'
    verify = not verify_flag


def send_delete(endpoint, headers, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    time.sleep(4)
    bioblocks_log('Sending DELETE to: \'{}\''.format(url))
    r = session.delete(
        url=url,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )
    bioblocks_log('Received status code \'{}\' from DELETE'.format(r.status_code))
    return r


def send_get(endpoint, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending GET to \'{}\''.format(url))
    time.sleep(4)
    r = session.get(
        url=url,
        timeout=timeout,
        verify=verify,
    )
    bioblocks_log('Received status code \'{}\' from GET'.format(r.status_code))
    return r


def send_patch(endpoint, data, headers, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending PATCH to \'{}\''.format(url))
    time.sleep(4)
    r = session.patch(
        url=url,
        data=data,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )
    bioblocks_log('Received status code \'{}\' from PATCH'.format(r.status_code))
    return r


def send_post(endpoint, data, headers={'Content-type': 'application/json'}, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending POST to \'{}\''.format(url))
    time.sleep(4)
    r = session.post(
        url=url,
        data=data,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )
    bioblocks_log('Received status code \'{}\' from POST'.format(r.status_code))
    return r


def post_bioblocks_analysis(analysis):
    bioblocks_log('Creating analysis with analysis_id=\'{}\''.format(analysis['_id']))
    r = send_post('analysis', json.dumps({
        '_id': analysis['_id'],
        'name': analysis['name'],
        'processType': analysis['process_type'],
    }), {'Content-type': 'application/json'})

    bioblocks_log('Returned status from bioblocks analysis request: \'{}\''.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
    else:
        return json.loads(r.text)['_etag']


def create_directory(new_dir):
    bioblocks_log('Creating directory \'{}\''.format(new_dir))
    try:
        os.mkdir(new_dir)
        bioblocks_log('Created new directory \'{}\''.format(new_dir))
    except Exception:
        bioblocks_log('Directory \'{}\' already exists, skipping!'.format(new_dir))


def delete_directory(old_dir):
    bioblocks_log('Deleting directory \'{}\''.format(old_dir))
    try:
        shutil.rmtree(old_dir)
        bioblocks_log('Deleted directory \'{}\''.format(old_dir))
    except Exception:
        bioblocks_log('Directory \'{}\' doesn\'t exist, skipping!'.format(old_dir))


def delete_file(old_file):
    try:
        os.rm(old_file)
        bioblocks_log('Deleted file \'{}\''.format(old_file))
    except Exception:
        bioblocks_log('File \'{}\' doesn\'t exist, skipping!'.format(old_file))
