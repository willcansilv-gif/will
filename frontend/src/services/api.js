const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getToken() {
  return localStorage.getItem('vitahub_token');
}

export function setToken(token) {
  localStorage.setItem('vitahub_token', token);
}

export function clearToken() {
  localStorage.removeItem('vitahub_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'request_failed');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/users/me'),
  listProviders: () => request('/providers'),
  createPatient: (payload) => request('/patients', { method: 'POST', body: JSON.stringify(payload) }),
  createProvider: (payload) => request('/providers', { method: 'POST', body: JSON.stringify(payload) }),
  createAppointment: (payload) => request('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  listAppointments: () => request('/appointments'),
  triageIntake: (payload) => request('/triage/intake', { method: 'POST', body: JSON.stringify(payload) }),
  createTelemed: (payload) => request('/telemed/sessions', { method: 'POST', body: JSON.stringify(payload) })
};
