import { MATERIALS } from '../data/materials';
import type { MaterialId } from '../domain/types';
import { MaterialIcon } from './MaterialIcon';

interface MaterialGridProps {
  onSelect(material: MaterialId): void;
}

/** Requisito 3: escolha do material sem digitação. */
export function MaterialGrid({ onSelect }: MaterialGridProps) {
  return (
    <ul className="material-grid">
      {MATERIALS.map((material) => (
        <li key={material.id}>
          <button type="button" className="material-card" onClick={() => onSelect(material.id)}>
            <span className="material-card__icon"><MaterialIcon id={material.id} /></span>
            <span className="material-card__name">{material.name}</span>
            <span className="material-card__examples">{material.examples}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
