import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { DEMO_CREDENTIALS } from '../services/AuthService';

/** Requisito 11. */
export default function AdminLoginPage() {
  usePageTitle('Acesso de administrador');
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const valid = await signIn(email, password);
    setBusy(false);
    setError(!valid);
    if (valid) navigate((state as { from?: string } | null)?.from ?? '/admin', { replace: true });
  }

  return (
    <section className="section container narrow">
      <h1>Acesso de administrador</h1>
      <p>Área para cadastrar e manter os pontos de coleta.</p>
      <p className="demo-note">
        Demonstração, sem segurança real. Use <strong>{DEMO_CREDENTIALS.email}</strong> e a senha <strong>{DEMO_CREDENTIALS.password}</strong>.
      </p>
      <form className="form" onSubmit={(event) => void handleSubmit(event)} style={{ marginTop: '1.25rem' }}>
        <div role="alert">
          {error && <p className="error-summary">E-mail ou senha incorretos.</p>}
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="button button--primary" disabled={busy}>Entrar</button>
      </form>
    </section>
  );
}
