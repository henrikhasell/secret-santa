from flask import Flask, send_from_directory

from secret_santa.web.blueprints.api import blueprint as api_blueprint
from secret_santa.web.storage import db


app = Flask(__name__)
app.config['RESTX_MASK_SWAGGER'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/santa")
@app.route("/santa/<path:route>")
def index(route="index.html"):
    return send_from_directory("build", route)


@app.errorhandler(404)
def page_not_found(e):
    return index()


app.register_blueprint(api_blueprint, url_prefix="/santa/api")
