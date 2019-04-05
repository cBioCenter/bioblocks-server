schema = {
    '_id': {'type': 'uuid'},
    'parameters': {
        'default': {},
        'required': True,
        'type': 'dict',
    },
    'processType': {
        'allowed': [
            'SPRING',
            'TSNE',
        ],
        'required': True,
        'type': 'string'
    }
}
