#!/usr/local/bin/python

import json
import requests

vignette = {
    "icon": "assets/icons/example_hpc_sf2-spring.png",
    "link": "/dataset?name=hpc_sf2/full&viz=spring",
    "name": "HPC (hematopoietic progenitor cells)",
    "summary": "Analysis of 33,473 hematopoietic progenitor cells as they differentiate over 6 days. Barcodes were introduced at day 0 and cell lineage relationships were traced by identifying progeny from their barcodes in scRNAseq of aliquots of the same population taken at several timepoints."
}

API_ENDPOINT = "http://localhost:8080/vignette"
r = requests.post(
    url=API_ENDPOINT,
    data=json.dumps(vignette),
    headers={'Content-type': 'application/json'}
)
print(r.text)

with open('test/db_init.json') as f:
    data = json.load(f)

API_ENDPOINT = "http://localhost:8080/visualization"
r = requests.post(
    url=API_ENDPOINT,
    data=json.dumps(data),
    headers={'Content-type': 'application/json'}
)
print(r.text)
