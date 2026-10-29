const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toDate = (value) => (value instanceof Date ? value : new Date(value));

// 29 Oct 2026
export function formatDate(value) {
  if (!value) return '-';
  const d = toDate(value);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// 09:15:32
export function formatTime24(value) {
  if (!value) return '-';
  const d = toDate(value);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 10:30 AM
export function formatTime12(value) {
  if (!value) return '-';
  const d = toDate(value);
  const h = d.getHours();
  return `${pad(h % 12 || 12)}:${pad(d.getMinutes())} ${h >= 12 ? 'PM' : 'AM'}`;
}

// 28 Oct 2026, 10:30 AM
export function formatDateTime(value) {
  if (!value) return '-';
  return `${formatDate(value)}, ${formatTime12(value)}`;
}

// Oct 29, 2026
export function formatDateUS(value) {
  if (!value) return '-';
  const d = toDate(value);
  return `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}
