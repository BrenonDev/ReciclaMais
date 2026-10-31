import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import type { CollectionPoint } from '../domain/types';
import { usePageTitle } from '../hooks/usePageTitle';
import { pointRepository } from '../services/container';

/** Requisito 12: lista e remoção de pontos de coleta. */
export default function AdminPage() {
  usePageTitle('Pontos de coleta');
  const { signOut } = useAuth();
  const { state } = useLocation();
  const [points, setPoints] = useState<CollectionPoint[] | null>(null);
  const [toRemove, setToRemove] = useState<CollectionPoint | null>(null);
  const [message, setMessage] = useState<string | null>((state as { message?: string } | null)?.message ?? null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const load = useCallback(async () => {
    const list = await pointRepository.list();
    setPoints([...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function askRemoval(point: CollectionPoint) {
    setToRemove(point);
    dialogRef.current?.showModal();
  }

  async function confirmRemoval() {
    if (!toRemove) return;
    await pointRepository.remove(toRemove.id);
    dialogRef.current?.close();
    setMessage(`${toRemove.name} foi removido.`);
    await load();
  }

  async function restore() {
    await pointRepository.reset();
    setMessage('Os dados de demonstração foram restaurados.');
    await load();
  }

  return (
    <section className="section container">
      <header className="admin-head">
        <h1>Pontos de coleta</h1>
        <div className="admin-head__actions">
          <Link to="/admin/pontos/novo" className="button button--primary button--small">
            <Plus aria-hidden="true" size={18} /> Novo ponto
          </Link>
          <button type="button" className="button button--ghost button--small" onClick={signOut}>
            <LogOut aria-hidden="true" size={18} /> Sair
          </button>
        </div>
      </header>

      <div role="status">
        {message && <p className="success-message" style={{ marginBottom: '1.25rem' }}>{message}</p>}
      </div>

      {points === null ? (
        <Loading />
      ) : points.length === 0 ? (
        <p className="panel">Nenhum ponto cadastrado.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Pontos de coleta cadastrados</caption>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Endereço</th>
                <th scope="col">Materiais</th>
                <th scope="col"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.id}>
                  <td className="admin-table__name">{point.name}</td>
                  <td>{point.address}, {point.neighborhood}</td>
                  <td>{point.materials.length === 1 ? '1 material' : `${point.materials.length} materiais`}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/pontos/${encodeURIComponent(point.id)}`} className="button button--secondary button--small">
                        <Pencil aria-hidden="true" size={16} /> Editar<span className="sr-only"> {point.name}</span>
                      </Link>
                      <button type="button" className="button button--ghost button--small" onClick={() => askRemoval(point)}>
                        <Trash2 aria-hidden="true" size={16} /> Remover<span className="sr-only"> {point.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-foot">
        <p>As alterações ficam salvas apenas neste navegador.</p>
        <button type="button" className="link-button" onClick={() => void restore()}>Restaurar dados de demonstração</button>
      </div>

      <dialog ref={dialogRef} aria-labelledby="remover-titulo">
        <h2 id="remover-titulo">Remover ponto de coleta?</h2>
        <p>{toRemove?.name} deixará de aparecer nas buscas.</p>
        <div className="panel__actions">
          <button type="button" className="button button--danger" onClick={() => void confirmRemoval()}>Remover</button>
          <button type="button" className="button button--secondary" onClick={() => dialogRef.current?.close()}>Cancelar</button>
        </div>
      </dialog>
    </section>
  );
}
