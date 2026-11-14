import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Field from '../components/Field';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { roleApi, visitorApi } from '../api';

export default function EditVisitor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [roles, setRoles] = useState([]);
  const [enroll, setEnroll] = useState({ kind: '', text: '', waiting: false });
  const [templateId, setTemplateId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  async function load() {
    const [visitor, roleList, fingerprint] = await Promise.all([
      visitorApi.get(id),
      roleApi.list(),
      visitorApi.fingerprintStatus(id),
    ]);
    setForm({
      name: visitor.name,
      department: visitor.department,
      phone: visitor.phone,
      role: visitor.role,
    });
    setRoles(roleList);
    setEnroll({
      kind: fingerprint.fingerprint_enrolled ? 'success' : 'info',
      text: fingerprint.fingerprint_enrolled
        ? 'Fingerprint is enrolled and active.'
        : `Fingerprint status: ${fingerprint.status}.`,
      waiting: false,
    });
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [id]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setError('');
    setSaved('');
    setBusy(true);
    try {
      await visitorApi.update(id, {
        name: form.name.trim(),
        department: form.department.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
      setSaved('Changes saved.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deactivate() {
    setBusy(true);
    try {
      await visitorApi.remove(id);
      navigate('/visitors');
    } catch (err) {
      setError(err.message);
      setConfirmDeactivate(false);
      setBusy(false);
    }
  }

  async function startEnrollment() {
    setEnroll({ kind: '', text: '', waiting: true });
    try {
      await visitorApi.enrollFingerprint(id, Number(templateId));
      setEnroll({
        kind: 'info',
        text: 'Enrollment command queued. Ask the visitor to scan their finger at the ESP32. Refresh this page after the device reports the result.',
        waiting: false,
      });
    } catch (err) {
      setEnroll({ kind: 'error', text: err.message, waiting: false });
    }
  }

  async function removeFingerprint() {
    setEnroll({ kind: '', text: '', waiting: true });
    try {
      await visitorApi.deleteFingerprint(id);
      setEnroll({ kind: 'success', text: 'Fingerprint deletion command queued.', waiting: false });
    } catch (err) {
      setEnroll({ kind: 'error', text: err.message, waiting: false });
    }
  }

  if (!form) {
    return (
      <>
        <PageHeading title="Manage visitor" />
        {error ? <Notice kind="error">{error}</Notice> : <p className="muted">Loading...</p>}
        <Link to="/visitors">Back to visitor list</Link>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Manage visitor" />
      <Notice kind="error">{error}</Notice>
      <Notice kind="success">{saved}</Notice>

      <Panel title="Visitor details">
        <form className="form" onSubmit={save}>
          <Field label="Full name">
            <input type="text" value={form.name} onChange={set('name')} minLength={2} maxLength={160} required />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={set('role')} required>
              {roles.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}
            </select>
          </Field>
          <Field label="Department">
            <input type="text" value={form.department} onChange={set('department')} minLength={2} maxLength={120} required />
          </Field>
          <Field label="Mobile number">
            <input type="tel" value={form.phone} onChange={set('phone')} minLength={7} maxLength={30} required />
          </Field>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>Save changes</button>
            <Link to="/visitors" className="btn">Back to visitor list</Link>
          </div>
        </form>
      </Panel>

      <Panel title="Fingerprint enrollment">
        <p>Status: <Badge value={enroll.kind === 'success' ? 'active' : enroll.kind === 'info' ? 'not enrolled' : enroll.kind || 'pending'} /></p>
        <Notice kind={enroll.kind || undefined}>{enroll.text}</Notice>
        <div className="form">
          <Field label="Fingerprint sensor template ID" hint="Use an unused sensor slot from 1 to 200.">
            <input type="number" min="1" max="200" value={templateId} onChange={(e) => setTemplateId(e.target.value)} />
          </Field>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={startEnrollment} disabled={enroll.waiting || !templateId}>
            {enroll.waiting ? 'Sending...' : 'Queue fingerprint enrollment'}
          </button>
          <button type="button" className="btn btn-danger" onClick={removeFingerprint} disabled={enroll.waiting}>
            Delete fingerprint
          </button>
        </div>
        <p className="muted" style={{ marginTop: 10 }}>The backend queues a command. The ESP32 must complete the scan and report the result before the status becomes active.</p>
      </Panel>

      <Panel title="Deactivate visitor">
        <p>Deactivation removes this visitor from the active visitor list and prevents their PIN from being used. Historical entry logs are retained.</p>
        <button type="button" className="btn btn-danger" onClick={() => setConfirmDeactivate(true)}>Deactivate visitor</button>
      </Panel>

      {confirmDeactivate && (
        <Modal title="Deactivate visitor" confirmLabel="Deactivate visitor" danger busy={busy} onCancel={() => setConfirmDeactivate(false)} onConfirm={deactivate}>
          Deactivate <strong>{form.name}</strong>? Their past entry records will remain available.
        </Modal>
      )}
    </>
  );
}
