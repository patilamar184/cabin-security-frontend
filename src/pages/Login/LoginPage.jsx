import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, User } from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { USE_MOCK } from '../../services/client';
import Button from '../../components/ui/Button';
import { TextField } from '../../components/ui/FormFields';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={ROUTES.HOME} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate(location.state?.from?.pathname || ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card stack" onSubmit={submit}>
        <div className="brand">
          <ShieldCheck size={40} />
          <h1>Cabin Security Management</h1>
        </div>
        <TextField label="Username" icon={User} required autoFocus value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <TextField label="Password" icon={Lock} type="password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="alert-error-inline">{error}</p>}
        <Button type="submit" block large loading={loading}>Log in</Button>
        {USE_MOCK && <p className="hint">Demo mode: amitpatil / password123</p>}
      </form>
    </div>
  );
}
