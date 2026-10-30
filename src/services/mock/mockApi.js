// // Fake backend that lives in the browser, so you can run the app without FastAPI.
// // It returns data in the same shape the real API is expected to return.
// import { seedAccessRequests, seedEntries, seedUser, seedVisitors } from './mockData';

// const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
// const clone = (x) => JSON.parse(JSON.stringify(x));

// let visitors = clone(seedVisitors);
// let entries = clone(seedEntries);
// let requests = clone(seedAccessRequests);
// let nextVisitorId = Math.max(...visitors.map((v) => v.id)) + 1;
// let nextFingerprint = 2;

// const includes = (text, q) => String(text).toLowerCase().includes(q.toLowerCase());
// const paginate = (list, page = 1, pageSize = 10) => ({
//   items: list.slice((page - 1) * pageSize, page * pageSize),
//   total: list.length,
// });

// function find(id) {
//   const v = visitors.find((x) => x.id === Number(id));
//   if (!v) throw new Error(`No visitor found with ID ${id}.`);
//   return v;
// }

// export async function login(username, password) {
//   await delay();
//   if (username !== 'amitpatil' || password !== 'password123') {
//     throw new Error('Wrong username or password. Try amitpatil / password123.');
//   }
//   return { access_token: 'mock-token' };
// }

// export async function getCurrentUser() {
//   await delay(150);
//   return clone(seedUser);
// }

// export async function listVisitors({ search, department, role, page, pageSize }) {
//   await delay();
//   const list = visitors.filter(
//     (v) =>
//       (!search ||
//         [v.id, v.name, v.department, v.phone].some((f) => includes(f, search))) &&
//       (!department || v.department === department) &&
//       (!role || v.role === role)
//   );
//   return clone(paginate(list, page, pageSize));
// }

// export async function getVisitor(id) {
//   await delay();
//   return clone(find(id));
// }

// export async function createVisitor(payload) {
//   await delay();
//   const v = {
//     id: nextVisitorId++,
//     ...payload,
//     fingerprint_count: 0,
//     registered_at: new Date().toISOString(),
//   };
//   visitors.unshift(v);
//   return clone(v);
// }

// export async function updateVisitor(id, payload) {
//   await delay();
//   Object.assign(find(id), payload);
//   return clone(find(id));
// }

// export async function deleteVisitor(id) {
//   await delay();
//   find(id);
//   visitors = visitors.filter((v) => v.id !== Number(id));
//   return null;
// }

// export async function enrollFingerprint(visitorId) {
//   await delay(1500); // pretend the person is placing a finger on the device
//   const v = find(visitorId);
//   v.fingerprint_count = (v.fingerprint_count || 0) + 1;
//   return {
//     fingerprint_id: `FP-${String(nextFingerprint++).padStart(3, '0')}`,
//     enrolled_at: new Date().toISOString(),
//     status: 'active',
//   };
// }

// export async function listEntries({ search, department, role, result, page, pageSize }) {
//   await delay();
//   const list = entries.filter(
//     (e) =>
//       (!search || [e.id, e.visitor_name, e.department].some((f) => includes(f, search))) &&
//       (!department || e.department === department) &&
//       (!role || e.role === role) &&
//       (!result || e.result === result)
//   );
//   return clone(paginate(list, page, pageSize));
// }

// export async function listAccessRequests() {
//   await delay();
//   return { items: clone(requests), total: requests.length };
// }

// export async function decideAccessRequests({ ids, decision }) {
//   await delay();
//   requests = requests.map((r) =>
//     ids.includes(r.id) && r.status === 'pending' ? { ...r, status: decision } : r
//   );
//   return null;
// }



// Fake backend that lives in the browser, so you can run the app without FastAPI.
// It returns data in the same shape as the real API.
import { seedAccessRequests, seedEntries, seedUser, seedVisitors } from './mockData';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));

let visitors = clone(seedVisitors);
let entries = clone(seedEntries);
let requests = clone(seedAccessRequests);
let nextVisitorId = Math.max(...visitors.map((visitor) => visitor.id)) + 1;
let nextFingerprint = 2;

const includes = (text, query) => String(text).toLowerCase().includes(query.toLowerCase());
const paginate = (list, page = 1, pageSize = 10) => ({
  items: list.slice((page - 1) * pageSize, page * pageSize),
  total: list.length,
});

function find(id) {
  const visitor = visitors.find((item) => item.id === Number(id));
  if (!visitor) throw new Error(`No visitor found with ID ${id}.`);
  return visitor;
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
    (visitor) =>
      (!search || [visitor.id, visitor.name, visitor.department, visitor.phone]
        .some((field) => includes(field, search))) &&
      (!department || visitor.department === department) &&
      (!role || visitor.role === role)
  );
  return clone(paginate(list, page, pageSize));
}

export async function getVisitor(id) {
  await delay();
  return clone(find(id));
}

export async function createVisitor(payload) {
  await delay();
  const visitor = {
    id: nextVisitorId++,
    ...payload,
    fingerprint_count: 0,
    registered_at: new Date().toISOString(),
  };
  visitors.unshift(visitor);
  return clone(visitor);
}

export async function updateVisitor(id, payload) {
  await delay();
  Object.assign(find(id), payload);
  return clone(find(id));
}

export async function deleteVisitor(id) {
  await delay();
  find(id);
  visitors = visitors.filter((visitor) => visitor.id !== Number(id));
  return null;
}

export async function enrollFingerprint(visitorId) {
  await delay(1500);
  const visitor = find(visitorId);
  visitor.fingerprint_count = (visitor.fingerprint_count || 0) + 1;
  return {
    fingerprint_id: `FP-${String(nextFingerprint++).padStart(3, '0')}`,
    enrolled_at: new Date().toISOString(),
    status: 'active',
  };
}

export async function listEntries({ search, department, role, result, page, pageSize }) {
  await delay();
  const list = entries.filter(
    (entry) =>
      (!search || [entry.id, entry.visitor_name, entry.department]
        .some((field) => includes(field, search))) &&
      (!department || entry.department === department) &&
      (!role || entry.role === role) &&
      (!result || entry.result === result)
  );
  return clone(paginate(list, page, pageSize));
}

export async function listAccessRequests() {
  await delay();

  // The demo seed uses visitor IDs as IDs. Add visitor_id so the mapper mirrors FastAPI.
  const items = requests.map((item) => ({
    ...item,
    visitor_id: item.visitor_id ?? item.id,
  }));

  return { items: clone(items), total: items.length };
}

export async function decideAccessRequests({ ids, decision }) {
  await delay();

  const selectedIds = [...new Set(ids.map(Number))];
  const selectedRequests = selectedIds.map((id) => requests.find((item) => item.id === id));

  if (selectedRequests.some((item) => !item)) {
    throw new Error('One or more access requests were not found.');
  }
  if (selectedRequests.some((item) => item.status !== 'pending')) {
    throw new Error('Only pending requests can be allowed or denied.');
  }

  const updatedItems = [];
  requests = requests.map((item) => {
    if (!selectedIds.includes(item.id)) return item;

    const updated = {
      ...item,
      status: decision,
      resolved_at: new Date().toISOString(),
    };
    updatedItems.push(updated);
    return updated;
  });

  return {
    updated: updatedItems.length,
    items: clone(updatedItems),
    message: `${updatedItems.length} access request(s) marked ${decision}.`,
  };
}

export async function delayAccessRequest(requestId, durationMinutes) {
  await delay();

  if (![5, 10, 30].includes(Number(durationMinutes))) {
    throw new Error('Choose 5, 10 or 30 minutes.');
  }

  const request = requests.find((item) => item.id === Number(requestId));
  if (!request) throw new Error(`Access request ${requestId} was not found.`);
  if (request.status !== 'pending') {
    throw new Error('Only a pending request can be delayed.');
  }

  request.status = 'delayed';
  request.duration_minutes = Number(durationMinutes);
  request.resolved_at = new Date().toISOString();

  return {
    request: clone({ ...request, visitor_id: request.visitor_id ?? request.id }),
    command_id: 'mock-oled-command',
    message: `OLED message queued: Come back later after ${durationMinutes} minutes. Door remains locked.`,
  };
}
