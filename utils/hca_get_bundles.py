#!/usr/local/bin/python
import json
import os
import requests
import uuid

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib import parse

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

path = os.getcwd()

urlQuery = parse.urlencode({
    'replica': 'aws',
    'filters': {'file': {'fileFormat': {'is': ['matrix']}}}
})

BIOBLOCKS_URL = 'http://localhost:11037/{0}'
HCA_DSS_URL = 'https://dss.data.humancellatlas.org/v1/search?replica=aws'
HCA_PROJECT_URL = 'https://service.explore.data.humancellatlas.org/repository/projects?{}'.format(
    urlQuery)

response = session.get(
    url=HCA_PROJECT_URL,
    timeout=None
)


def generate_es_query(shortName, sampleId):
    return {
        'es_query': {
            'query': {
                'bool': {
                    'must': [{
                        'match': {
                            'files.project_json.project_core.project_short_name': shortName
                        }
                    }, {
                        'match': {
                            'files.analysis_process_json.process_type.text': 'analysis'
                        }
                    }, {
                        'match': {
                            'files.specimen_from_organism_json.biomaterial_core.biomaterial_id': sampleId
                        }
                    }]
                }
            }
        }
    }


def write_bundle_results(results, file, full_file):
    for result in results:
        fqid = result['bundle_fqid']
        index_of_period_delim = fqid.index('.')
        bundle_id = fqid[0:index_of_period_delim]
        bundle_version = fqid[index_of_period_delim + 1:len(fqid)]
        file.write('{}\t{}\n'.format(
            bundle_id, bundle_version))
        full_file.write('{}\t{}\n'.format(
            bundle_id, bundle_version))


def create_directory(new_dir):
    os.mkdir(new_dir)
    print('Created new directory \'{}\''.format(new_dir))


def create_dataset(_id, name, derived_from):
    r = requests.post(
        url=BIOBLOCKS_URL.format('dataset'),
        data=json.dumps({
            '_id': _id,
            'derivedFrom': derived_from,
            'name': name,
        }),
        headers={'Content-type': 'application/json'}
    )
    print(r.text)


def write_specimen_file(specimen_id, project_short_name, output_dir, full_file, entry_id):
    r = session.post(
        url=HCA_DSS_URL,
        data=json.dumps(generate_es_query(
            project_short_name, specimen_id)),
        headers={'Content-type': 'application/json'},
        timeout=None
    )
    results = json.loads(r.text)['results']
    if len(results) == 0:
        return

    specimen_uuid = str(uuid.uuid4())
    create_dataset(specimen_uuid, specimen_id, [entry_id])
    output_dir = '{}/{}'.format(output_dir, specimen_uuid)
    create_directory(output_dir)

    with open('{}/{}_fqids.tsv'.format(output_dir, specimen_id), 'w') as file:
        while True:
            write_bundle_results(results, file, full_file)
            if 'Link' in r.headers:
                nextHeader = r.headers['Link'][1:r.headers['Link'].index(
                    '&output')]
                r = session.post(
                    url=nextHeader,
                    data=json.dumps(generate_es_query(
                        project_short_name, specimen_id)),
                    headers={'Content-type': 'application/json'},
                    timeout=None
                )
                results = json.loads(r.text)['results']
                print('found {} results'.format(len(results)))
            else:
                break
    print('finished writing results file {}'.format(project_short_name))


def start_getting_bundles():
    hits = json.loads(response.text)['hits']  # [1:2]

    for hit in hits:
        entry_id = hit['entryId']
        projects = hit['projects']
        specimens = hit['specimens']

        output_dir = '{}/files/datasets'.format(path)

        for project in projects:
            short_name = project['projectShortname']

            create_directory('{}/{}'.format(output_dir, entry_id))
            create_dataset(entry_id, 'full', [])

            with open('{}/{}/full_fqids.tsv'.format(output_dir, entry_id), 'w') as full_file:
                for specimen in specimens:
                    print(specimen)
                    ids = specimen['id']
                    for specimen_id in ids[0:1]:
                        write_specimen_file(
                            specimen_id, short_name, output_dir, full_file, entry_id)


start_getting_bundles()
