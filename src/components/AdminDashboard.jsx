import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Upload, FileText, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [epaperLoading, setEpaperLoading] = useState(false);
  const [epaperFile, setEpaperFile] = useState(null);
  const [epaperImage, setEpaperImage] = useState(null);
  const [latestEpaper, setLatestEpaper] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/admin');
      } else {
        fetchArticles();
        fetchLatestEpaper();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (!error) setArticles(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        fetchArticles();
      } else {
        alert('Error deleting article: ' + error.message);
      }
    }
  };

  const handleToggleStar = async (article, type = 'latest') => {
    const field = type === 'latest' ? 'is_hero_slider' : 'is_top_hero';
    const newStatus = !article[field];
    
    // Optimistic UI update
    setArticles(articles.map(a => a.id === article.id ? { ...a, [field]: newStatus } : a));

    const payload = {
      id: article.id,
      title: article.title,
      content: article.content,
      image_url: article.image_url,
      video_url: article.video_url,
      category_id: article.category_id,
      district_id: article.district_id,
      is_hero_slider: type === 'latest' ? newStatus : article.is_hero_slider,
      is_top_hero: type === 'hero' ? newStatus : article.is_top_hero,
      whatsapp_link: article.whatsapp_link
    };

    const { error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action: 'update-article', 
        data: payload 
      }
    });

    if (error) {
      alert('Error updating article: ' + error.message);
      fetchArticles(); // Revert on error
    }
  };

  const fetchLatestEpaper = async () => {
    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { action: 'get-latest-epaper', data: {} }
    });
    if (!error && data) setLatestEpaper(data);
  };

  const handleEpaperUpload = async (e) => {
    e.preventDefault();
    if (!epaperFile) return alert('Please select a PDF file first.');
    setEpaperLoading(true);

    try {
      // 1. Upload PDF
      const pdfExt = epaperFile.name.split('.').pop();
      const pdfName = `epaper-${Date.now()}.${pdfExt}`;
      const pdfPath = `epapers/${pdfName}`;
      
      const { error: pdfError } = await supabase.storage.from('news-images').upload(pdfPath, epaperFile);
      if (pdfError) throw pdfError;
      
      const { data: { publicUrl: pdfUrl } } = supabase.storage.from('news-images').getPublicUrl(pdfPath);

      // 2. Upload Image (optional)
      let imageUrl = latestEpaper?.image_url;
      if (epaperImage) {
        const imgExt = epaperImage.name.split('.').pop();
        const imgName = `epaper-thumb-${Date.now()}.${imgExt}`;
        const imgPath = `epapers/${imgName}`;
        const { error: imgError } = await supabase.storage.from('news-images').upload(imgPath, epaperImage);
        if (imgError) throw imgError;
        const { data: { publicUrl: iUrl } } = supabase.storage.from('news-images').getPublicUrl(imgPath);
        imageUrl = iUrl;
      }

      // 3. Update via Edge Function
      const { error: invokeError } = await supabase.functions.invoke('manage-articles', {
        body: { 
          action: 'upload-epaper', 
          data: { pdf_url: pdfUrl, image_url: imageUrl } 
        }
      });

      if (invokeError) throw invokeError;

      alert('E-Paper uploaded successfully!');
      fetchLatestEpaper();
      setEpaperFile(null);
      setEpaperImage(null);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setEpaperLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <Link to="/admin/add-news" className="add-btn">+ Add News</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="epaper-mgmt-section">
        <div className="section-card">
          <h3>Daily E-Paper Management</h3>
          <p className="section-desc">Upload the latest daily E-Paper PDF. This will replace the current downloadable e-paper on the homepage.</p>
          
          <div className="epaper-current-status">
            {latestEpaper ? (
              <div className="status-badge active">
                <CheckCircle size={16} />
                <span>Current E-Paper: {new Date(latestEpaper.created_at).toLocaleDateString()}</span>
                <a href={latestEpaper.content} target="_blank" rel="noreferrer" className="view-link">View Current PDF</a>
              </div>
            ) : (
              <div className="status-badge empty">No E-Paper uploaded yet</div>
            )}
          </div>

          <form onSubmit={handleEpaperUpload} className="epaper-upload-form">
            <div className="upload-grid">
              <div className="upload-field">
                <label><FileText size={16} /> Select PDF Document</label>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => setEpaperFile(e.target.files[0])}
                  className="file-input"
                />
                {epaperFile && <span className="file-name">{epaperFile.name}</span>}
              </div>
              <div className="upload-field">
                <label><Upload size={16} /> Thumbnail Preview (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setEpaperImage(e.target.files[0])}
                  className="file-input"
                />
                {epaperImage && <span className="file-name">{epaperImage.name}</span>}
              </div>
            </div>
            <button type="submit" disabled={epaperLoading} className="epaper-submit-btn">
              {epaperLoading ? 'Uploading...' : 'Publish Daily E-Paper'}
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <table className="articles-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    {article.image_url ? (
                      <img src={article.image_url} alt="" className="table-thumb" />
                    ) : (
                      <div className="no-img-thumb" />
                    )}
                  </td>
                  <td className="title-cell">
                    <div style={{ display: 'flex', gap: '0.8rem', marginRight: '0.5rem' }}>
                      <button 
                        className="star-btn"
                        onClick={() => handleToggleStar(article, 'latest')}
                        title={article.is_hero_slider ? "Remove from Latest News" : "Add to Latest News"}
                      >
                        <Star 
                          size={18} 
                          fill={article.is_hero_slider ? "#f59e0b" : "none"} 
                          color={article.is_hero_slider ? "#f59e0b" : "#ccc"} 
                        />
                      </button>
                      <button 
                        className="star-btn"
                        onClick={() => handleToggleStar(article, 'hero')}
                        title={article.is_top_hero ? "Remove from Hero Section" : "Add to Hero Section"}
                      >
                        <Star 
                          size={18} 
                          fill={article.is_top_hero ? "#CC0000" : "none"} 
                          color={article.is_top_hero ? "#CC0000" : "#ccc"} 
                        />
                      </button>
                    </div>
                    <span>{article.title}</span>
                  </td>
                  <td>{article.categories?.name}</td>
                  <td>{new Date(article.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="edit-btn" 
                      onClick={() => navigate(`/admin/add-news?id=${article.id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(article.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #001d3d;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .add-btn {
          background: #28a745;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
        .logout-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .articles-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th {
          background: #f8f9fa;
          font-weight: 700;
          color: #001d3d;
        }
        .title-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: transform 0.2s;
        }
        .star-btn:hover {
          transform: scale(1.1);
        }
        .table-thumb {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }
        .no-img-thumb {
          width: 60px;
          height: 40px;
          background: #eee;
          border-radius: 4px;
        }
        .edit-btn {
          color: #007bff;
          background: none;
          border: none;
          cursor: pointer;
          margin-right: 1rem;
        }
        .delete-btn {
          color: #dc3545;
          background: none;
          border: none;
          cursor: pointer;
        }

        .epaper-mgmt-section {
          margin-bottom: 3rem;
        }
        .section-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-left: 6px solid #001d3d;
        }
        .section-card h3 { color: #001d3d; margin-bottom: 0.5rem; font-size: 1.4rem; }
        .section-desc { color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; }
        
        .epaper-current-status { margin-bottom: 1.5rem; }
        .status-badge { display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1.2rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; }
        .status-badge.active { background: #e6fffa; color: #2c7a7b; border: 1px solid #b2f5ea; }
        .status-badge.empty { background: #fff5f5; color: #c53030; border: 1px solid #fed7d7; }
        .view-link { margin-left: auto; color: #007bff; text-decoration: underline; }

        .epaper-upload-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .upload-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .upload-field label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #444; font-size: 0.9rem; }
        .file-input { padding: 0.5rem; border: 1px dashed #ccc; border-radius: 6px; background: #fafafa; cursor: pointer; }
        .file-name { font-size: 0.8rem; color: #007bff; font-weight: 600; }
        
        .epaper-submit-btn {
          background: #001d3d;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          transition: background 0.3s;
          align-self: flex-start;
        }
        .epaper-submit-btn:hover { background: #003566; }
        .epaper-submit-btn:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
