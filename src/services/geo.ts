import type { CollectionPoint, Coordinates, PointWithDistance, UserLocation } from '../domain/types';
import { normalizeText } from './text';

const EARTH_RADIUS_KM = 6371;

/** Distância em linha reta, pela fórmula de Haversine. */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 100) * 10} m`;
  return `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
}

/** Com localização, ordena do mais próximo ao mais distante; sem ela, em ordem alfabética. */
export function sortPoints(points: CollectionPoint[], origin: Coordinates | null): PointWithDistance[] {
  const withDistance = points.map((point) => ({
    ...point,
    distanceKm: origin ? distanceKm(origin, point) : null,
  }));
  return withDistance.sort((a, b) =>
    a.distanceKm !== null && b.distanceKm !== null
      ? a.distanceKm - b.distanceKm
      : a.name.localeCompare(b.name, 'pt-BR'),
  );
}

/** Abre o aplicativo de mapas do celular ou o Google Maps no computador. */
export function routeUrl(point: Coordinates, origin?: Coordinates | null): string {
  const params = new URLSearchParams({ api: '1', destination: `${point.lat},${point.lng}` });
  if (origin) params.set('origin', `${origin.lat},${origin.lng}`);
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Bairros reconhecidos sem acessar a internet. */
const NEIGHBORHOODS: UserLocation[] = [
  { label: 'Centro', lat: -23.5015, lng: -47.458 },
  { label: 'Parque Campolim', lat: -23.531, lng: -47.468 },
  { label: 'Vila Hortência', lat: -23.4895, lng: -47.44 },
  { label: 'Éden', lat: -23.415, lng: -47.406 },
  { label: 'Parque Vitória Régia', lat: -23.465, lng: -47.475 },
  { label: 'Santa Rosália', lat: -23.492, lng: -47.47 },
  { label: 'Aparecidinha', lat: -23.44, lng: -47.38 },
  { label: 'Wanel Ville', lat: -23.512, lng: -47.497 },
];

export function findNeighborhood(text: string): UserLocation | null {
  const query = normalizeText(text);
  if (query.length < 3) return null;
  return (
    NEIGHBORHOODS.find((neighborhood) => {
      const name = normalizeText(neighborhood.label);
      return name === query || name.split(' ').slice(-2).join(' ') === query || name.endsWith(` ${query}`);
    }) ?? null
  );
}

// Área de Sorocaba usada para limitar a busca de endereços: oeste, norte, leste, sul.
const SOROCABA_VIEWBOX = '-47.62,-23.36,-47.29,-23.62';

/** Requisito 5: tenta um bairro conhecido e depois consulta o OpenStreetMap. */
export async function geocodeAddress(text: string, signal?: AbortSignal): Promise<UserLocation | null> {
  const neighborhood = findNeighborhood(text);
  if (neighborhood) return neighborhood;

  const params = new URLSearchParams({
    q: text,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'br',
    viewbox: SOROCABA_VIEWBOX,
    bounded: '1',
    'accept-language': 'pt-BR',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal });
  if (!response.ok) throw new Error(`Falha na busca de endereço: ${response.status}`);
  const [first] = (await response.json()) as { lat: string; lon: string }[];
  return first ? { label: text.trim(), lat: Number(first.lat), lng: Number(first.lon) } : null;
}

export function getBrowserPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocalização indisponível.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}
