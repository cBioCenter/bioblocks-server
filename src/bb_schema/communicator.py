
from flask import render_template
import json

def handle_on_pre_GET_communicator(resource, lookup):
    """Called when GET is received.
    Searches for an app where the communicator is the id in the url.
    """

    if '_id' in lookup:
        lookup['frame_communicator_id'] = lookup['_id'][:-3]
        del lookup['_id']
    print('handle_on_pre_GET_communicator, lookup: {}'.format(lookup))


def handle_on_post_GET_communicator(resource, payload):
    """Called when response from GET is about to be sent."""

    data = json.loads(payload.response[0])
    #TODO: check if data are valid etc
    
    #TODO: delete db entry

    # Setting payload.data changes what the user receives.
    payload.content_type = 'text/javascript'
    payload.data = render_template('communicator.js',
                                    app_id=data['app_id'],
                                    hidden_instantiation_id=data['hidden_instantiation_id'],
                                    shared_communication_secret=data['shared_communication_secret'],
                                    frame_private_key=data['frame_private_key'],
                                    parent_public_key=data['parent_public_key'])

    print('handle_on_post_GET_communicator, payload: {}'.format(payload))
