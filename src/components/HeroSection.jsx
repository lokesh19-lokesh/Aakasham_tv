import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import TranslatedText from './TranslatedText';

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('https://whatsapp.com/channel/...');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    // Fetch articles marked for hero slider
    const { data: sliderArticles } = await supabase
      .from('articles')
      .select('*')
      .eq('is_hero_slider', true)
      .limit(5);
    
    if (sliderArticles) setSlides(sliderArticles);

    // Fetch latest video
    const { data: videoArticle } = await supabase
      .from('articles')
      .select('video_url')
      .not('video_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (videoArticle) setVideoUrl(videoArticle.video_url);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0 && !videoUrl) return null;

  return (
    <div className="hero-container">
      <div className="hero-grid">
        {/* Slider Section */}
        <div className="hero-slider">
          {slides.length > 0 ? (
            <div className="slider-wrapper">
              <img src={slides[currentSlide].image_url} alt={slides[currentSlide].title} className="slide-img" />
              <div className="slide-content">
                <h3><TranslatedText>{slides[currentSlide].title}</TranslatedText></h3>
              </div>
              <button className="slider-nav prev" onClick={prevSlide}><ChevronLeft /></button>
              <button className="slider-nav next" onClick={nextSlide}><ChevronRight /></button>
            </div>
          ) : (
            <div className="slider-placeholder">No featured news</div>
          )}
        </div>

        {/* Right Sidebar Section */}
        <div className="hero-sidebar">
          <div className="video-section">
            {videoUrl ? (
              <iframe 
                src={videoUrl.replace('watch?v=', 'embed/')} 
                title="News Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-placeholder">Latest News Video</div>
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
        }
        .video-section iframe { width: 100%; height: 100%; }
        
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
