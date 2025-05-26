import requests
from config import NEWS_API_KEY, NEWS_API_URL
import json
import os
from datetime import datetime, timedelta
import time

# Cache settings
CACHE_DIR = 'cache'
CACHE_DURATION = 30  # minutes

def get_cache_path(endpoint, params):
    """Generate cache file path based on endpoint and parameters"""
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)
    param_str = '_'.join(f"{k}_{v}" for k, v in sorted(params.items()) if k != 'apiKey')
    return os.path.join(CACHE_DIR, f"{endpoint}_{param_str}.json")

def load_cache(cache_path):
    """Load cached data if it exists and is not expired"""
    try:
        if os.path.exists(cache_path):
            with open(cache_path, 'r') as f:
                cache_data = json.load(f)
                cache_time = datetime.fromisoformat(cache_data['timestamp'])
                if datetime.now() - cache_time < timedelta(minutes=CACHE_DURATION):
                    return cache_data['data']
    except Exception:
        pass
    return None

def save_cache(cache_path, data):
    """Save data to cache"""
    try:
        cache_data = {
            'timestamp': datetime.now().isoformat(),
            'data': data
        }
        with open(cache_path, 'w') as f:
            json.dump(cache_data, f)
    except Exception as e:
        print(f"Error saving cache: {e}")

def make_api_request(url, params):
    """Make API request with rate limit handling"""
    try:
        response = requests.get(url, params=params)
        
        if response.status_code == 429:  # Rate limit exceeded
            # Return cached data if available
            cache_path = get_cache_path(url.split('/')[-1], params)
            cached_data = load_cache(cache_path)
            if cached_data:
                return cached_data
            
            # If no cache, wait and retry once
            time.sleep(2)
            response = requests.get(url, params=params)
        
        response.raise_for_status()
        data = response.json()
        
        # Cache successful response
        cache_path = get_cache_path(url.split('/')[-1], params)
        save_cache(cache_path, data)
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
        # Try to return cached data as fallback
        cache_path = get_cache_path(url.split('/')[-1], params)
        cached_data = load_cache(cache_path)
        if cached_data:
            return cached_data
        raise

def get_top_headlines(country='in', page_size=10):
    """Fetch top headlines from News API with caching"""
    url = f"{NEWS_API_URL}/top-headlines"
    params = {
        'country': country,
        'pageSize': page_size,
        'apiKey': NEWS_API_KEY
    }
    
    data = make_api_request(url, params)
    return data.get('articles', [])

def get_news_by_category(category, country='in', page_size=10):
    """Fetch news by category from News API with caching"""
    url = f"{NEWS_API_URL}/top-headlines"
    params = {
        'category': category,
        'country': country,
        'pageSize': page_size,
        'apiKey': NEWS_API_KEY
    }
    
    data = make_api_request(url, params)
    return data.get('articles', [])

def search_news(query, page_size=10):
    """Search for news with caching"""
    url = f"{NEWS_API_URL}/everything"
    params = {
        'q': query,
        'pageSize': page_size,
        'apiKey': NEWS_API_KEY,
        'sortBy': 'publishedAt'
    }
    
    data = make_api_request(url, params)
    return data.get('articles', [])
