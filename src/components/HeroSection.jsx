import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import TranslatedText from './TranslatedText';

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [whatsappLink, setWhatsappLink] = useState('https://whatsapp.com/channel/...');
  const navigate = useNavigate();

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    // Fetch articles marked for hero slider
    const { data: sliderArticles } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sliderArticles) setSlides(sliderArticles);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const nextSlide = () => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (id) => {
    navigate(`/article/${id}`);
  };

  if (slides.length === 0) return null;

  return (
    <div className="hero-container">
      <div className="hero-grid">
        {/* Slider Section */}
        <div className="hero-slider">
          {slides.length > 0 ? (
            <div className="slider-wrapper">
              <div 
                className="slide-clickable-area" 
                onClick={() => handleSlideClick(slides[currentSlide].id)}
              >
                <img src={slides[currentSlide].image_url} alt={slides[currentSlide].title} className="slide-img" />
                <div className="slide-content">
                  <h3><TranslatedText>{slides[currentSlide].title}</TranslatedText></h3>
                </div>
              </div>
              <button className="slider-nav prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}><ChevronLeft /></button>
              <button className="slider-nav next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}><ChevronRight /></button>
            </div>
          ) : (
            <div className="slider-placeholder">No featured news</div>
          )}
        </div>

        {/* Right Sidebar Section */}
        <div className="hero-sidebar">
          <div className="video-section">
            {slides.length > 0 && slides[currentSlide].video_url ? (
              <div className="video-slider-wrapper">
                <iframe 
                  src={getEmbedUrl(slides[currentSlide].video_url)} 
                  title="News Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button className="slider-nav prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}><ChevronLeft size={16} /></button>
                <button className="slider-nav next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}><ChevronRight size={16} /></button>
              </div>
            ) : (
              <div className="video-placeholder">No Video for this News</div>
            )}
          </div>
          
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-card">
            <div className="whatsapp-content">
              <MessageCircle size={32} />
              <span>Join our WhatsApp Channel</span>
            </div>
            <div className="whatsapp-logo">R</div>
          </a>

          <div className="sidebar-promo">
             <img src="https://via.placeholder.com/300x150?text=E-Paper+Click+Here" alt="E-Paper" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-container {
          max-width: 1300px;
          margin: 0 auto 2rem;
          padding: 0 15px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          height: 450px;
        }
        .hero-slider {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }
        .slide-clickable-area {
          cursor: pointer;
          height: 100%;
          width: 100%;
        }
        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
        }
        .slide-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.9));
          color: white;
        }
        .slide-content h3 { font-size: 1.5rem; margin: 0; }
        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 1rem 0.5rem;
          cursor: pointer;
        }
        .slider-nav.prev { left: 0; border-radius: 0 4px 4px 0; }
        .slider-nav.next { right: 0; border-radius: 4px 0 0 4px; }

        .hero-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .video-section {
          flex: 1;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .video-slider-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .video-slider-wrapper iframe { width: 100%; height: 100%; }
        
        .video-slider-wrapper .slider-nav {
          padding: 0.5rem 0.2rem;
        }
        
        .whatsapp-card {
          background: #001d3d;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 0.3s;
        }
        .whatsapp-card:hover { transform: scale(1.02); }
        .whatsapp-content { display: flex; align-items: center; gap: 0.8rem; font-weight: bold; }
        .whatsapp-logo { font-size: 2rem; font-weight: 900; color: #CC0000; }
        
        .sidebar-promo img {
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
        }

        @media (max-width: 992px) {
          .hero-grid { grid-template-columns: 1fr; height: auto; }
          .hero-slider { height: 300px; }
          .video-section { height: 200px; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
