import hashlib
import os

from secret_santa.participant import Participant


def get_secret(participant: Participant):
    salt = os.environ.get("SECRET_SANTA_SALT", "")
    bytes_ = f"{salt}{str(participant)}".encode("utf-8")
    hash_ = hashlib.sha256(bytes_).hexdigest()
    return hash_[:10]
