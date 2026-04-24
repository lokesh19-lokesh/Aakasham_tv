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
    whatsapp_link: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      fetchDistricts(formData.category_id);
    } else {
      setDistricts([]);
    }
  }, [formData.category_id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchDistricts = async (categoryId) => {
    const { data } = await supabase.from('districts').select('*').eq('category_id', categoryId);
    setDistricts(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Using Edge Function for backend logic as requested
    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action: 'create-article', 
        data: formData 
      }
    });

    if (error) {
      alert('Error creating article: ' + error.message);
    } else {
      alert('Article created successfully!');
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="add-news-container">
      <h2>Add New News</h2>
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Content (HTML supported)</label>
          <textarea 
            value={formData.content} 
            onChange={(e) => setFormData({...formData, content: e.target.value})} 
            rows="10"
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select 
              value={formData.category_id} 
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>District (Optional)</label>
            <select 
              value={formData.district_id} 
              onChange={(e) => setFormData({...formData, district_id: e.target.value})}
            >
              <option value="">Select District</option>
              {districts.map(dist => <option key={dist.id} value={dist.id}>{dist.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input 
            type="text" 
            value={formData.image_url} 
            onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
          />
        </div>

        <div className="form-group">
          <label>Video URL (YouTube/Vimeo)</label>
          <input 
            type="text" 
            value={formData.video_url} 
            onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
          />
        </div>

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="hero"
            checked={formData.is_hero_slider} 
            onChange={(e) => setFormData({...formData, is_hero_slider: e.target.checked})} 
          />
          <label htmlFor="hero">Show in Hero Slider</label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="cancel-btn">Cancel</button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create News'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .add-news-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        h2 { color: #001d3d; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        input[type="text"], select, textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
        .checkbox-group label { margin-bottom: 0; }
        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .submit-btn { background: #001d3d; color: white; border: none; padding: 0.8rem 2rem; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .cancel-btn { background: #eee; border: none; padding: 0.8rem 2rem; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AddNews;
