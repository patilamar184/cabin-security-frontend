import { initials } from '../../utils/format';

export default function Avatar({ name, size = '', solid }) {
  return <span className={`avatar ${size ? `avatar-${size}` : ''} ${solid ? 'avatar-solid' : ''}`}>{initials(name)}</span>;
}
