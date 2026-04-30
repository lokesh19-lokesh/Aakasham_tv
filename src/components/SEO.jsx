import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, type = 'website', image, url }) => {
  const defaultTitle = 'Aakasham TV - Latest News in Telugu';
  const defaultDescription = 'Aakasham Media Pvt Ltd is a dynamic and fast-growing media organization committed to delivering credible, impactful, and audience-driven journalism.';
  const defaultImage = 'https://thepatternscompany.com/wp-content/uploads/2023/10/Aakasham_logo.png'; // Using a placeholder default image

  const seoTitle = title ? `${title} - Aakasham TV` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;
