import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import CategoryPage from './components/CategoryPage';
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
            <p>© 2026 Aakasham TV. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}

export default App;
