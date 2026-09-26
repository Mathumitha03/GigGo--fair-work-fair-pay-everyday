import { Platform } from 'react-native';
import { ApiResponse, AuthResponse, CooperativeItem, MembershipItem, UserProfile } from '../types';

// Default to localhost for web/desktop, 10.0.2.2 for Android emulator, or fallback
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    return `http://${host}:8080`;
  }
  return 'http://10.239.37.231:8080';
};

let API_BASE_URL = getBaseUrl();
let authToken: string | null = null;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const getApiBaseUrl = () => API_BASE_URL;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    if (err.message && (err.message.includes('HTTP') || err.message.includes('Invalid credentials') || err.message.includes('User not found'))) {
      throw err;
    }
    throw new Error(`Cannot connect to backend at ${url}. ${err.message || 'Please check network connection.'}`);
  }
}

export const ApiService = {
  // Authentication Endpoints
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    const tokenVal = res.data?.accessToken || (res.data as any)?.token;
    if (tokenVal) {
      setAuthToken(tokenVal);
    }
    return res.data;
  },

  async registerCustomer(payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    city?: string;
    pincode?: string;
  }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/v1/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const tokenVal = res.data?.accessToken || (res.data as any)?.token;
    if (tokenVal) {
      setAuthToken(tokenVal);
    }
    return res.data;
  },

  async registerWorker(payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    skills?: string;
    experienceYears?: number;
    hourlyRate?: number;
  }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/v1/auth/register/worker', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const tokenVal = res.data?.accessToken || (res.data as any)?.token;
    if (tokenVal) {
      setAuthToken(tokenVal);
    }
    return res.data;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const res = await request<UserProfile>('/api/v1/auth/me', {
      method: 'GET',
    });
    return res.data;
  },

  // Cooperative Catalog
  async getCooperatives(): Promise<CooperativeItem[]> {
    const res = await request<CooperativeItem[]>('/api/v1/cooperatives', {
      method: 'GET',
    });
    return res.data;
  },

  async getCooperativeById(id: string): Promise<CooperativeItem> {
    const res = await request<CooperativeItem>(`/api/v1/cooperatives/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  // Worker Affiliation
  async getWorkerMemberships(): Promise<MembershipItem[]> {
    const res = await request<MembershipItem[]>('/api/v1/worker/cooperatives/memberships', {
      method: 'GET',
    });
    return res.data;
  },

  async requestJoinCooperative(cooperativeId: string, requestNotes?: string): Promise<MembershipItem> {
    const res = await request<MembershipItem>('/api/v1/worker/cooperatives/request-join', {
      method: 'POST',
      body: JSON.stringify({ cooperativeId, requestNotes }),
    });
    return res.data;
  },

  // Cooperative Manager / Moderator
  async getPendingManagerMemberships(): Promise<MembershipItem[]> {
    const res = await request<MembershipItem[]>('/api/v1/cooperative-manager/memberships/pending', {
      method: 'GET',
    });
    return res.data;
  },

  async reviewMembershipRequest(membershipId: string, status: 'ACTIVE' | 'REJECTED', rejectionReason?: string): Promise<MembershipItem> {
    const res = await request<MembershipItem>(`/api/v1/cooperative-manager/memberships/${membershipId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    });
    return res.data;
  },
};
