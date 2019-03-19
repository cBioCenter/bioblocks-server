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
    "dataset": {
        'required': True,
        'type': 'uuid',
        'data_relation': {
            'embeddable': True,
            'field': '_id',
            'resource': 'dataset',
        }
    },
    'icon': {
        'type': 'media',
    },
    'link': {
        'type': 'string',
        'maxlength': 256,
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
                'field': '_id',
                'resource': 'visualization',
            },
            'required': True,
            'type': 'uuid',
        }
    }
}
