import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/perfumeService';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      loadFavorites();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Saved picks</div>
          <h2 style={{ margin: '8px 0 0' }}>My favorite perfumes</h2>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">No favorites saved yet.</div>
        ) : (
          <div className="task-grid">
            {favorites.map((favorite) => (
              <div key={favorite._id} className="perfume-card">
                <div
                  className="perfume-image"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(50,29,39,0.18), rgba(209,77,123,0.22)), url(${favorite.perfume.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'})`
                  }}
                />
                <div className="perfume-body">
                  <div className="task-top">
                    <div>
                      <h3 style={{ margin: '0 0 8px' }}>{favorite.perfume.name}</h3>
                      <div style={{ color: '#64748b' }}>{favorite.perfume.brand}</div>
                    </div>
                    <span className="tag priority-medium">{favorite.perfume.family}</span>
                  </div>
                  <p style={{ color: '#475569', margin: '16px 0' }}>{favorite.perfume.description}</p>
                  <div className="task-actions">
                    <span className="tag status-completed">₹{favorite.perfume.price}</span>
                    <button type="button" className="small-btn danger" onClick={() => handleRemove(favorite._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
