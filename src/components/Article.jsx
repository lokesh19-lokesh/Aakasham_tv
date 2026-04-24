import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import TranslatedText from './TranslatedText';

const Article = ({ originalArticle }) => {
  const { language, translateContent } = useLanguage();
  const [translatedArticle, setTranslatedArticle] = useState(originalArticle);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (language === 'en') {
        setTranslatedArticle(originalArticle);
        return;
      }

      setIsTranslating(true);
      try {
        const [title, content, category] = await Promise.all([
          translateContent(originalArticle.title),
          translateContent(originalArticle.content),
          translateContent(originalArticle.category),
        ]);

        setTranslatedArticle({
          ...originalArticle,
          title,
          content,
          category,
        });
      } catch (error) {
        console.error('Failed to translate article:', error);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [language, originalArticle, translateContent]);

  return (
    <article className={`news-article ${isTranslating ? 'translating' : ''}`}>
      <div className="article-content-wrapper">
        <div className="article-category">
          {isTranslating ? <div className="skeleton-text mini" /> : translatedArticle.category}
        </div>
        
        <h2 className="article-title">
          {isTranslating ? (
            <>
              <div className="skeleton-text" />
              <div className="skeleton-text short" />
            </>
          ) : (
            translatedArticle.title
          )}
        </h2>

        <div className="article-meta">
          <span><TranslatedText>By</TranslatedText> {translatedArticle.author}</span> • <span>{translatedArticle.date}</span>
        </div>

        <div className="article-content">
          {isTranslating ? (
            <>
              <div className="skeleton-text" />
              <div className="skeleton-text" />
              <div className="skeleton-text" />
              <div className="skeleton-text half" />
            </>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: translatedArticle.content }} />
          )}
        </div>

        <button className="read-more-btn">
          {language === 'te' ? 'మరింత చదవండి' : language === 'hi' ? 'और पढ़ें' : 'Read More'}
        </button>
      </div>
    </article>
  );
};

export default Article;
