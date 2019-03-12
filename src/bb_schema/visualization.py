schema = {
    '_id': {'type': 'uuid'},
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
    'icon': {
        'type': 'media'
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
    'location': {
        'maxlength': 256,
        'minlength': 1,
        'required': False,
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
