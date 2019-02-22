#!/usr/local/bin/python

import json
import requests

with open('test/db_init.json') as f:
    data = json.load(f)

API_ENDPOINT = "http://localhost:8080/visualization"
r = requests.post(
    url = API_ENDPOINT, 
    data = json.dumps(data),
    headers = {'Content-type': 'application/json'}
) 
print(r.text)

#print(json.dumps(data))