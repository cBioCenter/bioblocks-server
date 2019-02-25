
SERVER_NAME = None

# Let's just use the local mongod instance. Edit as needed.

# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

# Skip these if your db has no auth. But it really should.
MONGO_USERNAME = ''
MONGO_PASSWORD = ''
MONGO_AUTH_SOURCE = 'admin'  # needed if --auth mode is enabled

MONGO_DBNAME = 'apitest'

# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

vignette_schema = {
    'uuid': {
        'regex': '^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$',
        'required': True,
        'type': 'string',
    },
    'icon': {
        'type': 'string',
        'maxlength': 256,
        'minlength': 2
    },
    'link': {
        'type': 'string',
        'maxlength': 128,
        'minlength': 2
    },
    'name': {
        'type': 'string',
        'maxlength': 128,
        'minlength': 2
    },
    'summary': {
        'type': 'string',
        'maxlength': 1024,
        'minlength': 2
    },
    'visualizations': {
        'required': True,
        'type': 'list',
        'schema': {
            'data_relation': {
                'embeddable': True,
                'field': 'uuid',
                'resource': 'visualization',
            },
            'required': True,
            'type': 'string',
        }
    }
}

visualization_schema = {
    'uuid': {
        'regex': '^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$',
        'required': True,
        'type': 'string',
    },
    'authors': {
        'required': True,
        'type': 'list',
        'schema': {
            'type': 'string',
            'maxlength': 32,
            'minlength': 1,
        }
    },
    'citations': {
        'required': True,
        'type': 'list',
        'schema': {
            'schema': {
                'fullCitation': {
                    'type': 'string',
                    'maxlength': 256,
                    'minlength': 1,
                },
                'link': {
                    'type': 'string',
                    'maxlength': 256,
                    'minlength': 1,
                },
            },
            'type': 'dict',
        },
    },
    'compatibleData': {
        'required': True,
        'type': 'list',
        'schema': {
            'type': 'string',
            'maxlength': 32,
            'minlength': 1,
        }
    },
    'isOriginal': {
        'required': True,
        'type': 'boolean',
    },
    'labels': {
        'required': False,
        'type': 'list',
        'schema': {
            'type': 'string',
            'maxlength': 32,
            'minlength': 1,
        }
    },
    'name': {
        'maxlength': 64,
        'minlength': 1,
        'required': True,
        'type': 'string'
    },
    'repo': {
        'required': True,
        'schema': {
            'lastUpdate': {
                'maxlength': 64,
                'minlength': 1,
                'required': True,
                'type': 'string'
            },
            'link': {
                'maxlength': 64,
                'minlength': 1,
                'required': True,
                'type': 'string'
            },
            'version': {
                'maxlength': 8,
                'minlength': 1,
                'required': True,
                'type': 'string'
            },
        },
        'type': 'dict',
    },
    'summary': {
        'maxlength': 256,
        'minlength': 8,
        'required': True,
        'type': 'string'
    },
    'version': {
        'regex': '^[0-9]+.[0-9]+.[0-9]+$',
        'required': True,
        'type': 'string'
    }
}

DOMAIN = {
    'visualization': {
        'id_field': 'uuid',
        'schema': visualization_schema,
    },
    'vignette': {
        'id_field': 'uuid',
        'schema': vignette_schema,
    },
}
