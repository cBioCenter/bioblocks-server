# Bioblocks Server

Bioblocks Server is the backend component for running analyses on data from the [Human Cell Atlas](https://www.humancellatlas.org/) and making them available via REST API.

[![CircleCI](https://circleci.com/gh/cBioCenter/bioblocks-server.svg?style=shield)](https://circleci.com/gh/cBioCenter/bioblocks-server)[![GitHub license](https://img.shields.io/github/license/cBioCenter/bioblocks-portal.svg?style=flat)](https://github.com/cBioCenter/bioblocks-server/blob/master/LICENSE)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)[![Coverage Status](https://img.shields.io/codecov/c/github/cBioCenter/bioblocks-server/master.svg)](https://codecov.io/gh/cBioCenter/bioblocks-server/branch/master)

<!-- TOC -->

- [Bioblocks Server](#bioblocks-server)
  - [Installation](#installation)
  - [Running Locally (requires installation - see below)](#running-locally-requires-installation---see-below)
  - [Running in Production](#running-in-production)
    - [Service File](#service-file)
    - [(Re)Starting the service](#restarting-the-service)
  - [Example Production usage](#example-production-usage)
    - [File transfer](#file-transfer)
    - [Run Cron Job Manually](#run-cron-job-manually)
    - [Run Cron Job As Background Process](#run-cron-job-as-background-process)

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
   brew install python3 pipenv circleci
   ```

   Linux

   ```sh
   sudo apt-get update && sudo apt-get install -y cmake &&
   sudo pip install --user pipenv &&
   pipenv install -d &&
   pipenv sync
   ```

2. Clone repo and install python-specific dependencies.

   ```sh
   git clone git@github.com:cBioCenter/bioblocks-portal.git
   cd bioblocks-portal
   pipenv install
   pipenv shell
   pip install multicoretsne #Fails if in the Pipfile, so need to run in shell.
   ```

3. Install mongo

   ```sh
   brew install mongodb
   mkdir -p /data/db
   sudo chown -R `id -un` /data/db
   mongod
   mongo
   ```

4. Install nginx

   ```sh
   brew install nginx
   ```

5. Running the server locally

   ```sh
   pipenv run start
   ```

## Running Locally (requires installation - see below)

```sh
pipenv run start
```

## Running in Production

⚠️ Currently the documentation and configuration for bioblocks-server assumes the production environment is CentOS 7. ⚠️

### Service File

In addition to the setup mentioned in [Installation](#installation), for production you will want to setup bioblocks-server as a System D process. Here is an example `service file`:

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

This file should be saved as /etc/systemd/system/bioblocks-server.service. More info regarding service files can be found [here](https://www.freedesktop.org/software/systemd/man/systemd.service.html)

### (Re)Starting the service

❗️IMPORTANT ❗️

Make sure you move the socket file if restarting the server manually!

```sh
cd bioblocks-server
sudo systemctl restart bioblocks-server.service
mv bioblocks-server.sock ./src/

```

## Example Production usage

### File transfer

```sh
cd bioblocks-server
scp -r files/datasets/bbdeeded-0000-0000-0001-a1234567890b files/datasets/bbdeeded-0000-0000-0002-a1234567890b user@your.ip.address.here:~/bioblocks-server/files/datasets
ssh user@your.ip.address.here
cd bioblocks-server
pipenv shell
python test/db_populate.py
```

### Run Cron Job Manually

```sh
cd bioblocks-server
ssh user@your.ip.address.here
cd bioblocks-server
pipenv run cron_job
```

### Run Cron Job As Background Process

This is useful if you don't want to leave your ssh session open while running the cron job.

```sh
cd bioblocks-server
ssh user@your.ip.address.here
cd bioblocks-server
nohup pipenv run cron_job &
```
