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
    'name': {
        'maxlength': 64,
        'minlength': 1,
        'required': True,
        'type': 'string'
    },
}
