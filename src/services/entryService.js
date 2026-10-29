import { request, USE_MOCK } from './client';
import { toEntry } from './mappers';
import * as mock from './mock/mockApi';

export async function listEntries(params) {
  const data = USE_MOCK ? await mock.listEntries(params) : await request('/entries', { params });
  return { items: data.items.map(toEntry), total: data.total };
}
