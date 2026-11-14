import { request } from './client';

export const authApi = {
  ownerLogin: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  adminLogin: (email, password) =>
    request('/api/admin/login', { method: 'POST', body: { email, password }, auth: false }),
  ownerRegister: (data) =>
    request('/api/auth/register', { method: 'POST', body: data, auth: false }),
  me: () => request('/api/auth/me'),
  logout: (refresh_token) =>
    request('/api/auth/logout', { method: 'POST', body: { refresh_token } }),
};

export const roleApi = {
  list: () => request('/api/visitor-roles'),
};

export const deviceApi = {
  list: () => request('/api/devices'),
  mine: async () => {
    const devices = await request('/api/devices');
    return devices[0] || null;
  },
  register: (name) =>
    request('/api/devices', { method: 'POST', body: { name } }),
  setActive: (id, active) =>
    request(`/api/devices/${id}/status?active=${active}`, { method: 'PATCH' }),
};

async function roleIdFor(role) {
  if (role && typeof role === 'object' && role.role_id) return role.role_id;
  if (role && typeof role === 'object' && role.id) return role.id;
  const roles = await roleApi.list();
  const match = roles.find((item) => item.name.toLowerCase() === String(role).toLowerCase());
  if (!match) throw new Error(`The visitor role "${role}" is not available. Refresh the page and try again.`);
  return match.id;
}

async function fingerprintMap() {
  return request('/api/fingerprints');
}

function enrichVisitor(visitor, roles, fingerprints) {
  const role = roles.find((item) => item.id === visitor.role_id);
  const fingerprint = fingerprints.find((item) => item.visitor_id === visitor.id);
  return {
    ...visitor,
    role: role?.name || 'Unknown role',
    fingerprint_enrolled: fingerprint?.status === 'active',
    fingerprint_status: fingerprint?.status || 'not_enrolled',
  };
}

export const visitorApi = {
  list: async () => {
    const [visitors, roles, fingerprints] = await Promise.all([
      request('/api/visitors?active=true&limit=200'),
      roleApi.list(),
      fingerprintMap(),
    ]);
    return visitors.map((visitor) => enrichVisitor(visitor, roles, fingerprints));
  },

  get: async (id) => {
    const [visitor, roles, fingerprints] = await Promise.all([
      request(`/api/visitors/${id}`),
      roleApi.list(),
      fingerprintMap(),
    ]);
    return enrichVisitor(visitor, roles, fingerprints);
  },

  create: async (data) => {
    const role_id = await roleIdFor(data.role_id || data.role);
    const result = await request('/api/visitors', {
      method: 'POST',
      body: {
        name: data.name,
        phone: data.phone,
        department: data.department,
        role_id,
      },
    });
    const roles = await roleApi.list();
    const visitor = enrichVisitor(result.visitor, roles, []);
    return { ...visitor, pin: result.pin, warning: result.warning };
  },

  update: async (id, data) => {
    const payload = { ...data };
    if (payload.role || payload.role_id) {
      payload.role_id = await roleIdFor(payload.role_id || payload.role);
    }
    delete payload.role;
    return request(`/api/visitors/${id}`, { method: 'PATCH', body: payload });
  },

  // The backend supports soft-deactivation through PATCH; it has no DELETE visitor route.
  remove: (id) => request(`/api/visitors/${id}`, {
    method: 'PATCH',
    body: { is_active: false },
  }),

  resetPin: (id) => request(`/api/visitors/${id}/reset-pin`, { method: 'POST' }),

  enrollFingerprint: async (visitorId, templateId) => {
    const device = await deviceApi.mine();
    if (!device) throw new Error('Register a door unit before enrolling fingerprints.');
    if (!templateId || Number(templateId) < 1 || Number(templateId) > 200) {
      throw new Error('Enter a sensor template ID between 1 and 200.');
    }
    return request('/api/fingerprints/enroll', {
      method: 'POST',
      body: {
        device_id: device.id,
        visitor_id: visitorId,
        template_id: Number(templateId),
      },
    });
  },

  fingerprintStatus: async (id) => {
    const items = await fingerprintMap();
    const item = items.find((fingerprint) => fingerprint.visitor_id === id);
    return { fingerprint_enrolled: item?.status === 'active', status: item?.status || 'not_enrolled' };
  },

  deleteFingerprint: (id) => request(`/api/fingerprints/${id}`, { method: 'DELETE' }),
};

export const requestApi = {
  pending: () => request('/api/access-requests?status=pending'),
  allow: (id, duration_minutes = 5) =>
    request(`/api/access-requests/${id}/approve`, {
      method: 'POST',
      body: { duration_minutes },
    }),
  deny: (id) => request(`/api/access-requests/${id}/deny`, { method: 'POST' }),
};

export const logApi = {
  list: async () => {
    const rows = await request('/api/entry-logs?limit=200');
    return rows.map((row) => ({
      ...row,
      event_type: row.authentication_method || 'access_attempt',
      result: row.authentication_result,
      description: `Access decision: ${row.access_decision || 'pending'}`,
    }));
  },
};

export const dashboardApi = {
  stats: () => request('/api/dashboard/stats'),
};

export const adminApi = {
  dashboard: () => request('/api/admin/stats'),
  owners: () => request('/api/admin/owners'),
  setOwnerStatus: (id, active) =>
    request(`/api/admin/owners/${id}/status?active=${active}`, { method: 'PATCH' }),
};
