import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import Article from './Article';
import HeroSection from './HeroSection';
import TranslatedText from './TranslatedText';

const CategoryPage = () => {
  const { categoryId, districtId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const displayTitle = districtId ? districtId : (categoryId ? categoryId.replace(/-/g, ' ') : "Trending News");

  useEffect(() => {
    fetchArticles();
  }, [categoryId, districtId]);

  const fetchArticles = async () => {
    setLoading(true);
    let query = supabase.from('articles').select('*, categories!inner(slug), districts(name)');

    if (categoryId && categoryId !== 'home') {
      query = query.eq('categories.slug', categoryId);
    } else {
      query = query.eq('is_hero_slider', true);
    }
    
    if (districtId) {
      // Handle district filtering (simple string match on the name from the param)
      query = query.ilike('districts.name', districtId.replace(/-/g, ' '));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error) setArticles(data);
    setLoading(false);
  };

  return (
    <div className="category-container">
      {/* Show Hero Section only on Home or Category pages, not on deep district pages optionally */}
      {(!categoryId || categoryId === 'home') && <HeroSection />}
      
      <div className="container">
        <header className="page-header">
          <h1><TranslatedText>{displayTitle}</TranslatedText></h1>
        </header>
        
        <div className="news-grid">
          {loading ? (
            <p>Loading news...</p>
          ) : articles.length > 0 ? (
            articles.map(article => (
              <Article key={article.id} originalArticle={article} />
            ))
          ) : (
            <p className="no-news">
              <TranslatedText>No news articles found for this category.</TranslatedText>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
