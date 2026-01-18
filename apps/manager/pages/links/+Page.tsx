import { useState, useEffect } from 'react';
import './links.css';

interface Link {
  key: string;
  url: string;
  createdAt: string;
  createdBy: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    key: '',
    url: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      
      const data = await response.json();
      setLinks(data.links || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingKey 
        ? `/api/links/${editingKey}`
        : '/api/links';
      
      const method = editingKey ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingKey ? { url: formData.url } : formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save link');
      }

      setFormData({ key: '', url: '' });
      setShowForm(false);
      setEditingKey(null);
      await fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the link "${key}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${key}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete link');
      }

      await fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (link: Link) => {
    setEditingKey(link.key);
    setFormData({ key: link.key, url: link.url });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingKey(null);
    setFormData({ key: '', url: '' });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Link Manager</h1>
        {!showForm && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + New Link
          </button>
        )}
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h2>{editingKey ? 'Edit Link' : 'Create New Link'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="key">Short Key</label>
              <input
                type="text"
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="e.g., github, linkedin"
                disabled={!!editingKey}
                required
              />
              <small>This will be the path: anh.to/{formData.key || 'key'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="url">Target URL</label>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingKey ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="links-list">
        <h2>Existing Links ({links.length})</h2>
        {links.length === 0 ? (
          <p className="empty-state">No links yet. Create your first one!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Short Link</th>
                <th>Target URL</th>
                <th>Created</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.key}>
                  <td>
                    <a 
                      href={`https://anh.to/${link.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-link"
                    >
                      anh.to/{link.key}
                    </a>
                  </td>
                  <td className="url-cell">
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="target-url"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td>{new Date(link.createdAt).toLocaleDateString()}</td>
                  <td>{link.createdBy}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(link)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(link.key)}
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
    </div>
  );
}
