import os

# Flask configuration
DEBUG = True
PORT = 5000

# Database configuration
SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db' 
SQLALCHEMY_TRACK_MODIFICATIONS = False

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret')  # Change in production
JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour

# News API
NEWS_API_KEY = '1d87918962eb411d8b22687ef2fcf44d'
NEWS_API_URL = 'https://newsapi.org/v2'

# Categories
CATEGORIES = ['business', 'technology', 'sports', 'entertainment', 'science', 'health', 'general']
