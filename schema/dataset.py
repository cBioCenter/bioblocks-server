from cerberus import Validator

citationSchema = {
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
    'type': 'dict'
}


vignetteSchema = {
    'schema': {
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
        }
    },
    'type': 'dict'
}

schema = {
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
        'schema': citationSchema,
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
    'isOriginal': {
        'default': True,
        'required': False,
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
    },
    'vignettes': {
        'required': True,
        'type': 'list',
        'schema': vignetteSchema,
    },
    'uuid': {
        'regex': '^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$',
        'required': True,
        'type': 'string',
    },
}

v = Validator(schema)

correctDocument = {
    'authors': ['klein', 'sander'],
    'citations': [
        {
            'fullCitation': 'Weinreb, Caleb, Samuel Wolock, and Allon M. Klein',
            'link': 'https://www.ncbi.nlm.nih.gov/pubmed/29228172'
        }
    ],
    'compatibleData': ['live tSNE', 'UMAP', 'PCA'],
    'labels': ['1'],
    'name': 'SPRING',
    'repo': {
        'lastUpdate': '2018.03.12',
        'link': 'https://github.com/AllonKleinLab/SPRING_dev',
        'version': '2.0.0'
    },
    'summary': 'A collection of pre-processing scripts and a web browser-based tool for visualizing and interacting with high dimensional data.',
    'version': '0.1.2',
    'vignettes': [
        {
            'icon': 'assets/icons/example_hpc_sf2-spring.png',
            'link': '/dataset?name=hpc_sf2/full&viz=spring',
            'name': 'HPC (hematopoietic progenitor cells)',
            'summary':
            'Analysis of 33,473 hematopoietic progenitor cells as they differentiate over 6 days.\
       Barcodes were introduced at day 0 and cell lineage relationships were traced by\
       identifying progeny from their barcodes in scRNAseq of aliquots of the same population taken at several timepoints.',
        },
    ],
    'uuid': '12345678-abcd-1234-abcd-a1234567890b',
}

print(v.validate(correctDocument))
print(v.errors)
