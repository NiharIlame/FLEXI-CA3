import { useState } from 'react';
import { submitQuiz } from '../services/perfumeService';

const scentOptions = ['Rose', 'Jasmine', 'Vanilla', 'Amber', 'Citrus', 'Sandalwood', 'Musk', 'Wood', 'Bergamot', 'Peony'];
const occasionOptions = ['Daily wear', 'Office', 'Evening', 'Date night', 'Special events', 'Summer'];
const budgets = ['Under ₹2,000', '₹2,000 - ₹4,000', '₹4,000 - ₹8,000', 'Above ₹8,000'];
const families = ['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh', 'Musky'];

export default function PerfumeQuizPage() {
  const [form, setForm] = useState({
    favoriteScents: ['Rose', 'Vanilla'],
    scentProfile: 'romantic',
    budget: '₹2,000 - ₹4,000',
    occasion: 'Date night',
    fragranceFamily: 'Floral',
    brandPreference: 'Maison Aurora'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleScent = (scent) => {
    setForm((prev) => {
      const exists = prev.favoriteScents.includes(scent);
      return {
        ...prev,
        favoriteScents: exists
          ? prev.favoriteScents.filter((item) => item !== scent)
          : [...prev.favoriteScents, scent]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await submitQuiz(form);
      setRecommendations(result.recommendations || []);
    } catch (err) {
      setError(err.message || 'Unable to generate recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Perfume matching</div>
          <h2 style={{ margin: '8px 0 0' }}>Find your signature scent</h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <h3>Favorite fragrance notes</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
              {scentOptions.map((scent) => (
                <button
                  key={scent}
                  type="button"
                  className={form.favoriteScents.includes(scent) ? 'primary-btn' : 'ghost-btn'}
                  onClick={() => toggleScent(scent)}
                  style={{ padding: '8px 12px', minWidth: '110px' }}
                >
                  {scent}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label>Budget</label>
              <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                {budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Occasion</label>
              <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                {occasionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Preferred fragrance family</label>
              <select value={form.fragranceFamily} onChange={(e) => setForm({ ...form, fragranceFamily: e.target.value })}>
                {families.map((family) => <option key={family} value={family}>{family}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Brand preference</label>
              <input value={form.brandPreference} onChange={(e) => setForm({ ...form, brandPreference: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Desired scent mood</label>
            <input value={form.scentProfile} onChange={(e) => setForm({ ...form, scentProfile: e.target.value })} />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Finding scents...' : 'Get my recommendations'}</button>
        </form>
      </div>

      {recommendations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Your recommended perfumes</h3>
          </div>
          <div className="task-grid">
            {recommendations.map((perfume) => (
              <div key={perfume._id} className="perfume-card">
                <div
                  className="perfume-image"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(50,29,39,0.18), rgba(209,77,123,0.2)), url(${perfume.image || 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80'})`
                  }}
                />
                <div className="perfume-body">
                  <div className="task-top">
                    <div>
                      <h3 style={{ margin: '0 0 8px' }}>{perfume.name}</h3>
                      <div style={{ color: '#64748b' }}>{perfume.brand}</div>
                    </div>
                    <span className="tag priority-high">{Math.round(perfume.score)}%</span>
                  </div>

                  <div style={{ margin: '14px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="tag priority-medium">{perfume.family}</span>
                    <span className="tag status-completed">₹{perfume.price}</span>
                  </div>

                  <p style={{ color: '#475569' }}>{perfume.description}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}><strong>Notes:</strong> {perfume.notes.join(', ')}</p>
                  <ul style={{ paddingLeft: '18px', color: '#475569' }}>
                    {perfume.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
