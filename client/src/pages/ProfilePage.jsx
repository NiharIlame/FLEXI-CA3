import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Profile</div>
          <h2 style={{ margin: '8px 0 0' }}>Account details</h2>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input value={user?.name || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={user?.email || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Account status</label>
            <input value="Active" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
