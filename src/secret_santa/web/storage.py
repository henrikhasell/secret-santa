from typing import List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

from secret_santa.participant import Participant


db = SQLAlchemy()


class ParticipantModel(db.Model):
    name = db.Column(db.String, nullable=False, primary_key=True)


def add_participant(participant: Participant) -> bool:
    participant_model = ParticipantModel(**participant.serialize())
    db.session.add(participant_model)
    try:
        db.session.commit()
    except IntegrityError:
        return False
    return True


def find_participant(participant: Participant) -> bool:
    return ParticipantModel.query.filter_by(**participant.serialize()).one_or_none() is not None


def get_participants() -> List[Participant]:
    return [Participant(i.name) for i in ParticipantModel.query.all()]

def remove_participant(participant: Participant) -> bool:
    participant_model = ParticipantModel.query.filter_by(**participant.serialize()).one_or_none()

    if not participant_model:
        return False

    db.session.delete(participant_model)
    db.session.commit()

    return True
