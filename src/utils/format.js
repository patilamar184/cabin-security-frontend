// The backend may send timestamps without a timezone suffix; they are UTC.
export function parseDate(value) {
  if (!value) return null;
  const text = String(value);
  const hasZone = /([zZ]|[+-]\d\d:?\d\d)$/.test(text);
  return new Date(hasZone ? text : `${text}Z`);
}

export function formatDateTime(value) {
  const d = parseDate(value);
  if (!d || isNaN(d)) return '-';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function formatDate(value) {
  const d = parseDate(value);
  if (!d || isNaN(d)) return '-';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function secondsLeft(value) {
  const d = parseDate(value);
  if (!d || isNaN(d)) return 0;
  return Math.max(0, Math.round((d.getTime() - Date.now()) / 1000));
}

export function titleCase(text) {
  if (!text) return '-';
  return String(text).replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}
