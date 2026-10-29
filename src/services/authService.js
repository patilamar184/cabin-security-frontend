import { request, tokenStore, USE_MOCK } from './client';
import { toUser } from './mappers';
import * as mock from './mock/mockApi';

export async function login(username, password) {
  const data = USE_MOCK
    ? await mock.login(username, password)
    : await request('/auth/login', { method: 'POST', body: { username, password } });
  tokenStore.set(data.access_token);
  return getCurrentUser();
}

export async function getCurrentUser() {
  const data = USE_MOCK ? await mock.getCurrentUser() : await request('/auth/me');
  return toUser(data);
}

export function logout() {
  tokenStore.clear();
}
