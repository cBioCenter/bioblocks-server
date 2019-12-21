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
            'UMAP',
        ],
        'required': True,
        'type': 'string'
    }
}
