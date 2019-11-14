from Crypto.PublicKey import RSA
from flask import current_app, render_template
import json
import uuid

schema = {
    '_id': {
        'required': False,
        'type': 'uuid'
    },
    'appId': {
        'required': True,
        'type': 'uuid'
    },
    'frameCommunicatorId': {
        'required': False,
        'type': 'uuid'
    },
    'instantiationId': {
        'required': False,
        'type': 'uuid'
    },
    'hiddenInstantiationId': {
        'required': False,
        'type': 'uuid'
    },
    'sharedCommunicationSecret': {
        'required': False,
        'type': 'uuid'
    },
    'parentPrivateKey': {
        'required': False,
        'type': 'string',
    },
    'parentPublicKey': {
        'required': False,
        'type': 'string',
    },
    'framePrivateKey': {
        'required': False,
        'type': 'string',
    },
    'framePublicKey': {
        'required': False,
        'type': 'string',
    }
}

''' NPG: UNSURE WHAT THIS WAS USED FOR
def handle_on_fetched_resource_instantiation(response):
    """Called when resource is fetched from /instantiation"""
    print('handle_on_fetched_resource_instantiation, response: {}'.format(response))


def handle_on_fetched_item_instantiation(response):
    """Called when item is fetched from /instantiation/<item>"""
    print('handle_on_fetched_item_instantiation, response: {}'.format(response))
'''


def handle_on_pre_GET_instantiation(resource, lookup):
    """Called when GET is received.
    Searches for an instantiation where the instantiation_id is the id in the url.
    """

    if '_id' in lookup:
        lookup['instantiationId'] = lookup['_id']
        del lookup['_id']
    print('handle_on_pre_GET_instantiation, lookup: {}'.format(lookup))


def handle_on_post_GET_instantiation(resource, payload):
    """Called when response from GET is about to be sent."""

    data = json.loads(payload.response[0])
    if ('instantiationId' in data):
        # this get should only happen once, so remove the instantiation_id from the database.
        current_app.data.driver.db['instantiation'].update({'_id': data['_id']},
                                                           {'$unset': {'instantiationId': None}}, False)

        # Setting payload.data changes what the user receives.
        payload.content_type = 'text/html'
        payload.data = render_template('instantiation.html',
                                       frameCommunicatorId=data['frameCommunicatorId'],
                                       appId=data['appId'])

    print('handle_on_post_GET_instantiation, payload: {}'.format(payload))


def handle_on_post_POST_instantiation(resource, payload):
    """ Called when response from POST is about to be sent. """
    # from src import bioblocks_server

    data = json.loads(payload.response[0])
    if ('parentPrivateKey' in data) and ('framePublicKey' in data):
        current_app.data.driver.db['instantiation'].update(
            {'_id': data['_id']},
            {'$unset': {'parentPrivateKey': None, 'framePublicKey': None}}, False)

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
    hidden_instantiation_id = uuid.uuid4()
    shared_communication_secret = uuid.uuid4()
    frame_communicator_id = uuid.uuid4()

    event[0].update({
        '_id': str(db_id),
        'instantiationId': str(instantiation_id),
        'hiddenInstantiationId': str(hidden_instantiation_id),
        'sharedCommunicationSecret': str(shared_communication_secret),
        'frameCommunicatorId': str(frame_communicator_id),
        'parentPrivateKey': parent_private_key.hex(),
        'parentPublicKey': parent_public_key.hex(),
        'framePrivateKey': frame_private_key.hex(),
        'framePublicKey': frame_public_key.hex(),
    })
