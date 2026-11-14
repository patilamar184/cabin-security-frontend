import { formatDate } from '../utils/format';

// The slip handed to a newly registered visitor. The PIN exists only here;
// the server keeps a scrambled copy and can never show it again.
export default function VisitorPass({ visitor }) {
  return (
    <div className="pass">
      <div className="pass-head">
        <div className="org">SmartCabin</div>
        <div className="kind">Visitor pass</div>
      </div>
      <dl>
        <dt>Name</dt><dd>{visitor.name}</dd>
        <dt>Role</dt><dd>{visitor.role}</dd>
        <dt>Department</dt><dd>{visitor.department}</dd>
        <dt>Registered</dt><dd>{formatDate(visitor.created_at)}</dd>
      </dl>
      <div className="pass-pin">
        <div className="label">Door PIN</div>
        <div className="digits">{visitor.pin}</div>
      </div>
    </div>
  );
}
