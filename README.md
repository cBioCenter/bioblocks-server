# Bioblocks Server

Bioblocks Server is the backend component for making data from the [Human Cell Atlas](https://www.humancellatlas.org/), and analyses derived from them, available via REST API.

The server utilizes [Eve](https://docs.python-eve.org/en/stable/) as a REST framework with [Cerberus](https://docs.python-cerberus.org/en/stable/) for schema validation. The top level collections are found inside `src/bb_schema`.

[![CircleCI](https://circleci.com/gh/cBioCenter/bioblocks-server.svg?style=shield)](https://circleci.com/gh/cBioCenter/bioblocks-server)[![GitHub license](https://img.shields.io/github/license/cBioCenter/bioblocks-portal.svg?style=flat)](https://github.com/cBioCenter/bioblocks-server/blob/master/LICENSE)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)[![Coverage Status](https://img.shields.io/codecov/c/github/cBioCenter/bioblocks-server/master.svg)](https://codecov.io/gh/cBioCenter/bioblocks-server/branch/master)

<!-- TOC -->

- [Bioblocks Server](#bioblocks-server)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Running in Production](#running-in-production)
    - [Service File](#service-file)
    - [(Re)Starting the service](#restarting-the-service)
  - [Data](#data)
    - [Manually Populating Mongo Data](#manually-populating-mongo-data)
    - [Manual Populating Analysis Data](#manual-populating-analysis-data)
  - [Process Scripts](#process-scripts)
    - [Customizing the Process Scripts](#customizing-the-process-scripts)
    - [Run Cron Job As Background Process](#run-cron-job-as-background-process)
  - [Folder Structure](#folder-structure)

<!-- /TOC -->

## Installation

1. Install Dependencies

   OSX

   ```sh
   ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   brew update
   brew doctor
   brew install caskroom/cask/brew-cask
   brew cleanup && brew cask cleanup
   sudo easy_install pip
   pip install --upgrade pip
   brew install python3 pipenv mongodb nginx circleci
   ```

   Linux

   ```sh
   sudo apt-get update && sudo apt-get install -y cmake mongodb nginx &&
   sudo pip install --user pipenv &&
   pipenv install -d &&
   pipenv sync
   ```

2. Clone repo, initialize SPRING repository, and install python-specific dependencies.

   ```sh
   git clone https://github.com/cBioCenter/bioblocks-server.git
   cd bioblocks-server
   git submodule update --init
   pipenv install
   pipenv shell
   pip install multicoretsne #Fails if in the Pipfile, so need to run in shell.
   ```

3. Setup mongo

   ```sh
   mkdir -p /data/db
   sudo chown -R `id -un` /data/db
   mongod
   mongo
   ```

## Running Locally

```sh
cd bioblocks-server
pipenv run start
```

## Running in Production

⚠️ Currently the documentation and configuration for bioblocks-server assumes the production environment is CentOS 7. ⚠️

### Service File

In addition to the setup mentioned in [Installation](#installation), for production you will want to setup bioblocks-server as a System D process. System D is used to unify service configuration and behavior across Linux distributions. More info regarding service files can be found [here](https://www.freedesktop.org/software/systemd/man/systemd.service.html)

Here is an example `service file`:

```service
[Unit]
Description=uWSGI instance to serve bioblocks-server
After=network.target

[Service]
User=chell
Group=nginx
WorkingDirectory=/home/chell/git/bioblocks-server
Environment="PATH=/home/chell/venv/bioblocks-server/bin"
ExecStart=/home/chell/venv/bioblocks-server/bin/uwsgi --ini src/bioblocks-server.ini

[Install]
WantedBy=multi-user.target
```

This file should be saved as /etc/systemd/system/bioblocks-server.service.

### (Re)Starting the service

❗️IMPORTANT ❗️

Make sure you move the socket file if restarting the server manually!

```sh
cd bioblocks-server
sudo systemctl restart bioblocks-server.service
mv bioblocks-server.sock ./src/
```

## Data

For bioblocks-server, data is stored in one of two locations: Mongo for metadata, and on the filesystem for the raw and analyzed project data.

### Manually Populating Mongo Data

There are two ways to fill the mongo database - Manually populating it with a `json` file containing the entires to enter, or via our [process scripts](#process-scripts).

The former method requires creating a json file with the entires to be inserted. Consider the following, saved as `custom_file.json`:

```json
{
  "analyses": [
    {
      "_id": "aaaaaaaa-0000-0000-0001-a1234567890b",
      "name": "HPC - SPRING",
      "processType": "SPRING"
    }
  ],
  "datasets": [
    {
      "_id": "bbdeeded-0000-0000-0001-a1234567890b",
      "analyses": ["aaaaaaaa-0000-0000-0001-a1234567890b"],
      "authors": ["Caleb Weinreb", "Samuel Wolock", "Allon Klein"],
      "name": "Hematopoietic Progenitor Cells",
      "species": "homo_sapiens"
    },
    {
      "_id": "091cf39b-01bc-42e5-9437-f419a66c8a45",
      "analyses": [],
      "matrixLocation": "files/datasets/091cf39b-01bc-42e5-9437-f419a66c8a45/matrix/matrix.mtx",
      "authors": [],
      "name": "Human Hematopoietic Profiling"
    }
  ],
  "visualizations": [
    {
      "_id": "bbfacade-0000-0000-0001-a1234567890b",
      "authors": ["klein", "sander"],
      "citations": [
        {
          "fullCitation": "Weinreb, Caleb, Samuel Wolock, and Allon M. Klein",
          "link": "https://www.ncbi.nlm.nih.gov/pubmed/29228172"
        }
      ],
      "compatibleData": ["live tSNE", "UMAP", "PCA"],
      "exampleDataset": "bbdeeded-0000-0000-0001-a1234567890b",
      "icon": "assets/icons/spring-icon.png",
      "isOriginal": true,
      "labels": ["1"],
      "location": "spring/springViewer.html",
      "name": "SPRING",
      "repo": {
        "lastUpdate": "2018.03.12",
        "link": "https://github.com/AllonKleinLab/SPRING_dev",
        "version": "2.0.0"
      },
      "summary": "A collection of pre-processing scripts and a web browser-based tool for visualizing and interacting with high dimensional data.",
      "version": "0.1.2"
    }
  ],
  "vignettes": [
    {
      "_id": "bbdecade-0000-0000-0002-a1234567890b",
      "authors": ["Nicholas Gauthier", "Drew Diamantoukos"],
      "dataset": "bbdeeded-0000-0000-0001-a1234567890b",
      "icon": "assets/icons/example_HPC_spring-tsne-anatomogram.png",
      "name": "HPC - SPRING vs UMAP",
      "summary": "Example interaction between SPRING, tSNE and Anatomogram visualization on a small dataset.",
      "visualizations": ["bbfacade-0000-0000-0001-a1234567890b"]
    }
  ]
}
```

```sh
pipenv shell
python test/db_populate.py custom_file.json
```

This will populate the mongo database with that metadata. The usage of `pipenv shell` creates a virtualenv shell for more consistent python script usage for this project.

If you run this command, the default file of `test/db_init.json` will be used:

```sh
pipenv shell
python test/db_populate.py
```

### Manual Populating Analysis Data

Invoking an analysis is done via our [process scripts](#process-scripts), regardless of how metadata was inserted into mongo. This means if you manually want to start an analysis, you will need to ensure the raw matrix data exists in the correct location on the filesystem.

Consider the following snippet from the `json` above:

```json
"datasets": [
   {
      "_id": "091cf39b-01bc-42e5-9437-f419a66c8a45",
      "analyses": [],
      "matrixLocation": "files/datasets/091cf39b-01bc-42e5-9437-f419a66c8a45/matrix/matrix.mtx",
      "authors": [],
      "name": "Human Hematopoietic Profiling"
    }
  ],
```

The value for matrixLocation is used by our [process scripts](#process-scripts) when running an analysis. When data is obtained from the HCA, this is handled by a process script for interacting with the HCA matrix service.
**When manually inserting data, you will need to make sure the files exist yourself!** This example `091cf39b-01bc-42e5-9437-f419a66c8a45` is included in the repo, though.

This matrix can be in one of 3 forms: A raw `.mtx` file, a `.zip`, or a `.mtx.gz` - Extraction, if needed, is handled automatically.

You will likely want to take a look at [Customizing the Process Scripts](#customizing-the-process-scripts) if you want to only run a specific analysis.

## Process Scripts

Inside the `utils` folder are a number of process scripts to do the following:

- Insert datasets from the HCA into bioblocks-server.
- Communicate with the HCA Matrix Service to create / check on jobs for matrix creation.
- Run SPRING on all datasets.
- Run T-SNE on all datasets.

This process can be manually started by running:

```sh
cd bioblocks-server
pipenv run cron_job
```

The entry point for this is the file `utils/bioblocks_server_cron_job.py`.

### Customizing the Process Scripts

Currently the mechanism to switch which of the 4 processes scripts run requires some manual editing. In the aforementioned `bioblocks_server_cron_job.py` is the line:

```python
scripts = ['hca_get_bundles', 'hca_matrix_jobs', 'generate_spring_analysis', 'generate_tsne_analysis']
```

Each string represents a script that does, well, what it says on the tin. So if you want to, for example, only get the bundles and run the matrix jobs, you'd need to change this line to:

```python
scripts = ['hca_get_bundles', 'hca_matrix_jobs']
```

If you'd like to run the scripts on only a limited amount of datasets, that will unfortunately require more in-depth script editing at the moment. The scripts iterate over all the datasets like so:

```python
  datasets = json.loads(r.text)['_items']
  for dataset in datasets:
     process(dataset)
```

Running on the first dataset only, then, could be:

```python
   dataset = json.loads(r.text)['_items'][0]
   process(dataset)
```

### Run Cron Job As Background Process

This is useful if you don't want to leave your ssh session open while running the cron job.

```sh
cd bioblocks-server
ssh user@your.ip.address.here
cd bioblocks-server
nohup pipenv run cron_job &
```

## Folder Structure

The folder structure of our raw and analyzed project data is stored as the following:

```text
bioblocks-server
|- files
|  |- datasets
|  |  |- {dataset_uuid}
|  |  |  |- analyses
|  |  |  |  |- {analysis_uuid}
|  |  |  |  |  | analyses file/folder 1
|  |  |  |  |  | analyses file/folder 2
|  |  |  |  |  ...
```

Analyses file refers to the output of that analysis.

For SPRING, the folder looks like:

```text
|- {analysis_uuid}
|  |- {analysis_name}
|  |  |- categorical_coloring_data.json
|  |  |- clone_map.json
|  |  |- coordinates.txt
|  |  |- graph_data.json
|  |  |- pca.csv
|  |  |- cell_filter.npy
|  |  |- color_data_gene_sets.csv
|  |  |- edges.csv
|  |  |- louvain_clusters.npy
|  |  |- run_info.json
|  |  |- cell_filter.txt.npy
|  |  |- color_stats.json
|  |  |- genes.txt
|  |  |- mutability.txt
```

For T-SNE, the folder looks like:

```text
|- {analysis_uuid}
|  |- tsne_matrix.csv
|  |- tsne_output.csv
```

If you are manually populating mongo, **you must create this directory structure** - The process scripts, however, handle this automatically.
