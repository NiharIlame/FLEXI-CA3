import { Link } from 'react-router-dom';

const features = [
  'Interactive scent preference quiz',
  'Rules-based fragrance matching',
  'Budget and occasion filters',
  'Favorite and compare perfumes',
];

export default function LandingPage() {
  return (
    <div>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="brand-mark">P</div>
            <span>Perfume Match</span>
          </div>

          <nav className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link active">Register</Link>
          </nav>
        </div>
      </header>

      <main className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span style={{ display: 'inline-block', background: 'rgba(92, 106, 196, 0.1)', color: '#3d4d9d', padding: '8px 12px', borderRadius: '999px', fontWeight: 700, marginBottom: '16px' }}>
              Find your signature scent
            </span>
            <h1>Perfume recommendations made around your mood, notes, and budget.</h1>
            <p>
              Perfume Match helps you discover fragrances that fit your favorite notes, price range, and occasion without the guesswork.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-btn">Get Started</Link>
              <Link to="/login" className="secondary-btn">Login</Link>
            </div>

            <div className="mini-trust-row">
              <div className="trust-badge"><span>4.9/5</span> rating</div>
              <div className="trust-badge"><span>12k+</span> matches</div>
              <div className="trust-badge"><span>3 min</span> quiz</div>
            </div>

            <div className="stat-card-grid">
              {features.map((feature) => (
                <div key={feature} className="stat-card">
                  <div className="label">Feature</div>
                  <div className="value" style={{ fontSize: '1.1rem', marginTop: '10px' }}>{feature}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-visual" aria-label="Vector illustration of fragrance bottles">
              <div className="vector-scene">
                <div className="orb orb-one" />
                <div className="orb orb-two" />
                <div className="glass-bottle bottle-large">
                  <span className="bottle-cap" />
                  <span className="bottle-label">AURORA</span>
                </div>
                <div className="glass-bottle bottle-small">
                  <span className="bottle-cap" />
                  <span className="bottle-label">NOIR</span>
                </div>
                <div className="petal petal-one" />
                <div className="petal petal-two" />
                <div className="petal petal-three" />
              </div>
              <span className="hero-badge">Curated picks</span>
              <span className="floating-pill">4.9 ★ fragrance fit</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
