import { request, USE_MOCK } from './client';
import { toAccessRequest } from './mappers';
import * as mock from './mock/mockApi';

export async function listAccessRequests() {
  const data = USE_MOCK ? await mock.listAccessRequests() : await request('/access-requests');
  return data.items.map(toAccessRequest);
}

/**
 * decision: 'allowed' | 'denied'
 * durationMinutes: only needed when allowing.
 */
export async function decideAccessRequests({ ids, decision, durationMinutes }) {
  const body = { ids, decision, duration_minutes: durationMinutes };
  if (USE_MOCK) return mock.decideAccessRequests(body);
  return request('/access-requests/decision', { method: 'POST', body });
}
