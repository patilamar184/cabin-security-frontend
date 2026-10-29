import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Phone, Save, User, Users } from 'lucide-react';
import { DEPARTMENTS, ROLES, ROUTES } from '../../config/constants';
import { useToast } from '../../context/ToastContext';
import * as visitorService from '../../services/visitorService';
import { validateVisitor } from '../../utils/validators';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { SelectField, TextField } from '../../components/ui/FormFields';
import FingerprintEnrollment from '../../components/common/FingerprintEnrollment';

const EMPTY = { name: '', phone: '', department: '', role: '' };

/**
 * Two steps:
 *  1. Continue  -> creates the visitor record
 *  2. Add Fingerprint -> enrolls a fingerprint on the door device, then Save
 */
export default function RegistrationPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [visitor, setVisitor] = useState(null); // set once step 1 is done
  const [creating, setCreating] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleContinue = async () => {
    const found = validateVisitor(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setCreating(true);
    try {
      const created = await visitorService.createVisitor({ ...form, name: form.name.trim(), phone: form.phone.trim() });
      setVisitor(created);
      toast.show('Details saved. Now add a fingerprint.');
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      setFingerprint(await visitorService.enrollFingerprint(visitor.id));
      toast.show('Fingerprint added.');
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleSave = () => {
    toast.show(`${visitor.name} is registered.`);
    navigate(ROUTES.VISITORS);
  };

  return (
    <>
      <PageHeader title="Visitor Registration" subtitle="Register a new visitor and enroll fingerprint for access." />

      <div className="card card-pad">
        <div className="step">
          <span className="step-num">1</span>
          <div>
            <h2>Visitor Details</h2>
            <p>Enter basic information about the visitor</p>
          </div>
        </div>

        <div className="step-body stack">
          <div className="form-grid">
            <TextField label="Name" icon={User} required value={form.name} onChange={set('name')} error={errors.name} disabled={!!visitor} />
            <SelectField label="Department" icon={Building2} required options={DEPARTMENTS} value={form.department} onChange={set('department')} error={errors.department} disabled={!!visitor} placeholder="Select department" />
            <TextField label="Phone" icon={Phone} required inputMode="numeric" maxLength={10} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} error={errors.phone} disabled={!!visitor} />
            <SelectField label="Role" icon={Users} required options={ROLES} value={form.role} onChange={set('role')} error={errors.role} disabled={!!visitor} placeholder="Select role" />
          </div>
          {!visitor && (
            <div style={{ textAlign: 'center' }}>
              <Button icon={ChevronRight} onClick={handleContinue} loading={creating}>Continue</Button>
            </div>
          )}
        </div>

        <hr className="step-divider" />

        <div className={visitor ? '' : 'is-locked'} aria-disabled={!visitor}>
          <div className="step">
            <span className="step-num">2</span>
            <div>
              <h2>Fingerprint Enrollment</h2>
              <p>Add visitor&apos;s fingerprint for door access</p>
            </div>
          </div>
          <div className="step-body">
            <FingerprintEnrollment count={visitor ? (fingerprint ? 1 : 0) : 0} latest={fingerprint} onEnroll={handleEnroll} enrolling={enrolling} disabled={!visitor} />
          </div>
          <Button block large icon={Save} onClick={handleSave} disabled={!fingerprint} style={{ marginTop: 20 }}>Save</Button>
        </div>
      </div>
    </>
  );
}
