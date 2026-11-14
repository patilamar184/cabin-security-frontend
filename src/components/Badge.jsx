import { titleCase } from '../utils/format';

function toneFor(text) {
  const t = String(text).toLowerCase();
  if (/(approv|grant|success|allow|enrolled|online|active|complete)/.test(t) && !/not/.test(t)) return 'good';
  if (/(den|fail|reject|invalid|expire|offline|blocked|not)/.test(t)) return 'bad';
  if (/(pending|wait)/.test(t)) return 'warn';
  return 'plain';
}

export default function Badge({ value, tone }) {
  return <span className={`badge badge-${tone || toneFor(value)}`}>{titleCase(value)}</span>;
}
