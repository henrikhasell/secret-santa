from flask_restx import fields, Model, Namespace


namespace = Namespace("models")

message_model = namespace.model("Message", {
    'message': fields.String(example="A message from the server.", required=True),
    'status': fields.String(example="success", enum=["success", "failure"], required=True),
})

participant_model = namespace.model("Participant", {
    'name': fields.String(example="John Doe", required=True),
})


