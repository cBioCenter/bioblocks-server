
def handle_on_pre_GET_apps(resource, lookup):
    """Called when GET is received.
    Searches for an app where the instantiationId is the id in the url.
    """

    print('---!~!~')
    print(lookup)
    if '_id' in lookup:
        lookup['appId'] = lookup['_id'][:-3]
        del lookup['_id']
    print('handle_on_pre_GET_apps, lookup: {}'.format(lookup))


def handle_on_post_GET_apps(resource, payload):
    """Called when response from GET is about to be sent."""

    # current_app.data.driver.db['instantiation'].update({'_id': data['_id']},
    #                                                    {'$unset': {'instantiation_id': None}}, False)
    # Setting payload.data changes what the user receives.
    payload.content_type = 'text/javascript'
    # payload.data = 'console.log("hi from apps js")'
    payload.data = open(
        '/Users/andrewd/Workspace/GitHub/MercifulCode/bioblocks-server/files/js/bb/bioblocks-frame.js', 'r').read()

    print('handle_on_post_GET_apps, payload: {}'.format(payload))
