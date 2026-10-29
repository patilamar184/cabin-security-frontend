import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, ChevronLeft, Phone, Save, User, Users } from 'lucide-react';
import { DEPARTMENTS, ROLES, ROUTES } from '../../config/constants';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import * as visitorService from '../../services/visitorService';
import { validateVisitor } from '../../utils/validators';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { SelectField, TextField } from '../../components/ui/FormFields';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';
import FingerprintEnrollment from '../../components/common/FingerprintEnrollment';
import VisitorLookup from '../../components/common/VisitorLookup';

export default function EditRegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: visitor, loading, error } = useAsync(
    () => (id ? visitorService.getVisitor(id) : Promise.resolve(null)),
    [id]
  );

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [fingerprintCount, setFingerprintCount] = useState(0);
  const [latestFingerprint, setLatestFingerprint] = useState(null);
  const [saving, setSaving] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fill the form once the visitor loads.
  useEffect(() => {
    if (visitor) {
      setForm({ name: visitor.name, phone: visitor.phone, department: visitor.department, role: visitor.role });
      setFingerprintCount(visitor.fingerprintCount);
      setLatestFingerprint(null);
      setErrors({});
    } else {
      setForm(null);
    }
  }, [visitor]);

  const goToVisitor = (value) => navigate(`${ROUTES.EDIT_REGISTRATION}/${value}`);

  const handleSave = async () => {
    const found = validateVisitor(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await visitorService.updateVisitor(id, { ...form, name: form.name.trim(), phone: form.phone.trim() });
      toast.show('Changes saved.');
      navigate(ROUTES.VISITORS);
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      setLatestFingerprint(await visitorService.enrollFingerprint(id));
      setFingerprintCount((c) => c + 1);
      toast.show('Fingerprint added.');
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <Link to={ROUTES.VISITORS} className="back-link"><ChevronLeft size={16} /> Back to Registered Visitors</Link>
      <PageHeader title="Edit Registration" subtitle="Update visitor details and manage fingerprint enrollment." />

      <div className="stack">
        <VisitorLookup key={id || 'none'} initialId={id || ''} onProceed={goToVisitor} loading={loading && !!id} />

        {id && loading && <Loading text="Loading visitor..." />}
        {id && error && <div className="card"><ErrorMessage message={error} /></div>}

        {form && (
          <>
            <div className="card card-pad stack">
              <h2 className="cell-flex"><User size={20} /> Visitor Details</h2>
              <div className="form-grid">
                <TextField label="Name" icon={User} required value={form.name} onChange={set('name')} error={errors.name} />
                <TextField label="Phone" icon={Phone} required inputMode="numeric" maxLength={10} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} error={errors.phone} />
                <SelectField label="Department" icon={Building2} required options={DEPARTMENTS} value={form.department} onChange={set('department')} error={errors.department} />
                <SelectField label="Role" icon={Users} required options={ROLES} value={form.role} onChange={set('role')} error={errors.role} />
              </div>
            </div>

            <div className="card card-pad stack">
              <div>
                <h2>Fingerprint Enrollment</h2>
                <p className="muted">Manage fingerprint for this visitor.</p>
              </div>
              <FingerprintEnrollment count={fingerprintCount} latest={latestFingerprint} onEnroll={handleEnroll} enrolling={enrolling} />
            </div>

            <Button block large icon={Save} onClick={handleSave} loading={saving}>Save Changes</Button>
          </>
        )}
      </div>
    </>
  );
}
