from Crypto.PublicKey import RSA
from flask import current_app, render_template
import json
import uuid

schema = {
    '_id': {
        'required': False,
        'type': 'uuid'
    },
    'app_id': {
        'required': True,
        'type': 'uuid'
    },
    'frame_communicator_id': {
        'required': False,
        'type': 'uuid'
    },
    'instantiation_id': {
        'required': False,
        'type': 'uuid'
    },
    'hidden_instantiation_id': {
        'required': False,
        'type': 'uuid'
    },
    'shared_communication_secret': {
        'required': False,
        'type': 'uuid'
    },
    'parent_private_key': {
        'required': False,
        'type': 'string',
    },
    'parent_public_key': {
        'required': False,
        'type': 'string',
    },
    'frame_private_key': {
        'required': False,
        'type': 'string',
    },
    'frame_public_key': {
        'required': False,
        'type': 'string',
    }
}


def handle_on_fetched_resource_instantiation(response):
    """Called when resource is fetched from /instantiation"""
    print('handle_on_fetched_resource_instantiation, response: {}'.format(response))


def handle_on_fetched_item_instantiation(response):
    """Called when item is fetched from /instantiation/<item>"""
    print('handle_on_fetched_item_instantiation, response: {}'.format(response))


def handle_on_pre_GET_instantiation(resource, lookup):
    """Called when GET is received.
    Searches for an instantiation where the instantiation_id is the id in the url.
    """

    if '_id' in lookup:
        lookup['instantiation_id'] = lookup['_id']
        del lookup['_id']
    print('handle_on_pre_GET_instantiation, lookup: {}'.format(lookup))


def handle_on_post_GET_instantiation(resource, payload):
    """Called when response from GET is about to be sent."""

    data = json.loads(payload.response[0])
    if ('instantiation_id' in data):

        # current_app.data.driver.db['instantiation'].update({'_id': data['_id']},
        #                                                    {'$unset': {'instantiation_id': None}}, False)
        # Setting payload.data changes what the user receives.
        payload.content_type = 'text/html'
        payload.data = render_template('template.html',
                                       frame_communicator_id=data['frame_communicator_id'], app_id=data['app_id'])

    print('handle_on_post_GET_instantiation, payload: {}'.format(payload))


def handle_on_post_POST_instantiation(resource, payload):
    """ Called when response from POST is about to be sent. """
    # from src import bioblocks_server

    data = json.loads(payload.response[0])
    if ('parent_private_key' in data) and ('frame_public_key' in data):
        current_app.data.driver.db['instantiation'].update(
            {'_id': data['_id']},
            {'$unset': {'parent_private_key': None, 'frame_public_key': None}}, False)

    payload.data = json.dumps(data)
    print('handle_on_post_POST_instantiation, payload: {}'.format(payload))


def handle_on_insert_instantiation(event):
    """ Modify the instantiation before insertion into the database.

    https://docs.python-eve.org/en/stable/features.html#insert-events
    """
    parent_key = RSA.generate(1024)
    parent_public_key = parent_key.publickey().export_key()
    parent_private_key = parent_key.export_key()

    frame_key = RSA.generate(1024)
    frame_public_key = frame_key.publickey().export_key()
    frame_private_key = frame_key.export_key()

    db_id = uuid.uuid4()
    instantiation_id = uuid.uuid4()
    shared_communication_secret = uuid.uuid4()
    frame_communicator_id = uuid.uuid4()

    event[0].update({
        '_id': str(db_id),
        'instantiation_id': str(instantiation_id),
        'hidden_instantiation_id': str(instantiation_id),
        'shared_communication_secret': str(shared_communication_secret),
        'frame_communicator_id': str(frame_communicator_id),
        'parent_private_key': parent_private_key.hex(),
        'parent_public_key': parent_public_key.hex(),
        'frame_private_key': frame_private_key.hex(),
        'frame_public_key': frame_public_key.hex(),
    })
