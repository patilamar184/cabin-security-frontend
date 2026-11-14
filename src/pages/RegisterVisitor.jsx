import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Field from '../components/Field';
import Notice from '../components/Notice';
import VisitorPass from '../components/VisitorPass';
import { roleApi, visitorApi } from '../api';

const EMPTY = { name: '', department: '', phone: '', role: 'Student' };

export default function RegisterVisitor() {
  const [form, setForm] = useState(EMPTY);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState({ kind: '', text: '' });
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    roleApi.list().then(setRoles).catch((err) => setError(err.message));
  }, []);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const visitor = await visitorApi.create({
        name: form.name.trim(),
        department: form.department.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
      setCreated(visitor);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function startEnrollment() {
    setEnrollMsg({ kind: '', text: '' });
    try {
      await visitorApi.enrollFingerprint(created.id, Number(templateId));
      setEnrollMsg({ kind: 'success', text: 'Enrollment command queued. Ask the visitor to scan their finger at the door unit. The status changes after the ESP32 reports the result.' });
    } catch (err) {
      setEnrollMsg({ kind: 'error', text: err.message });
    }
  }

  function another() {
    setCreated(null);
    setForm(EMPTY);
    setEnrollMsg({ kind: '', text: '' });
    setTemplateId('');
  }

  if (created) {
    return (
      <>
        <PageHeading title="Visitor registered" />
        <Panel title="Visitor pass">
          <Notice kind="warning">
            Give this PIN to the visitor now. The backend stores only a password hash, so this PIN cannot be displayed again.
          </Notice>
          <VisitorPass visitor={created} />
          <Notice kind={enrollMsg.kind || undefined}>{enrollMsg.text}</Notice>
          <div className="form no-print" style={{ marginTop: 12 }}>
            <Field label="Fingerprint sensor template ID" hint="Choose an unused sensor slot from 1 to 200.">
              <input type="number" min="1" max="200" value={templateId} onChange={(e) => setTemplateId(e.target.value)} />
            </Field>
          </div>
          <div className="form-actions no-print">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>Print pass</button>
            <button type="button" className="btn" onClick={startEnrollment} disabled={!templateId}>Enrol fingerprint</button>
            <button type="button" className="btn" onClick={another}>Register another visitor</button>
            <Link to="/visitors" className="btn">Go to visitor list</Link>
          </div>
        </Panel>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Register a visitor">
        Add a visitor who may ask to enter your cabin. A PIN is created automatically.
      </PageHeading>
      <Panel title="Visitor details">
        <Notice kind="error">{error}</Notice>
        <form className="form" onSubmit={submit}>
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
          <Field label="Mobile number" hint="7 to 30 characters.">
            <input type="tel" value={form.phone} onChange={set('phone')} minLength={7} maxLength={30} required />
          </Field>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy || roles.length === 0}>
              {busy ? 'Registering...' : 'Register visitor'}
            </button>
          </div>
        </form>
      </Panel>
    </>
  );
}
