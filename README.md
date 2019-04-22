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
