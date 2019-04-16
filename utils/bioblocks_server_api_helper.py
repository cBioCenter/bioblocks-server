import json
import requests
import time

from bioblocks_logger import bioblocks_log
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def setup_api_helper(api_url='https://api.bioblocks.org', verify_flag=True):
    global bioblocks_api_url
    global verify

    bioblocks_api_url = api_url + '/{}'
    verify = verify_flag


def send_delete(endpoint, headers, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    time.sleep(4)
    bioblocks_log('Sending DELETE to \'{}\''.format(url))
    return session.patch(
        url=url,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )


def send_get(endpoint, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending GET to \'{}\''.format(url))
    time.sleep(4)
    return session.get(
        url=url,
        timeout=timeout,
        verify=verify,
    )


def send_patch(endpoint, data, headers, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending PATCH to \'{}\''.format(url))
    time.sleep(4)
    return session.patch(
        url=url,
        data=data,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )


def send_post(endpoint, data, headers={'Content-type': 'application/json'}, timeout=None):
    url = bioblocks_api_url.format(endpoint)
    bioblocks_log('Sending POST to \'{}\''.format(url))
    time.sleep(4)
    return session.post(
        url=url,
        data=data,
        headers=headers,
        timeout=timeout,
        verify=verify,
    )


def post_bioblocks_analysis(analysis_id, process_type):
    bioblocks_log('POSTing analysis with analysis_id=\'{}\''.format(analysis_id))
    r = send_post('analysis', json.dumps({
        '_id': analysis_id,
        'processType': process_type,
    }), {'Content-type': 'application/json'})

    bioblocks_log('Returned status from bioblocks analysis request: {}'.format(r.status_code))
    if r.ok is False:
        bioblocks_log(r.text)
    else:
        return json.loads(r.text)['_etag']
