#!/usr/local/bin/python
import json
import os
import requests
import time
import uuid

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import send_get, send_post
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

HCA_DSS_URL = 'https://dss.data.humancellatlas.org/v1/search?replica=aws'
HCA_PROJECT_URL = 'https://service.explore.data.humancellatlas.org/repository/projects?{}'.format(
    urlQuery)


def derive_es_query_match_field(match_key):
    match_dict = {
        'id': 'files.specimen_from_organism_json.biomaterial_core.biomaterial_id',
        'genusSpecies': 'files.cell_suspension_json.genus_species.text',
        'organ': 'files.specimen_from_organism_json.organ.text',
        'organPart': 'files.specimen_from_organism_json.organ_part.text',
        'organismAge': 'files.donor_organism_json.organism_age',
        'biologicalSex': 'files.donor_organism_json.sex',
        'disease': 'files.donor_organism_json.diseases.text',
        'preservationMethod': 'files.specimen_from_organism_json.preservation_storage.preservation_method',
        'source': 'files.library_preparation_protocol_json.nucleic_acid_source'
    }

    if match_key in match_dict:
        return match_dict[match_key]
    else:
        bioblocks_log('Unhandled specimen field \'{}\'!'.format(match_key))
        return match_key


def generate_es_query(shortName, match_field, match_value):
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
                            derive_es_query_match_field(match_field): match_value
                        }
                    }]
                }
            }
        }
    }


def write_bundle_results(results, file, full_file=None):
    for result in results:
        fqid = result['bundle_fqid']
        index_of_period_delim = fqid.index('.')
        bundle_id = fqid[0:index_of_period_delim]
        bundle_version = fqid[index_of_period_delim + 1:len(fqid)]
        file.write('{}\t{}\n'.format(
            bundle_id, bundle_version))
        if full_file is not None:
            full_file.write('{}\t{}\n'.format(
                bundle_id, bundle_version))


def create_directory(new_dir):
    try:
        os.mkdir(new_dir)
        bioblocks_log('Created new directory \'{}\''.format(new_dir))
    except Exception:
        bioblocks_log('Directory \'{}\' already exists, skipping!'.format(new_dir))


def create_dataset(_id, name, derived_from):
    r = send_post('dataset', json.dumps({
        '_id': _id,
        'derivedFrom': derived_from,
        'name': name,
    }))
    bioblocks_log(r.text)


def write_specimen_file(specimen_field, specimen_value, project_short_name, output_dir, entry_id, full_file=None):
    dataset_name = '{}_{}'.format(specimen_field, specimen_value).replace(' ', '_')

    r = send_get('dataset')
    datasets = json.loads(r.text)['_items']
    for dataset in datasets:
        if dataset['name'] is dataset_name:
            bioblocks_log('Dataset with name \'{}\' already exists, skipping!'.format(dataset_name))
            return

    es_query = generate_es_query(project_short_name, specimen_field, specimen_value)
    r = session.post(
        url=HCA_DSS_URL,
        data=json.dumps(es_query),
        headers={'Content-type': 'application/json'},
        timeout=None,
    )
    time.sleep(5)
    results = json.loads(r.text)['results']
    if len(results) == 0:
        bioblocks_log('Unable to find HCA data for dataset \'{}\', skipping!'.format(dataset_name))
        return

    bioblocks_log('Creating specimen dataset \'{}\'.'.format(dataset_name))

    specimen_uuid = str(uuid.uuid4())
    create_dataset(specimen_uuid, dataset_name, [entry_id])
    output_dir = '{}/{}'.format(output_dir, specimen_uuid)
    create_directory(output_dir)

    with open('{}/{}_fqids.tsv'.format(output_dir, dataset_name), 'w') as file:
        while True:
            write_bundle_results(results, file, full_file)
            if 'Link' in r.headers:
                nextHeader = r.headers['Link'][1:r.headers['Link'].index(
                    '&output')]
                r = session.post(
                    url=nextHeader,
                    data=json.dumps(es_query),
                    headers={'Content-type': 'application/json'},
                    timeout=None
                )
                results = json.loads(r.text)['results']
                bioblocks_log('found {} results'.format(len(results)))
            else:
                break
    bioblocks_log('finished writing results file {}'.format(project_short_name))


def process_project(project, specimens, entry_id, args, output_dir):
    short_name = project['projectShortname']
    if (args.is_dry_run and (short_name == 'Single cell transcriptome analysis of human pancreas')) or \
            not args.is_dry_run:
        create_directory('{}/{}'.format(output_dir, entry_id))
        create_dataset(entry_id, 'full', [])

        with open('{}/{}/full_fqids.tsv'.format(output_dir, entry_id), 'w') as full_file:
            for specimen in specimens:
                for specimen_field in specimen:
                    for specimen_value in specimen[specimen_field]:
                        if specimen_value is None:
                            bioblocks_log('Specimen field \'{}\' with value of none.'.format(specimen_field))
                        elif specimen_field == 'id':
                            write_specimen_file(
                                specimen_field, specimen_value, short_name, output_dir, entry_id, full_file)
                        elif not args.is_dry_run:
                            write_specimen_file(
                                specimen_field, specimen_value, short_name, output_dir, entry_id)
                        else:
                            bioblocks_log('Skipping field \'{}\' with value \'{}\'.'.format(
                                specimen_field, specimen_value))
    else:
        bioblocks_log('Skipping getting bundles for project with shortname \'{}\'.'.format(short_name))


def start_getting_bundles(args):
    response = session.get(
        url=HCA_PROJECT_URL,
        timeout=None
    )
    hits = json.loads(response.text)['hits']
    output_dir = '{}/files/datasets'.format(path)
    bioblocks_log('Using output_dir: \'{}\''.format(output_dir))

    for hit in hits:
        entry_id = hit['entryId']
        projects = hit['projects']
        specimens = hit['specimens']

        for project in projects:
            process_project(project, specimens, entry_id, args, output_dir)


def run(args):
    start_getting_bundles(args)
