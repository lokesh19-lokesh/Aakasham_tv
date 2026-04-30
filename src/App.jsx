import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import CategoryPage from './components/CategoryPage';
import TranslatedText from './components/TranslatedText';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AddNews from './components/AddNews';
import ArticleDetail from './components/ArticleDetail';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-news" element={<AddNews />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/:categoryId" element={<CategoryPage />} />
            <Route path="/:categoryId/:districtId" element={<CategoryPage />} />
          </Routes>
        </main>

        <footer className="footer-rtv">
          <div className="footer-content">
            <p>
              <TranslatedText>© 2026 Aakasham TV. All rights reserved.</TranslatedText>
              {' | '}Designed by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#18d73bff', textDecoration: 'none', fontWeight: 'bold' }}>The Patterns Company</a>
            </p>
            <div className="footer-links">
              <a href="#"><TranslatedText>About Us</TranslatedText></a>
              <a href="#"><TranslatedText>Contact Us</TranslatedText></a>
              <a href="#"><TranslatedText>Privacy Policy</TranslatedText></a>
              <a href="#"><TranslatedText>Terms of Service</TranslatedText></a>
            </div>
            <div className="footer-social" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
              <a href="https://www.youtube.com/channel/UCNAvk1-pAEntHLGOuaAKlDg" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff0000'} onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.instagram.com/aakasham_tv/" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#E1306C'} onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/aakashamtv/photos/" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#1877F2'} onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}

export default App;
