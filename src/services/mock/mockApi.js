// Fake backend that lives in the browser, so you can run the app without FastAPI.
// It returns data in the same shape the real API is expected to return.
import { seedAccessRequests, seedEntries, seedUser, seedVisitors } from './mockData';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

let visitors = clone(seedVisitors);
let entries = clone(seedEntries);
let requests = clone(seedAccessRequests);
let nextVisitorId = Math.max(...visitors.map((v) => v.id)) + 1;
let nextFingerprint = 2;

const includes = (text, q) => String(text).toLowerCase().includes(q.toLowerCase());
const paginate = (list, page = 1, pageSize = 10) => ({
  items: list.slice((page - 1) * pageSize, page * pageSize),
  total: list.length,
});

function find(id) {
  const v = visitors.find((x) => x.id === Number(id));
  if (!v) throw new Error(`No visitor found with ID ${id}.`);
  return v;
}

export async function login(username, password) {
  await delay();
  if (username !== 'amitpatil' || password !== 'password123') {
    throw new Error('Wrong username or password. Try amitpatil / password123.');
  }
  return { access_token: 'mock-token' };
}

export async function getCurrentUser() {
  await delay(150);
  return clone(seedUser);
}

export async function listVisitors({ search, department, role, page, pageSize }) {
  await delay();
  const list = visitors.filter(
    (v) =>
      (!search ||
        [v.id, v.name, v.department, v.phone].some((f) => includes(f, search))) &&
      (!department || v.department === department) &&
      (!role || v.role === role)
  );
  return clone(paginate(list, page, pageSize));
}

export async function getVisitor(id) {
  await delay();
  return clone(find(id));
}

export async function createVisitor(payload) {
  await delay();
  const v = {
    id: nextVisitorId++,
    ...payload,
    fingerprint_count: 0,
    registered_at: new Date().toISOString(),
  };
  visitors.unshift(v);
  return clone(v);
}

export async function updateVisitor(id, payload) {
  await delay();
  Object.assign(find(id), payload);
  return clone(find(id));
}

export async function deleteVisitor(id) {
  await delay();
  find(id);
  visitors = visitors.filter((v) => v.id !== Number(id));
  return null;
}

export async function enrollFingerprint(visitorId) {
  await delay(1500); // pretend the person is placing a finger on the device
  const v = find(visitorId);
  v.fingerprint_count = (v.fingerprint_count || 0) + 1;
  return {
    fingerprint_id: `FP-${String(nextFingerprint++).padStart(3, '0')}`,
    enrolled_at: new Date().toISOString(),
    status: 'active',
  };
}

export async function listEntries({ search, department, role, result, page, pageSize }) {
  await delay();
  const list = entries.filter(
    (e) =>
      (!search || [e.id, e.visitor_name, e.department].some((f) => includes(f, search))) &&
      (!department || e.department === department) &&
      (!role || e.role === role) &&
      (!result || e.result === result)
  );
  return clone(paginate(list, page, pageSize));
}

export async function listAccessRequests() {
  await delay();
  return { items: clone(requests), total: requests.length };
}

export async function decideAccessRequests({ ids, decision }) {
  await delay();
  requests = requests.map((r) =>
    ids.includes(r.id) && r.status === 'pending' ? { ...r, status: decision } : r
  );
  return null;
}
