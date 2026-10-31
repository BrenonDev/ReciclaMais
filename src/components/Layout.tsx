import { Info, Menu, Recycle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const REPOSITORY_URL = 'https://github.com/BrenonDev/ReciclaMais';

export function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Em troca de rota, volta ao topo e leva o foco ao conteúdo para leitores de tela.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo" onClick={(event) => {
        event.preventDefault();
        mainRef.current?.focus();
      }}>
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <p className="demo-banner">
          <Info aria-hidden="true" size={16} />
          <span>Versão de demonstração: os pontos de coleta são fictícios.</span>
        </p>
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Recicla+, página inicial">
            <span className="brand__mark"><Recycle aria-hidden="true" size={20} /></span>
            Recicla<span className="brand__plus">+</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav id="menu-principal" className="site-nav" data-open={menuOpen} aria-label="Principal">
            <NavLink to="/" end>Início</NavLink>
            <NavLink to="/sobre">Sobre o projeto</NavLink>
            <Link to="/buscar" className="button button--primary button--small">Encontrar ponto</Link>
          </nav>
        </div>
      </header>

      <main id="conteudo" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            <strong>Recicla+</strong> · Usina de Projetos Experimentais V · Centro Universitário Facens · Sorocaba, 2026
          </p>
          <nav aria-label="Rodapé" className="site-footer__nav">
            <Link to="/admin">Administração</Link>
            <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">Código no GitHub</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
