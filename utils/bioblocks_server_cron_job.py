import argparse
import importlib
import traceback

from bioblocks_logger import bioblocks_log
from bioblocks_server_api_helper import setup_api_helper
from datetime import datetime

scripts = ['hca_get_bundles', 'hca_matrix_jobs', 'generate_spring_analysis', 'generate_tsne_analysis']
# scripts = ['generate_spring_analysis', 'generate_tsne_analysis']

try:
    cron_start_time = datetime.utcnow()
    parser = argparse.ArgumentParser(description='Bioblocks Server CRON')
    parser.add_argument('--api-url', action='store', dest='api_url', default='http://155.52.47.138')
    parser.add_argument('--dry-run', action='store', dest='is_dry_run', default=False)
    args = parser.parse_args()
    setup_api_helper(api_url=args.api_url, verify_flag=args.is_dry_run)

    for script in scripts:
        script_start_time = datetime.utcnow()
        bioblocks_log('Running script \'{}\''.format(script))
        importlib.import_module(script).run(args)
        script_end_time = datetime.utcnow()
        bioblocks_log('Finished script \'{}\'. Duration: {}'.format(script, script_end_time - script_start_time))
except Exception as e:
    bioblocks_log('Exception found in script \'{}\': {}'.format(script, e))
    traceback.print_exc()
finally:
    cron_end_time = datetime.utcnow()
    bioblocks_log('Finished bioblocks cron job. Duration: {}'.format(cron_end_time - cron_start_time))
