from typing import Optional

from flask_restx import fields, Namespace, Resource

from secret_santa.participant import Participant
from secret_santa.picker import assign_pairs
from secret_santa.web.blueprints.api.models import message_model
from secret_santa.web.cutoff import cutoff_reached
from secret_santa.web.secret import get_secret
from secret_santa.web.storage import add_participant, get_participants, find_participant, remove_participant


namespace = Namespace("result")


def validate_secret(participant: Participant, secret: str):
    return find_participant(participant) and get_secret(participant) == secret


def get_elf(participant: Participant) -> Optional[Participant]:
    pairs = assign_pairs(set(get_participants()), 0)
    return pairs[participant]


@namespace.route("/<name>/<secret>")
class ResultResource(Resource):
    @namespace.marshal_with(message_model)
    def get(self, name: str, secret: str):
        """Find your elf."""
        if not cutoff_reached():
            return {"message": "Try again later.", "status": "failure"}

        participant = Participant(name)

        if not validate_secret(participant, secret):
            return {"message": "Invalid secret.", "status": "failure"}
        
        return {"message": get_elf(participant).name, "status": "success"}