import React, { useState, useEffect } from 'react';
import { AdminApiService } from './services/adminApi';
import { Shield, Building2, Users, CheckCircle2, XCircle, LogOut, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(AdminApiService.getAdminToken());
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'cooperatives'

  // Form State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@GigGo2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data State
  const [creationRequests, setCreationRequests] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    setError('');
    try {
      const u = await AdminApiService.getCurrentUser();
      setUser(u);

      const [reqs, coops] = await Promise.all([
        AdminApiService.getCreationRequests(),
        AdminApiService.getCooperatives(),
      ]);

      setCreationRequests(reqs || []);
      setCooperatives(coops || []);
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        handleLogout();
      } else {
        setError(err.message || 'Failed to load dashboard data.');
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await AdminApiService.login(username.trim(), password);
      setToken(AdminApiService.getAdminToken());
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AdminApiService.logout();
    setToken(null);
    setUser(null);
  };

  const handleReviewRequest = async (requestId, status) => {
    setActionLoadingId(requestId);
    try {
      await AdminApiService.reviewCreationRequest(requestId, status, `Reviewed by Super Admin on ${new Date().toLocaleDateString()}`);
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to review society creation request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="brand-icon" style={{ margin: '0 auto 12px auto', width: '56px', height: '56px', borderRadius: '16px' }}>
              <Shield size={32} />
            </div>
            <h2 className="brand-title">GigGo Federation Admin</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Cooperative Governance Portal
            </p>
          </div>

          {error && <div className="error-alert">⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>ADMIN USERNAME / EMAIL</label>
              <input
                type="text"
                className="form-input"
                placeholder="admin"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'SIGN IN TO GOVERNANCE PORTAL'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="brand-header">
            <div className="brand-icon">
              <Shield size={22} />
            </div>
            <div>
              <div className="brand-title">GigGo</div>
              <div className="brand-sub">FEDERATION GOVERNANCE</div>
            </div>
          </div>

          <nav>
            <div
              className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <Building2 size={18} />
              Creation Requests
            </div>
            <div
              className={`nav-item ${activeTab === 'cooperatives' ? 'active' : ''}`}
              onClick={() => setActiveTab('cooperatives')}
            >
              <Layers size={18} />
              Active Societies ({cooperatives.length})
            </div>
          </nav>
        </div>

        <div>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--accent-red)' }}>
            <LogOut size={18} />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div>
            <h1 className="page-title">
              {activeTab === 'requests' ? 'Society Creation Governance' : 'Registered Cooperative Catalog'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Review requests from workers and govern active labor cooperatives
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn btn-primary" onClick={loadDashboardData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={14} className={dataLoading ? 'spin' : ''} />
              Refresh Data
            </button>

            <div className="user-badge">
              <Shield size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{user?.name || 'Super Admin'}</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600' }}>{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Building2 size={24} />
            </div>
            <div>
              <div className="stat-value">{creationRequests.filter(r => r.status === 'PENDING').length}</div>
              <div className="stat-label">Pending Creation Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ color: 'var(--accent-green)', background: 'rgba(16, 185, 129, 0.1)' }}>
              <Layers size={24} />
            </div>
            <div>
              <div className="stat-value">{cooperatives.length}</div>
              <div className="stat-label">Active Labour Societies</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-value">Federation HQ</div>
              <div className="stat-label">Super Admin Authority</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'requests' ? (
          <div className="data-table-container">
            <div className="table-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Worker Cooperative Creation Requests</h3>
            </div>

            {dataLoading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>Loading creation requests...</p>
            ) : creationRequests.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Proposed Society</th>
                    <th>Requesting Worker</th>
                    <th>Region / Location</th>
                    <th>Proposed Registration No.</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creationRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: '700', color: '#fff' }}>{req.proposedName || req.cooperativeName}</td>
                      <td>{req.requestedByName || req.workerName || req.workerId}</td>
                      <td>{req.region || req.address || 'Chennai Central'}</td>
                      <td><code>{req.proposedRegistrationNumber || 'TN-COOP-PROP-01'}</code></td>
                      <td>
                        <span className={`badge badge-${(req.status || 'PENDING').toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-success"
                              onClick={() => handleReviewRequest(req.id, 'APPROVED')}
                              disabled={actionLoadingId === req.id}
                            >
                              <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                              Approve & Promote Worker
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleReviewRequest(req.id, 'REJECTED')}
                              disabled={actionLoadingId === req.id}
                            >
                              <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
                No pending society creation requests found.
              </p>
            )}
          </div>
        ) : (
          <div className="data-table-container">
            <div className="table-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Registered Labour Cooperative Societies</h3>
            </div>

            {cooperatives.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Society Name</th>
                    <th>Reg. Number</th>
                    <th>Region</th>
                    <th>Commission Rate</th>
                    <th>Welfare Fund Balance</th>
                    <th>Insurance Scheme</th>
                  </tr>
                </thead>
                <tbody>
                  {cooperatives.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '700', color: '#fff' }}>{c.name}</td>
                      <td><code>{c.registrationNumber}</code></td>
                      <td>{c.region}</td>
                      <td>{c.commissionRate}%</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: '700' }}>₹{c.welfareFundBalance?.toLocaleString()}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.insuranceSchemeDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
                No registered active cooperatives found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
