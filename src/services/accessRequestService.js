// import { request, USE_MOCK } from './client';
// import { toAccessRequest } from './mappers';
// import * as mock from './mock/mockApi';

// export async function listAccessRequests() {
//   const data = USE_MOCK ? await mock.listAccessRequests() : await request('/access-requests');
//   return data.items.map(toAccessRequest);
// }

// /**
//  * decision: 'allowed' | 'denied'
//  * durationMinutes: only needed when allowing.
//  */
// export async function decideAccessRequests({ ids, decision, durationMinutes }) {
//   const body = { ids, decision, duration_minutes: durationMinutes };
//   if (USE_MOCK) return mock.decideAccessRequests(body);
//   return request('/access-requests/decision', { method: 'POST', body });
// }



import { request, USE_MOCK } from './client';
import { toAccessRequest } from './mappers';
import * as mock from './mock/mockApi';

/** Load access requests for the signed-in cabin owner. */
export async function listAccessRequests() {
  const data = USE_MOCK
    ? await mock.listAccessRequests()
    : await request('/access-requests');

  return (data.items || []).map(toAccessRequest);
}

/**
 * Allow or deny the checked access requests.
 * The ids are access-request IDs, not visitor IDs.
 */
export async function decideAccessRequests({ ids, decision }) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Select at least one access request.');
  }

  if (!['allowed', 'denied'].includes(decision)) {
    throw new Error('Decision must be allowed or denied.');
  }

  const requestIds = [...new Set(ids.map(Number))];
  if (requestIds.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error('One or more access request IDs are invalid.');
  }

  const body = { ids: requestIds, decision };

  if (USE_MOCK) {
    return mock.decideAccessRequests(body);
  }

  // Backend queues UNLOCK_DOOR for allowed, KEEP_LOCKED for denied.
  return request('/access-requests/decision', {
    method: 'POST',
    body,
  });
}

/**
 * Delay is independent of Allow/Deny. It sends an OLED message and keeps
 * the door locked. requestId is the access-request ID.
 */
export async function delayAccessRequest(requestId, durationMinutes) {
  const id = Number(requestId);
  const duration = Number(durationMinutes);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid access request ID.');
  }

  if (![5, 10, 30].includes(duration)) {
    throw new Error('Choose 5, 10 or 30 minutes.');
  }

  if (USE_MOCK) {
    return mock.delayAccessRequest(id, duration);
  }

  // Backend queues DISPLAY_MESSAGE with unlock=false and keep_locked=true.
  return request(`/access-requests/${id}/delay`, {
    method: 'POST',
    body: { duration_minutes: duration },
  });
}
