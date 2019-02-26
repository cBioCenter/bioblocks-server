#!/usr/local/bin/python

import json
import requests

URL_ROOT = 'http://localhost:8080/{0}'
jsonkey_endpoint_dict = {
    'visualizations': 'visualization',
    'vignettes': 'vignette'
}

data = None
with open('test/db_init.json') as f:
    data = json.load(f)

for jsonkey in jsonkey_endpoint_dict:
    endpoint = URL_ROOT.format(jsonkey_endpoint_dict[jsonkey])
    objects = data[jsonkey]

    print('POSTING {0} {1} to {2}'.format(
        len(objects), jsonkey, endpoint
    ))

    for obj in objects:
        r = requests.post(
            url=endpoint,
            data=json.dumps(obj),
            headers={'Content-type': 'application/json'}
        )
        print(r.text)
