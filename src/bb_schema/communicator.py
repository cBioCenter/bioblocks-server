
def handle_on_pre_GET_communicator(resource, lookup):
    """Called when GET is received.
    Searches for an app where the communicator is the id in the url.
    """

    print('---!~!~')
    print(lookup)
    if '_id' in lookup:
        lookup['frame_communicator_id'] = lookup['_id'][:-3]
        del lookup['_id']
    print('handle_on_pre_GET_communicator, lookup: {}'.format(lookup))


def handle_on_post_GET_communicator(resource, payload):
    """Called when response from GET is about to be sent."""

    # current_app.data.driver.db['instantiation'].update({'_id': data['_id']},
    #                                                    {'$unset': {'instantiation_id': None}}, False)
    # Setting payload.data changes what the user receives.
    payload.content_type = 'text/javascript'
    payload.data = 'console.log("hi from communicator js")'

    print('handle_on_post_GET_communicator, payload: {}'.format(payload))
