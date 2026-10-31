import { Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Coordinates, PointWithDistance } from '../domain/types';
import { formatDistance, routeUrl } from '../services/geo';

interface PointCardProps {
  point: PointWithDistance;
  index: number;
  origin: Coordinates | null;
  active: boolean;
  onHighlight(id: string | null): void;
}

export function PointCard({ point, index, origin, active, onHighlight }: PointCardProps) {
  return (
    <article
      className="point-card"
      data-active={active}
      onMouseEnter={() => onHighlight(point.id)}
      onMouseLeave={() => onHighlight(null)}
    >
      <div className="point-card__top">
        <div className="point-card__title">
          <span className="point-card__index" aria-hidden="true">{index + 1}</span>
          <h2><Link to={`/pontos/${encodeURIComponent(point.id)}`}>{point.name}</Link></h2>
        </div>
        {point.distanceKm !== null && (
          <span className="point-card__distance">
            <span className="sr-only">Distância: </span>
            {formatDistance(point.distanceKm)}
          </span>
        )}
      </div>
      <div className="point-card__body">
        <p>{point.address}, {point.neighborhood}</p>
        <p>{point.openingHours}</p>
      </div>
      <div className="point-card__actions">
        <Link to={`/pontos/${encodeURIComponent(point.id)}`} className="button button--secondary button--small">
          Ver detalhes<span className="sr-only"> de {point.name}</span>
        </Link>
        <a href={routeUrl(point, origin)} target="_blank" rel="noreferrer" className="button button--ghost button--small">
          <Navigation aria-hidden="true" size={16} />
          Ver rota<span className="sr-only"> até {point.name}</span>
        </a>
      </div>
    </article>
  );
}
