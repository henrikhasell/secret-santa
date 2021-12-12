from flask_restx import fields, Namespace, Resource

from secret_santa.participant import Participant
from secret_santa.web.blueprints.api.models import message_model, participant_model
from secret_santa.web.cutoff import cutoff_reached
from secret_santa.web.secret import get_secret
from secret_santa.web.storage import add_participant, get_participants, remove_participant


namespace = Namespace("participants")

ADD_PARTICIPANT_FAILURE = {
    "message": "Failed to add participant.",
    "status": "failure"
}

REMOVE_PARTICIPANT_FAILURE = {
    "message": "Failed to remove participant.",
    "status": "failure"
}

REMOVE_PARTICIPANT_SUCCESS = {
    "message": "Successfully removed participant.",
    "status": "success"
}


@namespace.route("")
class ParticipantListResource(Resource):
    @namespace.expect(participant_model)
    @namespace.marshal_with(message_model)
    def delete(self):
        """Remove a participant."""
        participant = Participant.deserialize(namespace.payload)
        if cutoff_reached() or not remove_participant(participant):
            return REMOVE_PARTICIPANT_FAILURE
        return REMOVE_PARTICIPANT_SUCCESS

    @namespace.marshal_list_with(participant_model)
    def get(self):
        """Get list of all participants."""
        return [i.serialize() for i in get_participants()]

    @namespace.expect(participant_model)
    @namespace.marshal_with(message_model)
    def post(self):
        """Add a participant."""
        participant = Participant.deserialize(namespace.payload)
        if cutoff_reached() or not add_participant(participant):
            return ADD_PARTICIPANT_FAILURE
        return {"message": get_secret(participant), "status": "success"}

