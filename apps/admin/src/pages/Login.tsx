import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthControllerLogin } from '@kuyuyopela/api-client';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('admin@kuyuyopela.com');
  const [password, setPassword] = useState('admin123');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useAuthControllerLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { data: { email, password } },
      {
        onSuccess: (res: any) => {
          login(res.admin, res.accessToken, res.refreshToken);
          navigate('/dashboard', { replace: true });
        },
      },
    );
  }

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="login-box">
        <div className="logo">KY <span>|</span> ADMIN</div>
        <p className="sub">Kuyuyopela Industries Dashboard</p>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600 mb-3">Invalid email or password.</p>}
        <button type="submit" disabled={isPending} className="btn btn-primary btn-block justify-center">
          <LogIn size={16} />
          {isPending ? 'Signing in…' : 'Log In'}
        </button>
        <p className="hint">Demo credentials are pre-filled. Just click Log In.</p>
      </form>
    </div>
  );
}