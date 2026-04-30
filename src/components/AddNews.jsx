import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    video_url: '',
    category_id: '',
    district_id: '',
    is_hero_slider: false,
    is_top_hero: false,
    whatsapp_link: ''
  });
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const articleId = searchParams.get('id');

  useEffect(() => {
    fetchCategories();
    if (articleId) {
      fetchArticleForEdit(articleId);
    }
  }, [articleId]);

  const fetchArticleForEdit = async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || '',
        video_url: data.video_url || '',
        category_id: data.category_id || '',
        district_id: data.district_id || '',
        is_hero_slider: data.is_hero_slider || false,
        is_top_hero: data.is_top_hero || false,
        whatsapp_link: data.whatsapp_link || ''
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (formData.category_id) {
      fetchDistricts(formData.category_id);
    } else {
      setDistricts([]);
    }
  }, [formData.category_id]);

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchDistricts = async (categoryId) => {
    const { data } = await supabase.from('districts').select('*').eq('category_id', categoryId);
    setDistricts(data || []);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news-articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const action = articleId ? 'update-article' : 'create-article';
    const payload = articleId ? { ...formData, id: articleId } : formData;

    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action, 
        data: payload 
      }
    });

    if (error) {
      alert(`Error ${articleId ? 'updating' : 'creating'} article: ` + error.message);
    } else {
      alert(`Article ${articleId ? 'updated' : 'created'} successfully!`);
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="add-news-container">
      <div className="form-header">
        <h2>{articleId ? 'Edit Article' : 'Post New Article'}</h2>
        <p>{articleId ? 'Update the details of your article below.' : 'Fill in the details below to publish news across any of the 42+ pages.'}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-section">
          <h3>Main Content</h3>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Enter news title..."
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>News Content</label>
            <textarea 
              placeholder="Write the full story here... (HTML tags like <b>, <p> are supported)"
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
              rows="12"
              required 
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Placement & Category</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Target Page (Category)</label>
              <select 
                value={formData.category_id} 
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <small>Choose which main page this news belongs to.</small>
            </div>

            <div className="form-group">
              <label>Specific District (Optional)</label>
              <select 
                value={formData.district_id} 
                onChange={(e) => setFormData({...formData, district_id: e.target.value})}
                disabled={!districts.length}
              >
                <option value="">Select District</option>
                {districts.map(dist => <option key={dist.id} value={dist.id}>{dist.name}</option>)}
              </select>
              <small>Only needed for Telangana/AP news.</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Media & Links</h3>
          <div className="form-group">
            <label>Featured Image</label>
            <div 
              className={`drop-zone ${dragActive ? 'active' : ''} ${formData.image_url ? 'has-image' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {uploading ? (
                <div className="upload-loader">Uploading...</div>
              ) : formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="preview-img" />
              ) : (
                <div className="drop-zone-prompt">
                  <p>Drag & Drop an image here or click to upload</p>
                  <span>Supported: JPG, PNG, WEBP</span>
                </div>
              )}
              <input 
                id="fileInput"
                type="file" 
                className="hidden-input" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
            <input 
              type="text" 
              placeholder="Or paste an image URL here..."
              value={formData.image_url} 
              onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
              className="mt-2"
            />
          </div>

          <div className="form-group">
            <label>Video URL (Optional)</label>
            <input 
              type="text" 
              placeholder="YouTube or Vimeo link"
              value={formData.video_url} 
              onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label>WhatsApp Channel Link</label>
            <input 
              type="text" 
              value={formData.whatsapp_link} 
              onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-section hero-promotion">
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="latest"
              checked={formData.is_hero_slider} 
              onChange={(e) => setFormData({...formData, is_hero_slider: e.target.checked})} 
            />
            <div>
              <label htmlFor="latest">Feature in Latest News</label>
              <p>Check this to show this news in the Latest News grid on the homepage.</p>
            </div>
          </div>
          
          <div className="checkbox-group" style={{ marginTop: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="top_hero"
              checked={formData.is_top_hero} 
              onChange={(e) => setFormData({...formData, is_top_hero: e.target.checked})} 
            />
            <div>
              <label htmlFor="top_hero">Feature in Home Page Hero Section</label>
              <p>Check this to feature this news in the main top slider of the homepage.</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="cancel-btn">Discard</button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (articleId ? 'Updating...' : 'Publishing...') : (articleId ? 'Update News' : 'Publish News')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .add-news-container {
          max-width: 900px;
          margin: 3rem auto;
          padding: 2.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }
        .form-header { margin-bottom: 2.5rem; text-align: center; }
        .form-header h2 { color: #001d3d; font-size: 2rem; margin-bottom: 0.5rem; }
        .form-header p { color: #666; }
        
        .form-section { 
          margin-bottom: 2.5rem; 
          padding: 1.5rem; 
          background: #fcfcfc; 
          border-radius: 10px;
          border: 1px solid #f0f0f0;
        }
        .form-section h3 { 
          margin-bottom: 1.5rem; 
          font-size: 1.1rem; 
          color: #001d3d; 
          border-left: 4px solid #CC0000;
          padding-left: 0.8rem;
        }

        .form-group { margin-bottom: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        label { display: block; margin-bottom: 0.6rem; font-weight: 700; color: #333; }
        input[type="text"], select, textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #001d3d;
          outline: none;
        }
        small { display: block; margin-top: 0.4rem; color: #888; font-size: 0.85rem; }

        .hero-promotion { background: #fff5f5; border: 1px solid #ffebeb; }
        .checkbox-group { display: flex; align-items: flex-start; gap: 1rem; }
        .checkbox-group input { width: 20px; height: 20px; margin-top: 0.2rem; cursor: pointer; }
        .checkbox-group label { margin-bottom: 0.2rem; color: #CC0000; cursor: pointer; }
        .checkbox-group p { font-size: 0.9rem; color: #666; margin: 0; }

        .mt-2 { margin-top: 0.5rem; }
        .hidden-input { display: none; }
        
        .drop-zone {
          width: 100%;
          height: 200px;
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }
        .drop-zone:hover { border-color: #001d3d; background: #f8f9fa; }
        .drop-zone.active { border-color: #CC0000; background: #fff5f5; }
        .drop-zone.has-image { border-style: solid; border-color: #eee; }
        
        .drop-zone-prompt { text-align: center; color: #888; }
        .drop-zone-prompt p { margin-bottom: 0.5rem; font-weight: 600; }
        .drop-zone-prompt span { font-size: 0.8rem; }
        
        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .upload-loader { font-weight: bold; color: #001d3d; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1.5rem; margin-top: 3rem; }
        .submit-btn { 
          background: #001d3d; 
          color: white; 
          border: none; 
          padding: 1rem 3rem; 
          border-radius: 8px; 
          cursor: pointer; 
          font-weight: 700;
          font-size: 1.1rem;
          transition: transform 0.2s, background 0.3s;
        }
        .submit-btn:hover { background: #003566; transform: translateY(-2px); }
        .cancel-btn { 
          background: #f0f0f0; 
          border: none; 
          padding: 1rem 2rem; 
          border-radius: 8px; 
          cursor: pointer;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; gap: 1rem; }
          .add-news-container { padding: 1.5rem; margin: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default AddNews;
