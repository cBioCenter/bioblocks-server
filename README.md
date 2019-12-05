# Bioblocks Server

## Running (requires installation - see below)

```sh
pipenv run start
```

## Installation

1. Install homebrew, python3, pipenv, circleci

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

2. Setup python environment and install python dependencies

   ```sh
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

5. Running CI/CD Tests locally

   ```sh
   circleci local execute --job build
   ```

6. Service file

```service
[Unit]
Description=uWSGI instance to serve bioblock$
After=network.target

[Service]
User=chell
Group=nginx
WorkingDirectory=/home/chell/git/bioblocks-s$
Environment="PATH=/home/chell/venv/bioblocks$
ExecStart=/home/chell/venv/bioblocks-server/$

[Install]
WantedBy=multi-user.target
```