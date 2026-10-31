import { ArrowRight, MapPin, MessageSquareText, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialGrid } from '../components/MaterialGrid';
import { SearchForm } from '../components/SearchForm';
import { usePageTitle } from '../hooks/usePageTitle';

const STEPS = [
  { icon: MessageSquareText, title: 'Diga o que você tem', text: 'Escreva como falaria com alguém, por exemplo “tenho uma pilha”, ou escolha o material em uma lista.' },
  { icon: MapPin, title: 'Veja os pontos próximos', text: 'Mostramos só os locais que aceitam esse material, do mais perto ao mais longe.' },
  { icon: Navigation, title: 'Vá até o local', text: 'Confira endereço, horário e materiais aceitos, e abra a rota no seu aplicativo de mapas.' },
];

export function HomePage() {
  usePageTitle('Descarte certo, perto de você');
  const navigate = useNavigate();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <p className="eyebrow">Sorocaba, SP</p>
          <h1 id="hero-title">Descubra onde descartar cada resíduo, perto de você.</h1>
          <p className="hero__lead">
            Pilhas, eletrônicos e lâmpadas não vão no lixo comum. O Recicla+ indica para onde levar, sem que você precise entender de reciclagem.
          </p>
          <SearchForm onSearch={(query) => navigate(`/buscar?q=${encodeURIComponent(query)}`)} />
        </div>
      </section>

      <section className="section" aria-labelledby="materiais-title">
        <div className="container">
          <h2 id="materiais-title">Ou escolha o material</h2>
          <MaterialGrid onSelect={(material) => navigate(`/buscar?material=${material}`)} />
        </div>
      </section>

      <section className="section section--tinted" aria-labelledby="como-title">
        <div className="container">
          <h2 id="como-title">Como funciona</h2>
          <ol className="steps">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="step">
                <span className="step__icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="proposta-title">
        <div className="container callout">
          <div>
            <h2 id="proposta-title">Um projeto de extensão para a cidade</h2>
            <p>
              O Recicla+ reúne em um só lugar informações que hoje estão espalhadas, para apoiar o descarte correto e os Objetivos de Desenvolvimento Sustentável 11 e 12.
            </p>
          </div>
          <Link to="/sobre" className="button button--secondary">
            Conheça a proposta
            <ArrowRight aria-hidden="true" size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
