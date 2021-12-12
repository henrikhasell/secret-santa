from flask import Response
from flask_restx import Namespace, Resource

from secret_santa.web.cutoff import get_cutoff


namespace = Namespace("cutoff")


@namespace.route("")
class CutoffResource(Resource):
    def get(self):
        """Time at which secret santa is revealed."""
        return Response(get_cutoff().isoformat(), mimetype="text/plain")
