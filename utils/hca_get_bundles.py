#!/usr/local/bin/python
import base64
import json
import os
import requests
from urllib import parse

path = os.getcwd()

urlQuery = parse.urlencode({
    'replica': 'aws',
    'filters': {'file': {'fileFormat': {'is': ['matrix']}}}
})

HCA_PROJECT_URL = 'https://service.explore.data.humancellatlas.org/repository/projects?{}'.format(
    urlQuery)

HCA_DSS_URL = 'https://dss.data.humancellatlas.org/v1/search?replica=aws'

response = requests.get(
    url=HCA_PROJECT_URL,
)


def generateESQuery(shortName, sampleId):
    return {
        "es_query": {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "files.project_json.project_core.project_short_name": shortName
                            }
                        },
                        {
                            "match": {
                                "files.analysis_process_json.process_type.text": "analysis"
                            }
                        },
                        {
                            "match": {
                                "files.specimen_from_organism_json.biomaterial_core.biomaterial_id": sampleId
                            }
                        }
                    ]
                }
            }
        }
    }


def write_bundle_results(results, file):
    for result in results:
        fqid = result['bundle_fqid']
        bundle_id = fqid[0:fqid.index('.')]
        bundle_version = fqid[fqid.index('.') + 1:len(fqid)]
        file.write('{}\t{}\n'.format(
            bundle_id, bundle_version))


def write_specimen_file(specimenId, shortName, sanitized_project_short_name):
    r = requests.post(
        url=HCA_DSS_URL,
        data=json.dumps(generateESQuery(
            shortName, specimenId)),
        headers={'Content-type': 'application/json'}
    )
    results = json.loads(r.text)['results']
    if len(results) == 0:
        return

    with open('{}/{}/{}_fqids.tsv'.format(path, sanitized_project_short_name, specimenId), 'w') as file:
        while True:
            write_bundle_results(results, file)
            if 'Link' in r.headers:
                nextHealder = r.headers['Link'][1:r.headers['Link'].index(
                    '&output')]
                r = requests.post(
                    url=nextHealder,
                    data=json.dumps(generateESQuery(
                        shortName, specimenId)),
                    headers={'Content-type': 'application/json'}
                )
                results = json.loads(r.text)['results']
            else:
                break


hits = json.loads(response.text)['hits']
for hit in hits:
    projects = hit['projects']
    specimens = hit['specimens']

    for project in projects:
        shortName = project['projectShortname']
        sanitized_project_short_name = shortName.replace(
            '/', '_').replace(' ', '_').lower()
        os.mkdir('{}/{}'.format(path, sanitized_project_short_name))
        for specimen in specimens:
            ids = specimen['id']
            for specimenId in ids:
                write_specimen_file(specimenId, shortName,
                                    sanitized_project_short_name)
