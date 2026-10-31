import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Página não encontrada');
  return (
    <section className="section container empty-state">
      <h1>Página não encontrada</h1>
      <p>O endereço pode estar incorreto ou a página pode ter sido removida.</p>
      <Link to="/" className="button button--primary">Voltar ao início</Link>
    </section>
  );
}
