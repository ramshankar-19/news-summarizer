from flask import Blueprint, jsonify, request
from services.news_service import get_top_headlines, get_news_by_category, search_news

news_bp = Blueprint('news', __name__)

@news_bp.route('/top-headlines', methods=['GET'])
def top_headlines():
    country = request.args.get('country', 'in')
    page_size = request.args.get('pageSize', 10, type=int)
    
    try:
        articles = get_top_headlines(country, page_size)
        return jsonify({
            'status': 'success',
            'data': articles
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@news_bp.route('/category/<category>', methods=['GET'])
def news_by_category(category):
    country = request.args.get('country', 'in')
    page_size = request.args.get('pageSize', 10, type=int)
    
    try:
        articles = get_news_by_category(category, country, page_size)
        return jsonify({
            'status': 'success',
            'data': articles
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@news_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Query parameter is required'
        }), 400
    
    page_size = request.args.get('pageSize', 10, type=int)
    
    try:
        articles = search_news(query, page_size)
        return jsonify({
            'status': 'success',
            'data': articles
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
