# Bioblocks Server

## Running (requires installation - see below)

```
source ~/venv/bioblockserver/bin/activate
cd INSTALLATION_DIRECTORY
python bioblocks_server/app.py
```


## Installation

1. Install homebrew, python3, virtualenv
```
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
```
mkdir ~/venv
cd ~/venv
virtualenv -p python3 bioblockserver
source ~/venv/bioblockserver/bin/activate
pip install eve
```
2. Install mongo
```
brew install mongodb
mkdir -p /data/db
sudo chown -R `id -un` /data/db
mongod
mongo
```
