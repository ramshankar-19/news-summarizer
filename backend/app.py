from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import config
import os
import sys




# Set up the import path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import models and routes after setting up the path
from models import db
from routes.news_routes import news_bp
from routes.summary_routes import summary_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(news_bp, url_prefix='/api/news')
app.register_blueprint(summary_bp, url_prefix='/api/summary')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=config.DEBUG, port=config.PORT)
