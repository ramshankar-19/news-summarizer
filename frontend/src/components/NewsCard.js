import React, { useState, useEffect } from 'react';
import '../styles/components/NewsCard.css';
import { FaVolumeUp, FaStop, FaHeart, FaRegHeart } from 'react-icons/fa';
import { summarizeArticle } from '../services/api';

// PRE-GENERATED AI SUMMARIES FOR DEMO
const ARTICLE_SUMMARIES = {
  wicked: "Cynthia Erivo and Ariana Grande returned to CinemaCon to debut the first trailer for the highly anticipated 'Wicked: For Good' sequel. The footage showcases the continuing story of the witches of Oz, featuring stunning visual effects and musical performances. The actors discussed their chemistry and the film's faithful adaptation of the source material. Industry analysts predict major box office success based on audience recognition and positive early reception.",
  technology: "Artificial intelligence has revolutionized multiple industries with applications ranging from medical diagnostics to financial trading algorithms. Computer vision systems can now identify objects and emotions with high precision, while self-driving vehicles integrate multiple AI technologies. These advances raise significant ethical concerns including privacy issues, job displacement risks, and algorithmic bias. Companies face increasing pressure to develop transparent AI systems that respect user privacy and adhere to evolving regulatory frameworks.",
  business: "Global markets demonstrate resilience despite economic and geopolitical challenges. The financial sector is undergoing digital transformation with traditional institutions competing against fintech startups. Mergers and acquisitions have accelerated as companies seek strategic advantages, while supply chain disruptions remain problematic across industries. Remote work has become a permanent feature for many organizations, and sustainability considerations increasingly influence business decisions and investment strategies.",
  sports: "The sports world has witnessed remarkable performances with underdog teams challenging traditional powerhouses. New talent is reshaping team dynamics across basketball, tennis, and cricket. Olympic athletes are breaking records during qualification events, while sports technology evolves with advanced analytics improving training methods. The business aspect of sports is transforming with streaming services competing for broadcast rights and new approaches to fan engagement being developed.",
  health: "Medical researchers report promising clinical trial results for chronic condition treatments. Genomic medicine advances enable more personalized healthcare approaches. Public health systems are strengthening disease monitoring capabilities while nutrition science provides new insights into diet-health relationships. Mental health awareness has increased substantially, and telemedicine has expanded healthcare access for underserved communities. Healthcare systems globally are addressing challenges related to aging populations.",
  entertainment: "The entertainment industry continues evolving with streaming platforms producing unprecedented volumes of original content. Filmmakers experiment with innovative storytelling techniques while musicians challenge genre conventions through social media promotion. Gaming experiences have become increasingly immersive through advanced graphics and narrative complexity. Celebrity culture transforms as stars directly engage with fans, and production companies implement more sustainable and inclusive practices behind the scenes.",
  science: "Scientific breakthroughs span multiple disciplines, from astronomy identifying potentially habitable exoplanets to particle physics research advancing our understanding of fundamental forces. Neuroscience research yields insights into brain function and potential treatments, while climate scientists refine environmental prediction models. Material scientists create compounds with novel industrial applications, and international collaboration accelerates the pace of discovery across scientific fields."
};

const NewsCard = ({ article }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { title, description, url, urlToImage, publishedAt, source } = article;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get the appropriate summary based on article content
  const getAppropriateArticleSummary = () => {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Check for specific articles first
    if (text.includes('wicked') || text.includes('ariana grande') || text.includes('cynthia erivo')) {
      return ARTICLE_SUMMARIES.wicked;
    }
    
    // Then check general categories
    if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('digital')) {
      return ARTICLE_SUMMARIES.technology;
    }
    if (text.includes('business') || text.includes('market') || text.includes('economy') || text.includes('finance')) {
      return ARTICLE_SUMMARIES.business;
    }
    if (text.includes('sport') || text.includes('football') || text.includes('basketball') || text.includes('tennis')) {
      return ARTICLE_SUMMARIES.sports;
    }
    if (text.includes('health') || text.includes('medical') || text.includes('disease') || text.includes('doctor')) {
      return ARTICLE_SUMMARIES.health;
    }
    if (text.includes('movie') || text.includes('film') || text.includes('cinema') || text.includes('music') || 
        text.includes('celebrity') || text.includes('entertainment')) {
      return ARTICLE_SUMMARIES.entertainment;
    }
    if (text.includes('science') || text.includes('research') || text.includes('study') || text.includes('discover')) {
      return ARTICLE_SUMMARIES.science;
    }
    
    // Default fallback based on URL patterns
    if (url.includes('entertainment') || url.includes('movie') || url.includes('hollywood') || 
        url.includes('cinema') || url.includes('film')) {
      return ARTICLE_SUMMARIES.entertainment;
    }
    
    // Ultimate fallback - create a generic summary from the title and description
    return `This article discusses ${title.toLowerCase()}. ${description || ''}`;
  };
  
  const handleSummarize = async () => {
    if (summary) {
      setExpanded(!expanded);
      return;
    }
    
    setLoading(true);
    try {
      // Get the text to summarize
      const textToSummarize = `${title}. ${description || ''}`;
      
      // Call the backend API for real summarization
      const response = await summarizeArticle(textToSummarize);
      
      if (response.status === 'success') {
        setSummary(response.data.summary);
      } else {
        console.error('Error in summary response:', response);
        setSummary('Unable to generate summary. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Unable to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioPlay = () => {
    if (isPlaying) {
      // Stop current speech
      if (speech) {
        window.speechSynthesis.cancel();
        setSpeech(null);
      }
      setIsPlaying(false);
      return;
    }

    // Start speech
    const text = summary ? `${title}. ${summary}` : `${title}. ${description || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsPlaying(false);
      setSpeech(null);
    };
    
    window.speechSynthesis.speak(utterance);
    setSpeech(utterance);
    setIsPlaying(true);
  };
  
  const toggleFavorite = () => {
    const userEmail = localStorage.getItem('userEmail');
    const favoritesKey = userEmail ? `favorites_${userEmail}` : 'favorites';
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.url !== url);
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    } else {
      // Add to favorites
      const articleToSave = {
        title,
        description,
        url,
        urlToImage,
        publishedAt,
        source
      };
      localStorage.setItem(favoritesKey, JSON.stringify([...favorites, articleToSave]));
    }
    
    setIsFavorite(!isFavorite);
    
    // Dispatch a custom event to notify about favorites change
    window.dispatchEvent(new Event('storage'));
  };
  
  // Check if this article is in favorites when component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const favoritesKey = userEmail ? `favorites_${userEmail}` : 'favorites';
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    const isInFavorites = favorites.some(fav => fav.url === url);
    setIsFavorite(isInFavorites);
  }, [url]);
  
  return (
    <div className="news-card">
      <div className="news-card-content">
        <h3 className="news-card-title">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>
        
        <p className="news-card-date">{formatDate(publishedAt)}</p>
        
        <p className="news-card-description">
          {description || 'No description available for this article.'}
        </p>
        
        {summary && (
          <div className="news-card-summary">
            <h4>AI Summary:</h4>
            <p>
              {expanded ? summary : `${summary.substring(0, 150)}${summary.length > 150 ? '...' : ''}`}
            </p>
          </div>
        )}
        
        <div className="news-card-actions">
          <button 
            className={`audio-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handleAudioPlay}
          >
            {isPlaying ? (
              <>
                <FaStop className="audio-icon" /> Stop Audio
              </>
            ) : (
              <>
                <FaVolumeUp className="audio-icon" /> Listen
              </>
            )}
          </button>
          
          <button 
            className={`summary-btn ${loading ? 'loading' : ''}`}
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? 'Summarizing...' : 
             summary ? (expanded ? 'Show Less' : 'Read Full Summary') : 'Generate AI Summary'}
          </button>
          
          <button 
            className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? (
              <>
                <FaHeart className="favorite-icon" /> Saved
              </>
            ) : (
              <>
                <FaRegHeart className="favorite-icon" /> Save
              </>
            )}
          </button>
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-full-btn"
          >
            Read Full Article
          </a>
        </div>
      </div>
      <div className="news-card-image">
        <img 
          src={urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={title}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }}
        />
        {/* <div className="source-badge">{source.name}</div> */}
      </div>
    </div>
  );
};

export default NewsCard;
