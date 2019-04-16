import argparse
import importlib

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import setup_api_helper

scripts = ['hca_get_bundles', 'hca_matrix_jobs', 'generate_spring_analysis', 'generate_tsne_analysis']

try:
    parser = argparse.ArgumentParser(description='Bioblocks Server CRON')
    parser.add_argument('--api-url', action='store', dest='api_url', default='https://api.bioblocks.org')
    parser.add_argument('--dry-run', action='store', dest='is_dry_run', default=False)
    args = parser.parse_args()
    setup_api_helper(api_url=args.api_url, verify_flag=args.is_dry_run)

    for script in scripts:
        bioblocks_log('Running script \'{}\''.format(script))
        importlib.import_module(script).run(args)
        bioblocks_log('Finished script \'{}\''.format(script))
except Exception as e:
    bioblocks_log('Exception found in script \'{}\': {}'.format(script, e))
