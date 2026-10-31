export type MaterialId =
  | 'pilhas-baterias'
  | 'eletronicos'
  | 'lampadas'
  | 'oleo-cozinha'
  | 'papel-papelao'
  | 'plastico'
  | 'vidro'
  | 'metal'
  | 'medicamentos'
  | 'automotivos';

export interface Material {
  id: MaterialId;
  name: string;
  examples: string;
  /** Termos usados pelo interpretador; a pontuação favorece o termo mais longo. */
  terms: string[];
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  openingHours: string;
  phone?: string;
  materials: MaterialId[];
}

export type CollectionPointInput = Omit<CollectionPoint, 'id'>;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation extends Coordinates {
  label: string;
}

export interface Interpretation {
  query: string;
  material: MaterialId | null;
  alternatives: MaterialId[];
  matchedTerm: string | null;
}

export interface PointWithDistance extends CollectionPoint {
  distanceKm: number | null;
}
