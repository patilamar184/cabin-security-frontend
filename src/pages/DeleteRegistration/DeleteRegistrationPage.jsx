import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Building2, Fingerprint, Trash2, User, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import * as visitorService from '../../services/visitorService';
import { formatDateTime } from '../../utils/format';
import Avatar from '../../components/common/Avatar';
import DetailItem from '../../components/common/DetailItem';
import VisitorLookup from '../../components/common/VisitorLookup';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

export default function DeleteRegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const { data: visitor, loading, error } = useAsync(
    () => (id ? visitorService.getVisitor(id) : Promise.resolve(null)),
    [id]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await visitorService.deleteVisitor(id);
      toast.show(`${visitor.name}'s registration was deleted.`);
      navigate(ROUTES.VISITORS, { replace: true });
    } catch (err) {
      toast.show(err.message, 'error');
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Delete Registration"
        subtitle="Review the visitor details below and confirm deletion. This will permanently remove the visitor registration and fingerprint enrollment."
      >
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME}>Home</Link> &rsaquo; <Link to={ROUTES.VISITORS}>Registered Visitors</Link> &rsaquo;
          <span className="current">Delete Registration</span>
        </nav>
      </PageHeader>

      <div className="stack">
        {!id && <VisitorLookup onProceed={(v) => navigate(`${ROUTES.DELETE_REGISTRATION}/${v}`)} />}
        {id && loading && <Loading text="Loading visitor..." />}
        {id && error && <div className="card"><ErrorMessage message={error} /></div>}

        {visitor && (
          <>
            <div className="card">
              <div className="card-header">Visitor Details</div>
              <div className="card-pad stack">
                <div className="cell-flex" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div className="cell-flex" style={{ gap: 18 }}>
                    <Avatar name={visitor.name} size="lg" />
                    <div>
                      <h2>ID #{visitor.id}</h2>
                      <strong style={{ fontWeight: 500, fontSize: 18 }}>{visitor.name}</strong>
                      <p className="muted" style={{ fontSize: 14 }}>Registered on {formatDateTime(visitor.registeredAt)}</p>
                    </div>
                  </div>
                  <Badge tone={visitor.fingerprintCount > 0 ? 'green' : 'red'}>
                    <Fingerprint size={16} /> {visitor.fingerprintCount > 0 ? 'Fingerprint Enrolled' : 'No Fingerprint'}
                  </Badge>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid var(--border)', width: '100%' }} />
                <div className="detail-grid">
                  <DetailItem icon={User} label="Name" value={visitor.name} />
                  <DetailItem icon={Building2} label="Department" value={visitor.department} />
                  <DetailItem icon={Briefcase} label="Role" value={visitor.role} />
                </div>
              </div>
            </div>

            <div className="alert alert-danger">
              <span className="alert-icon"><AlertCircle size={24} /></span>
              <div>
                <p className="alert-title">Delete this registration?</p>
                <p className="alert-text">
                  This will permanently remove the visitor registration and delete the enrolled fingerprint from the system. <strong>This action cannot be undone.</strong>
                </p>
              </div>
            </div>

            <div className="page-header-actions" style={{ justifyContent: 'flex-end' }}>
              <Button variant="neutral" onClick={() => navigate(ROUTES.VISITORS)} disabled={deleting}>Cancel</Button>
              <Button variant="danger" icon={Trash2} onClick={handleDelete} loading={deleting}>Delete Registration</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
