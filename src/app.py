"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
import random

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)

CORS(app)

app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "nuestra_clave_secreta"
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json(silent=True)

    if not data or "email" not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        user = User(id=random.randint(100, 999999),
                    email=data["email"],
                    password=data["password"],
                    is_active=True
                    )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def handle_login():
    try:
        
        data = request.get_json(silent=True)
        email = data.get("email")

        created = User.query.get(email)
        if created is None:
            return jsonify({"error": "Planeta no encontrado"}), 404

        access_token = create_access_token(identity=str(data))

        return jsonify({"ok":True, "msg": "Login exitoso", "access_token":access_token}),200
    except Exception as e:
        print("Error: ", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg":str(e)}),500


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
