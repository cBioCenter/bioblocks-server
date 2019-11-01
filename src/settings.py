from src.bb_schema import analysis, dataset, instantiation, job, vignette, visualization

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

    # Enable reads (GET), inserts (POST) and DELETE for resources/collections
    # (if you omit this line, the API will default to ['GET'] and provide
    # read-only access to the endpoint).
    'RESOURCE_METHODS': ['GET', 'POST', 'DELETE'],

    # Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
    # individual items  (defaults to read-only item access).
    'ITEM_METHODS': ['GET', 'PATCH', 'PUT', 'DELETE'],

    'ITEM_URL': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}")',

    # disable default behaviour
    'RETURN_MEDIA_AS_BASE64_STRING': False,
    'MULTIPART_FORM_FIELDS_AS_JSON': True,

    # return media as URL instead
    'RETURN_MEDIA_AS_URL': True,
    'MEDIA_ENDPOINT': 'media',
    'RENDERERS': ['eve.render.JSONRenderer'],
    'DOMAIN': {
        'analysis': {
            'id_field': '_id',
            'schema': analysis.schema,
        },
        'apps': {
            'datasource': {
                'source': 'instantiation',
            },
            'item_url': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}(.js)?")'

        },
        'communicator': {
            'datasource': {
                'source': 'instantiation',
            },
            'item_url': 'regex("[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}(.js)?")'
        },
        'dataset': {
            'id_field': '_id',
            'schema': dataset.schema,
        },
        'instantiation': {
            'id_field': '_id',
            'extra_response_fields': ['parent_private_key',
                                      'frame_public_key',
                                      'shared_communication_secret',
                                      'instantiation_id'],
            'item_methods': ['GET'],
            'resource_methods': ['POST'],
            'schema': instantiation.schema,
        },
        'job': {
            'id_field': '_id',
            'schema': job.schema,
        },
        'spring': {
            'RESOURCE_METHODS': ['GET', 'POST']
        },
        'vignette': {
            'id_field': '_id',
            'schema': vignette.schema,
        },
        'visualization': {
            'id_field': '_id',
            'schema': visualization.schema,
        },
    }
}


def get_bioblocks_settings():
    return settings
