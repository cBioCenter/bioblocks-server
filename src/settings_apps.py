from src.bb_schema import instantiation, visualization

settings = {
    'SERVER_NAME': None,

    # Let's just use the local mongod instance. Edit as needed.

    # Please note that MONGO_HOST and MONGO_PORT could very well be left
    # out as they already default to a bare bones local 'mongod' instance.
    'MONGO_HOST': 'localhost',
    'MONGO_PORT': 27017,

    # Skip these if your db has no auth. But it really should.
    'MONGO_USERNAME': '',
    'MONGO_PASSWORD': '',
    'MONGO_AUTH_SOURCE': 'admin',  # needed if --auth mode is enabled

    'MONGO_DBNAME': 'apitest',

    # Disable all resources/collections endpoints.
    'RESOURCE_METHODS': [],

    # Enable reads (GET) only for all individual items
    'ITEM_METHODS': ['GET'],

    'ITEM_URL': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}")',

    # disable default behaviour
    'RETURN_MEDIA_AS_BASE64_STRING': False,
    'MULTIPART_FORM_FIELDS_AS_JSON': True,

    # return media as URL instead
    'RETURN_MEDIA_AS_URL': True,
    'MEDIA_ENDPOINT': 'media',
    'RENDERERS': ['eve.render.JSONRenderer'],
    'DOMAIN': {
        'apps': {
            'datasource': {
                'source': 'instantiation',
            },
            'item_methods': ['GET'],
            'resource_methods': [],
            'item_url': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}(.js)?")'
        },
        'communicator': {
            'datasource': {
                'source': 'instantiation',
            },
            'item_methods': ['GET'],
            'resource_methods': [],
            'item_url': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}(.js)?")',
            'schema': instantiation.schema,
        },
        'instantiation': {
            'id_field': '_id',
            'extra_response_fields': ['parent_private_key',
                                      'frame_public_key',
                                      'shared_communication_secret',
                                      'instantiation_id'],
            'item_methods': ['GET'],
            'resource_methods': [],
            'schema': instantiation.schema,
        },
    }
}

def get_bioblocks_apps_settings():
    return settings
