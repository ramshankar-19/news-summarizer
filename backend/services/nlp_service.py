import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.probability import FreqDist
from collections import defaultdict
import string
import re

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

def summarize_text(text, max_length=150):
    """
    Summarize the given text using extractive summarization technique.
    
    Args:
        text (str): The text to summarize
        max_length (int): Maximum length of the summary in words
        
    Returns:
        str: The summarized text
    """
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Remove punctuation and convert to lowercase
    clean_text = re.sub(r'[^\w\s]', '', text.lower())
    
    # Tokenize the text into words
    words = word_tokenize(clean_text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word not in stop_words]
    
    # Calculate word frequencies
    word_frequencies = FreqDist(filtered_words)
    
    # Calculate sentence scores based on word frequencies
    sentence_scores = defaultdict(int)
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence.lower()):
            if word in word_frequencies:
                sentence_scores[i] += word_frequencies[word]
    
    # Get top sentences
    sentence_count = min(5, len(sentences))
    top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:sentence_count]
    top_sentences = sorted(top_sentences, key=lambda x: x[0])
    
    # Construct summary
    summary = ' '.join([sentences[i] for i, _ in top_sentences])
    
    # Truncate summary if it's too long
    summary_words = summary.split()
    if len(summary_words) > max_length:
        summary = ' '.join(summary_words[:max_length]) + '...'
    
    return summary

def categorize_text(text):
    """
    Categorize the given text into predefined categories.
    """
    # Define category keywords
    categories = {
        'business': ['business', 'economy', 'market', 'stock', 'finance', 'company', 'industry', 'trade'],
        'technology': ['technology', 'tech', 'software', 'hardware', 'app', 'digital', 'internet', 'cyber', 'computer', 'AI'],
        'sports': ['sports', 'football', 'basketball', 'cricket', 'tennis', 'baseball', 'game', 'player', 'tournament'],
        'politics': ['politics', 'government', 'election', 'president', 'minister', 'party', 'vote', 'policy'],
        'entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'actor', 'actress', 'star', 'show'],
        'science': ['science', 'research', 'study', 'discover', 'experiment', 'scientist'],
        'health': ['health', 'medical', 'disease', 'doctor', 'hospital', 'patient', 'treatment', 'drug', 'medicine']
    }
    
    # Convert text to lowercase
    text = text.lower()
    
    # Count occurrences of category keywords
    category_scores = defaultdict(int)
    for category, keywords in categories.items():
        for keyword in keywords:
            category_scores[category] += text.count(keyword)
    
    # Get category with highest score
    if not category_scores:
        return 'general'
    
    top_category = max(category_scores.items(), key=lambda x: x[1])
    
    # If no significant category found, return 'general'
    if top_category[1] == 0:
        return 'general'
    
    return top_category[0]
