schema = {
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
