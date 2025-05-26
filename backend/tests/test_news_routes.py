import json
import pytest
import sys
import os
from unittest.mock import patch, MagicMock

# Add the parent directory to sys.path to allow importing from the root directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    """Creates a test client for the app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('services.news_service.requests.get')
def test_get_top_headlines(mock_get, client):
    """Test getting top headlines"""
    # Mock response data
    mock_response = MagicMock()
    mock_response.json.return_value = {
        'status': 'ok',
        'articles': [
            {
                'title': 'Test Article 1',
                'description': 'This is a test article',
                'url': 'https://example.com/article1',
                'urlToImage': 'https://example.com/image1.jpg',
                'publishedAt': '2023-04-20T12:00:00Z',
                'source': {'name': 'Test Source'}
            },
            {
                'title': 'Test Article 2',
                'description': 'This is another test article',
                'url': 'https://example.com/article2',
                'urlToImage': 'https://example.com/image2.jpg',
                'publishedAt': '2023-04-20T13:00:00Z',
                'source': {'name': 'Test Source'}
            }
        ]
    }
    mock_response.status_code = 200
    mock_get.return_value = mock_response

    # Send request
    response = client.get('/api/news/top-headlines?country=in&pageSize=2')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 2
    assert data['data'][0]['title'] == 'Test Article 1'
    assert data['data'][1]['title'] == 'Test Article 2'

@patch('services.news_service.requests.get')
def test_get_news_by_category(mock_get, client):
    """Test getting news by category"""
    # Mock response data
    mock_response = MagicMock()
    mock_response.json.return_value = {
        'status': 'ok',
        'articles': [
            {
                'title': 'Test Tech Article',
                'description': 'This is a test tech article',
                'url': 'https://example.com/tech-article',
                'urlToImage': 'https://example.com/tech-image.jpg',
                'publishedAt': '2023-04-20T12:00:00Z',
                'source': {'name': 'Tech Source'}
            }
        ]
    }
    mock_response.status_code = 200
    mock_get.return_value = mock_response

    # Send request
    response = client.get('/api/news/category/technology?country=in')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['title'] == 'Test Tech Article'
    assert data['data'][0]['source']['name'] == 'Tech Source'

@patch('services.news_service.requests.get')
def test_search_news(mock_get, client):
    """Test searching news"""
    # Mock response data
    mock_response = MagicMock()
    mock_response.json.return_value = {
        'status': 'ok',
        'articles': [
            {
                'title': 'Test Search Result',
                'description': 'This is a test search result',
                'url': 'https://example.com/search-result',
                'urlToImage': 'https://example.com/search-image.jpg',
                'publishedAt': '2023-04-20T12:00:00Z',
                'source': {'name': 'Search Source'}
            }
        ]
    }
    mock_response.status_code = 200
    mock_get.return_value = mock_response

    # Send request
    response = client.get('/api/news/search?q=test+query')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['title'] == 'Test Search Result'

@patch('services.news_service.requests.get')
def test_error_handling(mock_get, client):
    """Test error handling in news routes"""
    # Mock error response
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_get.side_effect = Exception("API Error")

    # Send request
    response = client.get('/api/news/top-headlines')
    
    # Check response
    assert response.status_code == 500
    data = json.loads(response.data)
    assert data['status'] == 'error' 