import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import Panel from '../components/Panel';
import Field from '../components/Field';
import Notice from '../components/Notice';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    cabin_name: '', cabin_location: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await authApi.ownerRegister({
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        cabin_name: form.cabin_name.trim(),
        cabin_location: form.cabin_location.trim(),
      });
      await signIn('owner', form.email.trim(), form.password);
      navigate('/device');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="signin-wrap">
        <Panel title="Create a cabin owner account">
          <Notice kind="error">{error}</Notice>
          <form className="form" onSubmit={submit}>
            <Field label="Full name">
              <input type="text" value={form.name} onChange={set('name')} minLength={2} maxLength={160} required />
            </Field>
            <Field label="Email address">
              <input type="email" value={form.email} onChange={set('email')} required />
            </Field>
            <Field label="Mobile number">
              <input type="tel" value={form.phone} onChange={set('phone')} minLength={7} maxLength={30} required />
            </Field>
            <Field label="Cabin name">
              <input type="text" value={form.cabin_name} onChange={set('cabin_name')} minLength={2} maxLength={160} placeholder="e.g. Room 204" required />
            </Field>
            <Field label="Cabin location">
              <input type="text" value={form.cabin_location} onChange={set('cabin_location')} minLength={2} maxLength={255} placeholder="e.g. Pune" required />
            </Field>
            <Field label="Password" hint="At least 8 characters.">
              <input type="password" value={form.password} onChange={set('password')} minLength={8} maxLength={128} autoComplete="new-password" required />
            </Field>
            <Field label="Confirm password">
              <input type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" required />
            </Field>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
              <Link to="/login" className="btn">Back to sign in</Link>
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}
