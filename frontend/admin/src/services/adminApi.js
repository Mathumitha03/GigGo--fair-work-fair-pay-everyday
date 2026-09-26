const API_BASE_URL = typeof window !== 'undefined' && window.location ? `http://${window.location.hostname}:8080` : 'http://localhost:8080';

let authToken = null;
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    authToken = localStorage.getItem('giggo_admin_token') || null;
  }
} catch (e) {
  authToken = null;
}

export const setAdminToken = (token) => {
  authToken = token;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem('giggo_admin_token', token);
      } else {
        localStorage.removeItem('giggo_admin_token');
      }
    }
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

export const getAdminToken = () => authToken;

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const err = json?.message || json?.error || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(err);
    }

    return json;
  } catch (err) {
    if (err.message && (err.message.includes('HTTP') || err.message.includes('Unauthorized') || err.message.includes('Forbidden'))) {
      throw err;
    }
    throw new Error(`Backend server unreachable at ${API_BASE_URL}. Ensure Spring Boot backend is running.`);
  }
}

export const AdminApiService = {
  getAdminToken,
  setAdminToken,
  async login(identifier, password) {
    const json = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    const token = json.data?.accessToken || json.data?.token;
    if (token) setAdminToken(token);
    return json.data;
  },

  async getCurrentUser() {
    const json = await request('/api/v1/auth/me', { method: 'GET' });
    return json.data;
  },

  async getCreationRequests(status = '') {
    const q = status ? `?status=${status}` : '';
    const json = await request(`/api/v1/admin/cooperatives/requests${q}`, { method: 'GET' });
    return json.data;
  },

  async reviewCreationRequest(requestId, status, reviewNotes = '') {
    const json = await request(`/api/v1/admin/cooperatives/requests/${requestId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes }),
    });
    return json.data;
  },

  async getCooperatives() {
    const json = await request('/api/v1/cooperatives', { method: 'GET' });
    return json.data;
  },

  logout() {
    setAdminToken(null);
  }
};
