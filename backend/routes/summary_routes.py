from flask import Blueprint, jsonify, request
from services.nlp_service import summarize_text, categorize_text

summary_bp = Blueprint('summary', __name__)

@summary_bp.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Text is required for summarization'
        }), 400
    
    text = data['text']
    max_length = data.get('max_length', 150)
    
    try:
        summary = summarize_text(text, max_length)
        category = categorize_text(text)
        
        return jsonify({
            'status': 'success',
            'data': {
                'summary': summary,
                'category': category
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@summary_bp.route('/categorize', methods=['POST'])
def categorize():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Text is required for categorization'
        }), 400
    
    text = data['text']
    
    try:
        category = categorize_text(text)
        return jsonify({
            'status': 'success',
            'data': {
                'category': category
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
