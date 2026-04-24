import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/admin');
      } else {
        fetchArticles();
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
                  <td>{article.title}</td>
                  <td>{article.categories?.name}</td>
                  <td>{new Date(article.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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
      `}</style>
    </div>
  );
};

export default AdminDashboard;
