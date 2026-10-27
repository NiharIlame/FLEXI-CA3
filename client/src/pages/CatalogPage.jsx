import { useEffect, useState } from 'react';
import { getPerfumes, saveFavorite } from '../services/perfumeService';

export default function CatalogPage() {
  const [perfumes, setPerfumes] = useState([]);
  const [filters, setFilters] = useState({ family: '', brand: '', maxPrice: '', occasion: '' });
  const [loading, setLoading] = useState(true);

  const loadPerfumes = async (nextFilters = filters) => {
    try {
      setLoading(true);
      const data = await getPerfumes(nextFilters);
      setPerfumes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerfumes();
  }, []);

  const handleFilterChange = (e) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    loadPerfumes(next);
  };

  const handleSaveFavorite = async (perfumeId) => {
    try {
      await saveFavorite(perfumeId);
      alert('Perfume saved to favorites!');
    } catch (error) {
      alert(error.message || 'Could not save favorite');
    }
  };

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Catalog</div>
          <h2 style={{ margin: '8px 0 0' }}>Browse perfumes</h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Fragrance family</label>
            <select name="family" value={filters.family} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Floral">Floral</option>
              <option value="Woody">Woody</option>
              <option value="Citrus">Citrus</option>
              <option value="Oriental">Oriental</option>
              <option value="Fresh">Fresh</option>
              <option value="Musky">Musky</option>
            </select>
          </div>
          <div className="form-group">
            <label>Brand</label>
            <select name="brand" value={filters.brand} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Maison Aurora">Maison Aurora</option>
              <option value="Saffron Atelier">Saffron Atelier</option>
              <option value="Neroli House">Neroli House</option>
              <option value="Oak & Cedar">Oak & Cedar</option>
              <option value="Petal & Pearl">Petal & Pearl</option>
            </select>
          </div>
          <div className="form-group">
            <label>Max price</label>
            <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} placeholder="e.g. 5000" />
          </div>
          <div className="form-group">
            <label>Occasion</label>
            <select name="occasion" value={filters.occasion} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Daily wear">Daily wear</option>
              <option value="Office">Office</option>
              <option value="Evening">Evening</option>
              <option value="Date night">Date night</option>
              <option value="Special events">Special events</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">Loading perfumes...</div>
        ) : perfumes.length === 0 ? (
          <div className="empty-state">No perfumes match your current filters.</div>
        ) : (
          <div className="task-grid">
            {perfumes.map((perfume) => (
              <div key={perfume._id} className="perfume-card">
                <div
                  className="perfume-image"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(50,29,39,0.18), rgba(209,77,123,0.22)), url(${perfume.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'})`
                  }}
                />
                <div className="perfume-body">
                  <div className="task-top">
                    <div>
                      <h3 style={{ margin: '0 0 8px' }}>{perfume.name}</h3>
                      <div style={{ color: '#64748b' }}>{perfume.brand}</div>
                    </div>
                    <span className="tag priority-medium">{perfume.family}</span>
                  </div>
                  <p style={{ color: '#475569', margin: '16px 0' }}>{perfume.description}</p>
                  <p style={{ color: '#64748b', margin: '0 0 16px' }}>Notes: {perfume.notes.join(', ')}</p>
                  <div className="task-actions">
                    <span className="tag status-completed">₹{perfume.price}</span>
                    <button type="button" className="small-btn primary" onClick={() => handleSaveFavorite(perfume._id)}>Save favorite</button>
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
