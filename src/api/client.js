// Central HTTP client for the FastAPI backend.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const TOKEN_KEY = 'smartcabin_token';
const ROLE_KEY = 'smartcabin_role';
const REFRESH_KEY = 'smartcabin_refresh';

export const session = {
  get token() { return localStorage.getItem(TOKEN_KEY); },
  get role() { return localStorage.getItem(ROLE_KEY); },
  get refreshToken() { return localStorage.getItem(REFRESH_KEY); },
  save(token, role, refreshToken = null) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    else localStorage.removeItem(REFRESH_KEY);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function readableError(data, status) {
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : '';
      return field ? `${field}: ${item.msg}` : item.msg;
    }).join('. ');
  }
  if (status === 0) return 'Cannot reach the backend. Check that Docker and the API container are running.';
  return data?.message || `Request failed (${status}).`;
}

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && session.token) headers.Authorization = `Bearer ${session.token}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(readableError(null, 0), 0);
  }

  let data = null;
  const raw = await response.text();
  if (raw) {
    try { data = JSON.parse(raw); } catch { data = { message: raw }; }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      session.clear();
      window.dispatchEvent(new Event('smartcabin:signed-out'));
    }
    throw new ApiError(readableError(data, response.status), response.status);
  }
  return data;
}
