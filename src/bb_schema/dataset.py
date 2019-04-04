schema = {
    '_id': {'type': 'uuid'},
    'authors': {
        'default': [],
        'required': False,
        'schema': {
            'type': 'string',
            'maxlength': 32,
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
    'matrixLocation': {
        'maxlength': 256,
        'minlength': 1,
        'required': False,
        'type': 'string'
    },
    'name': {
        'maxlength': 64,
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
