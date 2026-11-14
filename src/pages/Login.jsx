import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import Panel from '../components/Panel';
import Field from '../components/Field';
import Notice from '../components/Notice';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { token, role, signIn } = useAuth();
  const navigate = useNavigate();
  const [kind, setKind] = useState('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token && role) return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn(kind, email.trim(), password);
      navigate(kind === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.status === 401 || err.status === 403 ? 'The email or password is not correct.' : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="signin-wrap">
        <Panel title="Sign in">
          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={kind === 'owner'} onClick={() => setKind('owner')}>Cabin owner</button>
            <button type="button" role="tab" aria-selected={kind === 'admin'} onClick={() => setKind('admin')}>Administrator</button>
          </div>
          <Notice kind="error">{error}</Notice>
          <form className="form" onSubmit={submit}>
            <Field label="Email address">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </Field>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
            </div>
          </form>
          {kind === 'owner' && (
            <p className="muted" style={{ marginTop: 16 }}>
              New cabin owner? <Link to="/signup">Create an account</Link>
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
