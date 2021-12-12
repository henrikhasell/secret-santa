# Secret Santa

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