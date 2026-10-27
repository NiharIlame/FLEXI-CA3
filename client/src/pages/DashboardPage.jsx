import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecommendations } from '../services/perfumeService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your scent dashboard</div>
          <h2 style={{ margin: '8px 0 0' }}>Welcome back, {user?.name || 'Fragrance Lover'}!</h2>
        </div>
      </div>

      {loading ? <div className="empty-state">Loading your fragrance picks...</div> : (
        <>
          <div className="quick-actions">
            <Link to="/quiz" className="action-button primary">Take the scent quiz</Link>
            <Link to="/catalog" className="action-button secondary">Browse all scents</Link>
            <Link to="/favorites" className="action-button ghost">View saved picks</Link>
          </div>

          <div className="dashboard-grid">
            <div className="card insight-card">
              <div className="label">Saved recommendations</div>
              <div className="value" style={{ fontSize: '2rem' }}>{recommendations.length}</div>
              <small>ready to compare</small>
            </div>
            <div className="card insight-card">
              <div className="label">Top match</div>
              <div className="value" style={{ fontSize: '1.5rem' }}>{recommendations[0]?.name || 'No match yet'}</div>
              <small>best fit this week</small>
            </div>
            <div className="card insight-card">
              <div className="label">Budget fit</div>
              <div className="value" style={{ fontSize: '1.5rem' }}>Personalized</div>
              <small>based on your range</small>
            </div>
          </div>

          <div style={{ marginTop: '22px' }} className="card">
            <div className="card-header">
              <h3>Recommended for you</h3>
              <span className="tag status-pending">Updated</span>
            </div>

            {recommendations.length === 0 ? (
              <div className="empty-state">Complete the quiz to generate your fragrance matches.</div>
            ) : (
              <div className="task-grid">
                {recommendations.map((perfume) => (
                  <div key={perfume._id} className="list-item recommendation-item">
                    <div>
                      <strong>{perfume.name}</strong>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{perfume.brand} • {perfume.family}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="tag priority-medium">{perfume.family}</span>
                      <span className="tag priority-high">{Math.round(perfume.score)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
