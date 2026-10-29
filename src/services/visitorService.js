import { request, USE_MOCK } from './client';
import { toFingerprint, toVisitor } from './mappers';
import * as mock from './mock/mockApi';

/** @returns {Promise<{items: object[], total: number}>} */
export async function listVisitors(params) {
  const data = USE_MOCK ? await mock.listVisitors(params) : await request('/visitors', { params });
  return { items: data.items.map(toVisitor), total: data.total };
}

export async function getVisitor(id) {
  const data = USE_MOCK ? await mock.getVisitor(id) : await request(`/visitors/${id}`);
  return toVisitor(data);
}

export async function createVisitor(payload) {
  const data = USE_MOCK
    ? await mock.createVisitor(payload)
    : await request('/visitors', { method: 'POST', body: payload });
  return toVisitor(data);
}

export async function updateVisitor(id, payload) {
  const data = USE_MOCK
    ? await mock.updateVisitor(id, payload)
    : await request(`/visitors/${id}`, { method: 'PUT', body: payload });
  return toVisitor(data);
}

export async function deleteVisitor(id) {
  if (USE_MOCK) return mock.deleteVisitor(id);
  return request(`/visitors/${id}`, { method: 'DELETE' });
}

/** Starts fingerprint enrollment on the door device and waits for it to finish. */
export async function enrollFingerprint(visitorId) {
  const data = USE_MOCK
    ? await mock.enrollFingerprint(visitorId)
    : await request(`/visitors/${visitorId}/fingerprints`, { method: 'POST' });
  return toFingerprint(data);
}
