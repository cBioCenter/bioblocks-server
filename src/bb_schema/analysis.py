schema = {
    '_id': {'type': 'uuid'},
    'parameters': {
        'default': {},
        'required': True,
        'type': 'dict',
    },
    'name': {
        'maxlength': 128,
        'minlength': 1,
        'required': True,
        'type': 'string'
    },
    'processType': {
        'allowed': [
            'SPRING',
            'TSNE',
            'UMAP',
        ],
        'required': True,
        'type': 'string'
    }
}
