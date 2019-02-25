# Bioblocks Server

## Running (requires installation - see below)

```python
source ~/venv/bioblockserver/bin/activate
cd INSTALLATION_DIRECTORY
python src/app.py
```

## Installation

1. Install homebrew, python3, virtualenv

```python
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

```python
mkdir ~/venv
cd ~/venv
virtualenv -p python3 bioblockserver
source ~/venv/bioblockserver/bin/activate
pip install eve
```

3. Install mongo

```python
brew install mongodb
mkdir -p /data/db
sudo chown -R `id -un` /data/db
mongod
mongo
```
