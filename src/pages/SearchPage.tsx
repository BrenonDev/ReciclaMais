import { Check, List, Map as MapIcon, Pencil } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { LocationPanel } from '../components/LocationPanel';
import { MaterialGrid } from '../components/MaterialGrid';
import { MaterialIcon } from '../components/MaterialIcon';
import { PointCard } from '../components/PointCard';
import { SearchForm } from '../components/SearchForm';
import { useUserLocation } from '../context/LocationContext';
import { getMaterial, isMaterialId } from '../data/materials';
import type { CollectionPoint, Interpretation, MaterialId } from '../domain/types';
import { usePageTitle } from '../hooks/usePageTitle';
import { materialInterpreter, pointRepository } from '../services/container';
import { sortPoints } from '../services/geo';

const PointsMap = lazy(() => import('../components/PointsMap'));

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const materialParam = params.get('material');
  const selected = isMaterialId(materialParam) ? materialParam : null;

  usePageTitle(selected ? `Pontos para ${getMaterial(selected).name.toLowerCase()}` : 'Encontrar ponto de coleta');

  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [correcting, setCorrecting] = useState(false);

  useEffect(() => {
    setCorrecting(false);
    setInterpretation(null);
    if (!query || selected) return;
    let current = true;
    void materialInterpreter.interpret(query).then((result) => {
      if (current) setInterpretation(result);
    });
    return () => {
      current = false;
    };
  }, [query, selected]);

  function search(next: string) {
    setParams({ q: next });
  }

  function chooseMaterial(material: MaterialId) {
    setParams(query ? { q: query, material } : { material });
  }

  if (selected) {
    return (
      <div className="search-page">
        <div className="container">
          <Results material={selected} onChange={() => setParams({})} />
        </div>
      </div>
    );
  }

  const unknown = interpretation !== null && interpretation.material === null;
  const showGrid = !query || correcting || unknown;

  return (
    <div className="search-page">
      <div className="container">
        <h1>Encontrar ponto de coleta</h1>
        <SearchForm initialValue={query} onSearch={search} />

        <div role="status">
          {interpretation?.material && !correcting && (
            <Confirmation
              interpretation={interpretation}
              onConfirm={chooseMaterial}
              onCorrect={() => setCorrecting(true)}
            />
          )}
          {unknown && (
            <section className="panel panel--notice">
              <h2>Não entendemos “{query}”</h2>
              <p>Tente escrever de outro jeito, como “pilha” ou “celular antigo”, ou escolha o material abaixo.</p>
            </section>
          )}
        </div>

        {showGrid && (
          <section aria-labelledby="escolha-titulo">
            <h2 id="escolha-titulo">{correcting ? 'Qual é o material certo?' : 'Ou escolha o material'}</h2>
            <MaterialGrid onSelect={chooseMaterial} />
          </section>
        )}
      </div>
    </div>
  );
}

interface ConfirmationProps {
  interpretation: Interpretation;
  onConfirm(material: MaterialId): void;
  onCorrect(): void;
}

/** Requisito 2: mostra o que foi entendido antes de exibir os resultados. */
function Confirmation({ interpretation, onConfirm, onCorrect }: ConfirmationProps) {
  const material = getMaterial(interpretation.material as MaterialId);
  const alternatives = interpretation.alternatives.map(getMaterial);

  return (
    <section className="panel panel--highlight" aria-labelledby="confirmacao-titulo">
      <h2 id="confirmacao-titulo">{alternatives.length ? 'Qual destes é o seu caso?' : 'Entendemos que você quer descartar:'}</h2>
      {alternatives.length === 0 && (
        <>
          <p className="confirm__material">
            <span className="material-card__icon"><MaterialIcon id={material.id} /></span>
            {material.name}
          </p>
          <p className="confirm__examples">{material.examples}</p>
        </>
      )}
      <div className="panel__actions">
        <button
          type="button"
          className={`button ${alternatives.length ? 'button--secondary' : 'button--primary'}`}
          onClick={() => onConfirm(material.id)}
        >
          {alternatives.length === 0 && <Check aria-hidden="true" size={20} />}
          {alternatives.length ? material.name : 'Sim, ver pontos de coleta'}
        </button>
        {alternatives.map((alternative) => (
          <button key={alternative.id} type="button" className="button button--secondary" onClick={() => onConfirm(alternative.id)}>
            {alternative.name}
          </button>
        ))}
        <button type="button" className="button button--ghost" onClick={onCorrect}>
          <Pencil aria-hidden="true" size={18} />
          {alternatives.length ? 'Outro material' : 'Não, é outro material'}
        </button>
      </div>
    </section>
  );
}

function Results({ material, onChange }: { material: MaterialId; onChange(): void }) {
  const { location } = useUserLocation();
  const [points, setPoints] = useState<CollectionPoint[] | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    setPoints(null);
    void pointRepository.findByMaterial(material).then((found) => {
      if (current) setPoints(found);
    });
    return () => {
      current = false;
    };
  }, [material]);

  const sorted = useMemo(() => (points ? sortPoints(points, location) : []), [points, location]);
  const name = getMaterial(material).name;

  if (points === null) return <Loading label="Buscando pontos de coleta…" />;

  const heading = (
    <header className="results-heading">
      <div>
        <h1>{name}</h1>
        <p role="status">
          {sorted.length === 0 && 'Nenhum ponto de coleta encontrado'}
          {sorted.length === 1 && '1 ponto de coleta aceita este material'}
          {sorted.length > 1 && `${sorted.length} pontos de coleta aceitam este material`}
          {sorted.length > 0 && (location ? ', do mais perto ao mais longe' : ', em ordem alfabética')}
        </p>
      </div>
      <button type="button" className="button button--secondary button--small" onClick={onChange}>Trocar material</button>
    </header>
  );

  // Requisito 10: avisa e orienta uma nova busca.
  if (sorted.length === 0) {
    return (
      <>
        {heading}
        <section className="panel panel--notice">
          <h2>Ainda não temos ponto de coleta para {name.toLowerCase()}</h2>
          <p>Nenhum local cadastrado em Sorocaba aceita este material no momento. Tente uma nova busca, descrevendo o item de outra forma ou escolhendo outro material.</p>
          <div className="panel__actions">
            <button type="button" className="button button--primary" onClick={onChange}>Fazer nova busca</button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {heading}
      <LocationPanel />

      <div className="view-switch" role="group" aria-label="Forma de exibição">
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
          <List aria-hidden="true" size={18} /> Lista
        </button>
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
          <MapIcon aria-hidden="true" size={18} /> Mapa
        </button>
      </div>

      <div className="results" data-view={view}>
        <div className="results__list">
          {sorted.map((point, index) => (
            <PointCard
              key={point.id}
              point={point}
              index={index}
              origin={location}
              active={activeId === point.id}
              onHighlight={setActiveId}
            />
          ))}
        </div>
        <div className="results__map">
          <Suspense fallback={<Loading label="Carregando mapa…" />}>
            <PointsMap points={sorted} userLocation={location} activeId={activeId} label={`Mapa dos pontos de coleta de ${name.toLowerCase()}`} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
