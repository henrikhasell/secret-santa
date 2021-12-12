# Secret Santa

A web app using Python + React for a group of friends to allocate secret santa.

## Building Docker container

```sh
docker build -t secret-santa .
```

## Running Docker container

This can also be used to deploy your app to production.

```sh
docker run -p 5000:5000 secret-santa
```

## Running Locally

```sh
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export FLASK_APP=secret_santa.web.app
export PYTHONPATH=src
export SECRET_SANTA_CUTOFF_DATETIME=2021-12-20
export SECRET_SANTA_SALT=mysecret

flask run
```
