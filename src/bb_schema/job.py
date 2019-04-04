schema = {
    '_id': {'type': 'uuid'},
    'link': {
        'maxlength': 256,
        'minlength': 2,
        'required': False,
        'type': 'string'
    },
    'associatedDataset': {
        'required': True,
        'schema': {
            'dataset': {
                'data_relation': {
                    'embeddable': True,
                    'field': '_id',
                    'resource': 'dataset',
                },
                'required': True,
                'type': 'uuid',
            },
            'etag': {
                'maxlength': 48,
                'minlength': 1,
                'required': True,
                'type': 'string'
            },
        },
        'type': 'dict',
    },
    'status': {
        'allowed': [
            'IN_PROGRESS',
            'ERROR',
            'COMPLETE',
        ],
        'required': True,
        'type': 'string'
    }
}
