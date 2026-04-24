import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import CategoryPage from './components/CategoryPage';
import TranslatedText from './components/TranslatedText';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/:categoryId" element={<CategoryPage />} />
            <Route path="/:categoryId/:districtId" element={<CategoryPage />} />
          </Routes>
        </main>
        
        <footer className="footer-rtv">
          <div className="footer-content">
            <p><TranslatedText>© 2026 Aakasham TV. All rights reserved.</TranslatedText></p>
            <div className="footer-links">
              <a href="#"><TranslatedText>About Us</TranslatedText></a>
              <a href="#"><TranslatedText>Contact Us</TranslatedText></a>
              <a href="#"><TranslatedText>Privacy Policy</TranslatedText></a>
              <a href="#"><TranslatedText>Terms of Service</TranslatedText></a>
            </div>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}

export default App;
