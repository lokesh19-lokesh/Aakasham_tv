import React from 'react';
import TranslatedText from './TranslatedText';

export const AboutUs = () => (
  <div className="static-page container" style={{ padding: '2rem 15px', minHeight: '60vh' }}>
    <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '12px', marginBottom: '2rem' }}>
      <img src="/about_us_header.png" alt="About Aakasham TV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h1 style={{ marginBottom: '1.5rem', color: '#001d3d', fontSize: '2.5rem' }}><TranslatedText>About Us</TranslatedText></h1>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>Aakasham Media Pvt Ltd is a dynamic and fast-growing media organization committed to delivering credible, impactful, and audience-driven journalism across multiple platforms. Established in 2020, the company has steadily expanded its presence in both print and electronic media, building a diverse portfolio of regional and multilingual content.</TranslatedText>
    </p>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>In the print segment, Aakasham Media publishes Aakasham Telugu Daily, a newspaper focused on delivering timely, accurate, and community-relevant news to Telugu-speaking audiences.</TranslatedText>
    </p>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>On the electronic front, the organization operates a network of television channels under the Aakasham TV brand, including:</TranslatedText>
    </p>
    <ul style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem', paddingLeft: '2rem' }}>
      <li><TranslatedText>Aakasham TV Telugu</TranslatedText></li>
      <li><TranslatedText>Aakasham TV Marathi</TranslatedText></li>
      <li><TranslatedText>Aakasham TV Kannada</TranslatedText></li>
      <li><TranslatedText>Aakasham TV Health</TranslatedText></li>
    </ul>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>These channels are designed to cater to varied linguistic audiences while maintaining a strong commitment to journalistic integrity, public interest reporting, and high production standards.</TranslatedText>
    </p>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>The company is led by visionary leadership. Anu Sharma, Chairman, provides strategic direction and drives the organization’s long-term vision. Shahkir Shaik, Director, oversees operations and expansion initiatives, while Khizar Hayath contributes to organizational growth and governance.</TranslatedText>
    </p>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
      <TranslatedText>At its core, Aakasham Media Pvt Ltd is dedicated to empowering audiences with trustworthy news, fostering regional voices, and embracing innovation in modern media. With a clear focus on credibility, diversity, and technological advancement, the company continues to evolve as a reliable media platform in India’s rapidly changing information landscape.</TranslatedText>
    </p>
  </div>
);

export const ContactUs = () => (
  <div className="static-page container" style={{ padding: '2rem 15px', minHeight: '60vh' }}>
    <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '12px', marginBottom: '2rem' }}>
      <img src="/contact_us_header.png" alt="Contact Aakasham TV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h1 style={{ marginBottom: '1.5rem', color: '#001d3d', fontSize: '2.5rem' }}><TranslatedText>Contact Us</TranslatedText></h1>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
      <div style={{ flex: '1 1 300px' }}>
        <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
          <TranslatedText>We value your feedback and inquiries. Please reach out to us:</TranslatedText>
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <strong><TranslatedText>Email</TranslatedText>:</strong> info@aakasham.tv
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong><TranslatedText>Phone</TranslatedText>:</strong> +91 9876543210
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong><TranslatedText>Address</TranslatedText>:</strong> <TranslatedText>Aakasham TV Studios, Hyderabad, Telangana, India.</TranslatedText>
        </div>
      </div>

      <div style={{ flex: '2 1 400px', background: '#f8f9fa', padding: '2rem', borderRadius: '8px', border: '1px solid #dddfe2' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#001d3d' }}><TranslatedText>Send us a message</TranslatedText></h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
            <input type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
            <textarea required rows="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
          </div>
          <button type="submit" style={{ background: '#CC0000', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
            <TranslatedText>Submit</TranslatedText>
          </button>
        </form>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <div className="static-page container" style={{ padding: '4rem 15px', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '2rem', color: '#001d3d' }}><TranslatedText>Privacy Policy</TranslatedText></h1>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
      <TranslatedText>Your privacy is critically important to us. This privacy policy explains how we collect, use, and protect your personal information when you use our website. We do not sell your personal data to third parties.</TranslatedText>
    </p>
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><TranslatedText>Data Collection</TranslatedText></h3>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
      <TranslatedText>We only collect the information you choose to give us, and we process it with your consent, or on another legal basis; we only require the minimum amount of personal information that is necessary to fulfill the purpose of your interaction with us.</TranslatedText>
    </p>
  </div>
);

export const TermsOfService = () => (
  <div className="static-page container" style={{ padding: '4rem 15px', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '2rem', color: '#001d3d' }}><TranslatedText>Terms of Service</TranslatedText></h1>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
      <TranslatedText>By accessing and using Aakasham TV website, you accept and agree to be bound by the terms and provisions of this agreement. Any participation in this service will constitute acceptance of this agreement.</TranslatedText>
    </p>
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><TranslatedText>User Content</TranslatedText></h3>
    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
      <TranslatedText>You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful.</TranslatedText>
    </p>
  </div>
);
