schema = {
    '_id': {'type': 'uuid'},
    'analyses': {
        'default': [],
        'required': False,
        'type': 'list',
        'schema': {
            'data_relation': {
                'embeddable': True,
                'field': '_id',
                'resource': 'analysis',
            },
            'required': True,
            'type': 'uuid',
        }
    },
    'authors': {
        'default': [],
        'required': False,
        'schema': {
            'type': 'string',
            'maxlength': 64,
            'minlength': 1,
        },
        'type': 'list',
    },
    'derivedFrom': {
        'default': [],
        'required': False,
        'type': 'list',
        'schema': {
            'data_relation': {
                'embeddable': True,
                'field': '_id',
                'resource': 'dataset',
            },
            'required': True,
            'type': 'uuid',
        }
    },
    'matrixInfo': {
        'required': False,
        'schema': {
            'colCount': {
                'required': False,
                'type': 'integer',
            },
            'rowCount': {
                'required': False,
                'type': 'integer',
            },
        },
        'type': 'dict',
    },
    'matrixLocation': {
        'maxlength': 256,
        'minlength': 1,
        'required': False,
        'type': 'string'
    },
    'name': {
        'maxlength': 128,
        'minlength': 1,
        'required': True,
        'type': 'string'
    },
    'species': {
        'allowed': [
            'anolis_carolinensis',
            'arabidopsis_thaliana',
            'bos_taurus',
            'brachypodium_distachyon',
            'gallus_gallus',
            'homo_sapiens',
            'hordeum_vulgare',
            'macaca_mulatta',
            'monodelphis_domestica',
            'mus_musculus',
            'oryza_sativa',
            'papio_anubis',
            'rattus_norvegicus',
            'solanum_lycopersicum',
            'solanum_tuberosum',
            'sorghum_bicolor',
            'tetraodon_nigroviridis',
            'triticum_aestivum',
            'xenopus_tropicalis',
            'zea_mays'
        ],
        'required': False,
        'type': 'string'
    }
}
