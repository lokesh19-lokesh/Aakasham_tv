import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_ARTICLES } from '../constants/articlesData';
import Article from './Article';

const CategoryPage = () => {
  const { categoryId, districtId } = useParams();
  
  // Format the title: use district if available, otherwise category, or default to Trending News
  const displayTitle = districtId ? districtId : (categoryId ? categoryId : "Trending News");
  
  // Filter articles based on category or district (simple string match for now)
  const filteredArticles = MOCK_ARTICLES.filter(article => {
    if (districtId) return article.content.includes(districtId) || article.category === categoryId;
    if (categoryId && categoryId !== "home") return article.category.toLowerCase() === categoryId.toLowerCase();
    return true; // Default for home or all
  });

  return (
    <div className="container">
      <header className="page-header">
        <h1>{displayTitle}</h1>
      </header>
      
      <div className="news-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <Article key={article.id} originalArticle={article} />
          ))
        ) : (
          <p className="no-news">No news articles found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
