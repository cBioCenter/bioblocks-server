import os
import sys
from eve import Eve
from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS
from os.path import dirname
from src import settings_apps
from src.bb_schema import instantiation, apps, communicator
from src.data import UUIDEncoder, UUIDValidator

static_folder = '{}/../files'.format(
    os.path.dirname(os.path.abspath(__file__)))

template_folder = '{}/../templates'.format(
    os.path.dirname(os.path.abspath(__file__)))


def create_app(settings=settings_apps.get_bioblocks_apps_settings()):
    EveApp = Eve(json_encoder=UUIDEncoder.UUIDEncoder, settings=settings,
                 static_folder=static_folder, template_folder=template_folder,
                 validator=UUIDValidator.UUIDValidator)
    CORS(EveApp)

    @EveApp.route('/js/<filename>')
    def static_javascript(filename):
        return send_from_directory(static_folder, 'staticjs/{0}'.format(filename))

    return EveApp

app = create_app()
# Set Environment Configuration
# Default is 'development'. Other valid values: 'testing' and 'production'
# To change, change FLASK_ENV the .env file at the root of the project
if app.config['ENV'] == 'production':
    app.config.from_object('apps_config.ProductionConfig')
elif app.config['ENV'] == 'development':
    app.config.from_object('apps_config.DevelopmentConfig')
elif app.config['ENV'] == 'testing':
    app.config.from_object('apps_config.TestingConfig')
else:
    raise Exception(
        'Invalid FLASK_ENV specified "{0}".'.format(app.config['ENV'])
    )

app.on_pre_GET_instantiation += instantiation.handle_on_pre_GET_instantiation
app.on_post_GET_instantiation += instantiation.handle_on_post_GET_instantiation

app.on_pre_GET_apps = apps.handle_on_pre_GET_apps
app.on_post_GET_apps += apps.handle_on_post_GET_apps

app.on_pre_GET_communicator = communicator.handle_on_pre_GET_communicator
app.on_post_GET_communicator += communicator.handle_on_post_GET_communicator
