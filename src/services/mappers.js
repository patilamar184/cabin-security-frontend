// Converts backend field names (snake_case) into the names the UI uses (camelCase).
// If your backend uses different names, this is the only file you need to change.

export const toVisitor = (v) => ({
  id: v.id,
  name: v.name,
  phone: v.phone,
  department: v.department,
  role: v.role,
  fingerprintCount: v.fingerprint_count ?? (v.fingerprint_enrolled ? 1 : 0),
  registeredAt: v.registered_at ?? v.created_at,
});

export const toEntry = (e) => ({
  id: e.id,
  visitorName: e.visitor_name,
  department: e.department,
  role: e.role,
  entryAt: e.entry_at,
  method: e.method ?? 'Fingerprint',
  result: e.result, // 'allowed' | 'denied'
});

export const toAccessRequest = (r) => ({
  id: r.id,
  visitorName: r.visitor_name,
  method: r.method ?? 'Fingerprint',
  status: r.status, // 'pending' | 'allowed' | 'denied'
  requestedAt: r.requested_at,
});

export const toUser = (u) => ({
  id: u.id,
  name: u.full_name ?? u.name,
  username: u.username,
  email: u.email,
  phone: u.phone,
  role: u.role,
  department: u.department,
  createdAt: u.created_at,
});

export const toFingerprint = (f) => ({
  id: f.fingerprint_id ?? f.id,
  enrolledAt: f.enrolled_at,
  status: f.status ?? 'active',
});
