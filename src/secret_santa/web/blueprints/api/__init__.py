from flask import Blueprint
from flask_restx import Api

from .cutoff import namespace as cutoff_namespace
from .models import namespace as models_namespace
from .participants import namespace as participants_namespace
from .result import namespace as result_namespace


blueprint = Blueprint("api", __name__)

api = Api(blueprint, doc="/docs", title="Secret Santa", validate=True, version="alpha",)
api.add_namespace(cutoff_namespace)
api.add_namespace(models_namespace)
api.add_namespace(participants_namespace)
api.add_namespace(result_namespace)

