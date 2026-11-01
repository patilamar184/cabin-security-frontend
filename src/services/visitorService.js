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

const ENROLLMENT_POLL_INTERVAL_MS = 1500;
const ENROLLMENT_TIMEOUT_MS = 110000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts enrollment on the ESP32 and waits until the backend confirms that
 * the R307 stored the template. A queued command is NOT an enrolled fingerprint.
 */
export async function enrollFingerprint(visitorId) {
  if (USE_MOCK) {
    return toFingerprint(await mock.enrollFingerprint(visitorId));
  }

  const started = await request(`/visitors/${visitorId}/fingerprints`, {
    method: 'POST',
  });

  if (!started?.enrollment_id) {
    throw new Error('The backend did not return a fingerprint enrollment ID.');
  }

  const deadline = Date.now() + ENROLLMENT_TIMEOUT_MS;
  let latest = started;

  while (Date.now() < deadline) {
    if (latest.status === 'completed') {
      return toFingerprint(latest);
    }

    if (latest.status === 'failed') {
      throw new Error(latest.message || 'Fingerprint enrollment failed on the device.');
    }

    await wait(ENROLLMENT_POLL_INTERVAL_MS);
    latest = await request(`/fingerprint-enrollments/${started.enrollment_id}`);
  }

  throw new Error(
    'Fingerprint enrollment is taking longer than expected. Check the ESP32 Serial Monitor and try again only after confirming the current enrollment status.'
  );
}
