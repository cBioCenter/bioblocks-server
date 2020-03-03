#!/usr/local/bin/python
import json
import requests
import sys


URL_ROOT = 'http://localhost:11037/{0}'
jsonkey_endpoint_dict = {
    'analyses': 'analysis',
    'datasets': 'dataset',
    'visualizations': 'visualization',
    'vignettes': 'vignette'
}

if (len(sys.argv) >= 2):
    json_file = str(sys.argv[1])
else:
    json_file = 'test/db_init.json'

data = None
with open(json_file) as f:
    data = json.load(f)

for jsonkey in jsonkey_endpoint_dict:
    endpoint = URL_ROOT.format(jsonkey_endpoint_dict[jsonkey])
    objects = data[jsonkey]

    print('POSTING {0} {1} to {2}'.format(
        len(objects), jsonkey, endpoint
    ))

    """
    for obj in objects:
        if 'icon' in obj:
            with open(obj['icon'], 'rb') as icon:
                icon_as_base64 = base64.encodestring(
                    icon.read()).decode('ascii')
                print(icon_as_base64)
                obj['icon'] = 'data:image/' + icon_as_base64

        r = requests.post(
            url=endpoint,
            data=json.dumps(obj),
            headers={'Content-type': 'application/json'}
        )
        print(r.text)
    """
    for obj in objects:
        if 'icon' in obj:
            icon = obj.pop('icon', None)
            r = requests.post(
                url=endpoint,
                data=json.dumps(obj),
                headers={'Content-type': 'application/json'}
            )
            resource_url = '{}/{}'.format(endpoint, obj['_id'])

            # If the resource already exists, get the latest so we can patch it.
            if r.status_code == 409:
                r = requests.get(
                    url=resource_url,
                )

            files = {'icon': open(icon, 'rb')}
            r = requests.patch(
                url=resource_url,
                files=files,
                headers={'If-Match': json.loads(r.text)['_etag']}
            )
            print(r.text)
        else:
            r = requests.post(
                url=endpoint,
                data=json.dumps(obj),
                headers={'Content-type': 'application/json'}
            )
            print(r.text)
