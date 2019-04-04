# Bioblocks Server

## Running (requires installation - see below)

```python
source ~/venv/bioblocks-server/bin/activate
cd INSTALLATION_DIRECTORY
python src/bioblocks_server.py
```

## Installation

1. Install homebrew, python3, virtualenv

   ```sh
   ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   brew update
   brew doctor
   brew install caskroom/cask/brew-cask
   brew cleanup && brew cask cleanup
   sudo easy_install pip
   pip install --upgrade pip
   brew install python3
   sudo pip3 install virtualenv
   ```

2. Setup python environment and install python dependencies

   ```sh
   mkdir ~/venv
   cd ~/venv
   virtualenv -p python3 bioblocks-server
   source ~/venv/bioblocks-server/bin/activate
   pip install eve
   pip install requests
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
