import os

from flask_cors import CORS
from flask import send_from_directory

from eve import Eve
from src import settings
from src.data import UUIDEncoder, UUIDValidator

static_folder = '{}/../files'.format(
    os.path.dirname(os.path.abspath(__file__)))


def create_app(settings: settings.get_bioblocks_settings()):
    EveApp = Eve(json_encoder=UUIDEncoder.UUIDEncoder, settings=settings,
                 static_folder=static_folder, validator=UUIDValidator.UUIDValidator)
    CORS(EveApp)

    @EveApp.route('/spring/springViewer.html')
    def spring_index():
        return send_from_directory(static_folder, 'spring/springViewer.html')

    @EveApp.route('/spring/datasets/<path:filename>')
    @EveApp.route('/datasets/<path:filename>')
    def spring_dataset_files(filename):
        return send_from_directory('{}/datasets'.format(static_folder), filename)

    @EveApp.route('/spring/cgi-bin/<path:filename>', methods=['GET', 'POST'])
    def spring_cgi_bin(filename):
        return send_from_directory('{}/spring/cgi-bin/'.format(static_folder), filename)

    @EveApp.route('/spring/<path:filename>')
    def spring_files(filename):
        return send_from_directory('{}/spring'.format(static_folder), filename)

    return EveApp
