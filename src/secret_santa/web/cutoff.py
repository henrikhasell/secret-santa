import os

from datetime import datetime, timezone


def get_cutoff() -> datetime:
    date_string = os.environ["SECRET_SANTA_CUTOFF_DATETIME"]
    return datetime.fromisoformat(date_string).replace(tzinfo=timezone.utc)


def cutoff_reached() -> bool:
    return datetime.now().replace(tzinfo=timezone.utc) >= get_cutoff()
