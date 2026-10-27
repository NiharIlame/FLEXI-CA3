import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/quiz', label: 'Find My Scent' },
  { to: '/catalog', label: 'Browse Scents' },
  { to: '/favorites', label: 'Saved Picks' },
  { to: '/profile', label: 'My Profile' },
];

export default function MainLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="brand-mark">P</div>
            <span>Perfume Match</span>
          </div>

          <nav className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <button type="button" className="primary-btn" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="brand" style={{ marginBottom: '24px' }}>
            <div className="brand-mark">Hi</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Welcome</div>
              <strong>{user?.name || 'Fragrance Lover'}</strong>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <button type="button" className="sidebar-item" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              Logout
            </button>
          </nav>
        </aside>

        <main className="content-area">{children}</main>
      </div>
    </>
  );
}
