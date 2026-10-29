const ROLE_TONE = { Employee: 'blue', Contractor: 'orange', Visitor: 'purple' };
const STATUS_TONE = { allowed: 'green', denied: 'red', pending: 'amber' };

export function Badge({ tone = 'blue', dot, children }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export const RoleBadge = ({ role }) => <Badge tone={ROLE_TONE[role] || 'blue'}>{role}</Badge>;

/** For access results and request status: allowed | denied | pending */
export const StatusBadge = ({ status }) => (
  <Badge tone={STATUS_TONE[status] || 'blue'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
);

export const FingerprintBadge = ({ enrolled }) => (
  <Badge tone={enrolled ? 'green' : 'red'} dot>{enrolled ? 'Enrolled' : 'Not Enrolled'}</Badge>
);
