import logging.config

import os
import sys
from flask_cors import CORS
from flask import Flask, Blueprint, send_from_directory

from eve import Eve
from data import UUIDEncoder, UUIDValidator

static_folder = os.path.join(os.environ.get("PWD"), "files")

EveApp = Eve(json_encoder=UUIDEncoder.UUIDEncoder,
             validator=UUIDValidator.UUIDValidator, static_folder=static_folder)
CORS(EveApp)


@EveApp.route('/spring/springViewer.html')
def spring_index():
    return send_from_directory(static_folder, 'spring/springViewer.html')


@EveApp.route('/spring/datasets/<path:filename>')
@EveApp.route('/datasets/<path:filename>')
def spring_dataset_files(filename):
    return send_from_directory('{}/datasets'.format(static_folder), filename)


@EveApp.route('/spring/<path:filename>')
def spring_files(filename):
    return send_from_directory('{}/spring'.format(static_folder), filename)


if __name__ == '__main__':
    EveApp.run(host='0.0.0.0', port=11037)
