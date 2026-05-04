import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { TELANGANA_DISTRICTS, ANDHRA_PRADESH_DISTRICTS, MORE_CATEGORIES } from '../constants/districtData';
import logo from '../assets/logo.png';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';
import { supabase } from '../supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [epaperUrl, setEpaperUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    fetchLatestEpaper();
    return () => clearInterval(timer);
  }, []);

  const fetchLatestEpaper = async () => {
    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { action: 'get-latest-epaper', data: {} }
    });
    if (!error && data) setEpaperUrl(data.content);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleDropdown = (name) => {
    if (activeDropdown === name) setActiveDropdown(null);
    else setActiveDropdown(name);
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const langMap = { 'te': 'te-IN', 'hi': 'hi-IN', 'en': 'en-US' };
    const currentLang = localStorage.getItem('app_language') || 'te';
    return dateTime.toLocaleDateString(langMap[currentLang] || 'te-IN', options);
  };

  const formatTime = () => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const langMap = { 'te': 'te-IN', 'hi': 'hi-IN', 'en': 'en-US' };
    const currentLang = localStorage.getItem('app_language') || 'te';
    return dateTime.toLocaleTimeString(langMap[currentLang] || 'te-IN', options);
  };

  const navItems = [
    { name: 'LATEST NEWS', path: '/latest-news', type: 'link' },
    { name: 'TELANGANA', type: 'dropdown', data: TELANGANA_DISTRICTS },
    { name: 'ANDHRA PRADESH', type: 'dropdown', data: ANDHRA_PRADESH_DISTRICTS },
    { name: 'NATIONAL', path: '/national', type: 'link' },
    { name: 'INTERNATIONAL', path: '/international', type: 'link' },
    { name: 'POLITICS', path: '/politics', type: 'link' },
    { name: 'CRIME', path: '/crime', type: 'link' },
    { name: 'MOVIE', path: '/movie', type: 'link' },
    { name: 'LIFESTYLE', path: '/lifestyle', type: 'link' },
    { name: 'BUSINESS', path: '/business', type: 'link' },
    { name: 'TECHNOLOGY', path: '/technology', type: 'link' },
    { name: 'SPORTS', path: '/sports', type: 'link' },
    { name: 'VIDEOS', path: '/videos', type: 'link' },
    { name: 'MORE', type: 'dropdown', data: MORE_CATEGORIES },
  ];

  return (
    <nav className="navbar-rtv">
      <div className="nav-top-bar">
        <div className="container top-bar-content">
          <div className="date-time-item">
            <Calendar size={14} />
            <span>{formatDate()}</span>
          </div>
          <div className="date-time-item">
            <Clock size={14} />
            <span>{formatTime()}</span>
          </div>
        </div>
      </div>
      <div className="nav-main-row">
        <div className="nav-left">
          <Link to="/" className="nav-logo-rtv">
            <img src={logo} alt="Aakasham TV" />
          </Link>
        </div>

        <div className={`nav-center ${isMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links-rtv">
            {navItems.map((item) => (
              <li key={item.name} className={item.type === 'dropdown' ? 'has-dropdown' : ''}>
                {item.type === 'link' ? (
                  <Link to={item.path} className="nav-item">
                    <TranslatedText>{item.name}</TranslatedText>
                  </Link>
                ) : (
                  <div className="dropdown-wrapper">
                    <button 
                      className="nav-item dropdown-toggle"
                      onClick={() => handleDropdown(item.name)}
                    >
                      <TranslatedText>{item.name}</TranslatedText> ▼
                    </button>
                    <ul className={`dropdown-menu ${activeDropdown === item.name ? 'show' : ''}`}>
                      {item.data.map(subItem => (
                        <li key={subItem}>
                          {subItem === 'E-Paper' || subItem === 'E-Papers' ? (
                            <a href={epaperUrl || '#'} target="_blank" rel="noopener noreferrer">
                               <TranslatedText>{subItem}</TranslatedText>
                            </a>
                          ) : (
                            <Link to={`/${item.name.toLowerCase().replace(' ', '-')}/${subItem.toLowerCase().replace(' ', '-')}`}>
                              <TranslatedText>{subItem}</TranslatedText>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-right">
          <div className="nav-tools">
            <LanguageSelector />
          </div>

          <button className="hamburger-rtv" onClick={toggleMenu} style={{ color: 'var(--nav-text)', background: 'transparent', border: 'none', fontSize: '24px' }}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
