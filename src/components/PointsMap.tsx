import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { CollectionPoint, Coordinates } from '../domain/types';
import { formatDistance } from '../services/geo';

interface PointsMapProps {
  points: (CollectionPoint & { distanceKm?: number | null })[];
  userLocation?: Coordinates | null;
  activeId?: string | null;
  label: string;
  numbered?: boolean;
}

const SOROCABA: L.LatLngTuple = [-23.5015, -47.458];

function pinIcon(text: string, active: boolean): L.DivIcon {
  const element = document.createElement('span');
  element.className = `map-pin${active ? ' map-pin--active' : ''}`;
  element.textContent = text;
  return L.divIcon({ html: element, className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -16] });
}

// Montado com textContent: nomes vêm do cadastro e não devem ser tratados como HTML.
function popupContent(point: PointsMapProps['points'][number]): HTMLElement {
  const root = document.createElement('div');
  const name = document.createElement('strong');
  name.textContent = point.name;
  const address = document.createElement('span');
  address.textContent = `${point.address}, ${point.neighborhood}`;
  root.append(name, address);
  if (point.distanceKm != null) {
    const distance = document.createElement('div');
    distance.textContent = `A ${formatDistance(point.distanceKm)} em linha reta`;
    root.append(distance);
  }
  const link = document.createElement('a');
  link.href = `#/pontos/${encodeURIComponent(point.id)}`;
  link.textContent = 'Ver detalhes';
  link.style.display = 'block';
  link.style.marginTop = '0.35rem';
  root.append(link);
  return root;
}

/** Requisito 7. O mapa complementa a lista, que traz as mesmas informações em texto. */
export default function PointsMap({ points, userLocation, activeId, label, numbered = true }: PointsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(SOROCABA, 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    // O mapa pode nascer oculto no celular, até o usuário abrir a aba Mapa.
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
      if (boundsRef.current) map.fitBounds(boundsRef.current, { padding: [36, 36], maxZoom: 15, animate: false });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.stop();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    points.forEach((point, index) => {
      L.marker([point.lat, point.lng], {
        icon: pinIcon(numbered ? String(index + 1) : '', point.id === activeId),
        title: point.name,
        alt: point.name,
        zIndexOffset: point.id === activeId ? 1000 : 0,
      })
        .bindPopup(popupContent(point))
        .addTo(layer);
    });

    const coordinates: L.LatLngTuple[] = points.map((point) => [point.lat, point.lng]);
    if (userLocation) {
      const element = document.createElement('span');
      element.className = 'map-pin map-pin--user';
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({ html: element, className: '', iconSize: [18, 18], iconAnchor: [9, 9] }),
        title: 'Sua localização',
        alt: 'Sua localização',
      }).addTo(layer);
      coordinates.push([userLocation.lat, userLocation.lng]);
    }

    boundsRef.current = coordinates.length ? L.latLngBounds(coordinates) : null;
    if (boundsRef.current) map.fitBounds(boundsRef.current, { padding: [36, 36], maxZoom: 15, animate: false });
  }, [points, userLocation, activeId, numbered]);

  return <div ref={containerRef} className="point-map" role="region" aria-label={label} />;
}
