import { ArrowLeft, Clock, MapPin, Navigation, Phone, Route } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { useUserLocation } from '../context/LocationContext';
import { getMaterial } from '../data/materials';
import type { CollectionPoint } from '../domain/types';
import { usePageTitle } from '../hooks/usePageTitle';
import { pointRepository } from '../services/container';
import { distanceKm, formatDistance, routeUrl } from '../services/geo';

const PointsMap = lazy(() => import('../components/PointsMap'));

/** Requisitos 8 e 9: detalhes do ponto de coleta e rota até ele. */
export function PointDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { location } = useUserLocation();
  const [point, setPoint] = useState<CollectionPoint | null | undefined>(undefined);

  usePageTitle(point?.name ?? 'Ponto de coleta');

  useEffect(() => {
    let current = true;
    void pointRepository.getById(id).then((found) => {
      if (current) setPoint(found);
    });
    return () => {
      current = false;
    };
  }, [id]);

  const mapPoints = useMemo(() => (point ? [point] : []), [point]);

  if (point === undefined) return <Loading />;

  if (point === null) {
    return (
      <section className="section container empty-state">
        <h1>Ponto de coleta não encontrado</h1>
        <p>Ele pode ter sido removido. Faça uma nova busca para ver os pontos disponíveis.</p>
        <Link to="/buscar" className="button button--primary">Fazer nova busca</Link>
      </section>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <button type="button" className="link-button back-link" onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" size={18} /> Voltar
        </button>
        <div className="detail">
          <article>
            <h1>{point.name}</h1>
            <dl className="detail-list">
              <div>
                <MapPin aria-hidden="true" size={20} />
                <dt>Endereço</dt>
                <dd>{point.address}, {point.neighborhood}, {point.city}</dd>
              </div>
              {location && (
                <div>
                  <Route aria-hidden="true" size={20} />
                  <dt>Distância em linha reta</dt>
                  <dd>{formatDistance(distanceKm(location, point))}</dd>
                </div>
              )}
              <div>
                <Clock aria-hidden="true" size={20} />
                <dt>Horário de funcionamento</dt>
                <dd>{point.openingHours}</dd>
              </div>
              {point.phone && (
                <div>
                  <Phone aria-hidden="true" size={20} />
                  <dt>Telefone</dt>
                  <dd><a href={`tel:${point.phone.replace(/\D/g, '')}`}>{point.phone}</a></dd>
                </div>
              )}
            </dl>

            <h2>Materiais aceitos</h2>
            <ul className="tag-list">
              {point.materials.map((material) => (
                <li key={material} className="tag">{getMaterial(material).name}</li>
              ))}
            </ul>

            <div className="panel__actions">
              <a href={routeUrl(point, location)} target="_blank" rel="noreferrer" className="button button--primary">
                <Navigation aria-hidden="true" size={20} />
                Ver rota até o local
              </a>
            </div>
          </article>

          <div className="detail__map">
            <Suspense fallback={<Loading label="Carregando mapa…" />}>
              <PointsMap points={mapPoints} userLocation={location} numbered={false} label={`Mapa com a localização de ${point.name}`} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
