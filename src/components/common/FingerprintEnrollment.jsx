import { Fingerprint, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { formatDateTime } from '../../utils/format';

/**
 * Shows how many fingerprints a person has and lets you add another.
 * latest = the fingerprint that was just added in this session (optional).
 */
export default function FingerprintEnrollment({ count, latest, onEnroll, enrolling, disabled }) {
  const enrolled = count > 0;
  return (
    <>
      <div className={`fp-banner ${enrolled ? '' : 'empty'}`}>
        <div className="info">
          <span className="fp-icon"><Fingerprint size={28} /></span>
          <div>
            <strong>{enrolled ? 'Fingerprint Enrolled' : 'No fingerprint yet'}</strong>
            <span className="muted">
              {enrolled
                ? `${count} fingerprint${count > 1 ? 's' : ''} registered for this visitor.`
                : 'Click Add Fingerprint and follow the instructions on the door device.'}
            </span>
          </div>
        </div>
        <Button variant="outline" icon={Plus} onClick={onEnroll} loading={enrolling} disabled={disabled}>
          {enrolling ? 'Waiting for device...' : 'Add Fingerprint'}
        </Button>
      </div>

      {latest && (
        <div className="fp-details">
          <div><span className="muted">Fingerprint ID</span><strong>{latest.id}</strong></div>
          <div><span className="muted">Enrolled On</span><strong>{formatDateTime(latest.enrolledAt)}</strong></div>
          <div><span className="muted">Status</span><strong>{latest.status === 'active' ? 'Active' : latest.status}</strong></div>
        </div>
      )}
    </>
  );
}
