import { Crosshair, MapPin } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useUserLocation } from '../context/LocationContext';

/** Requisitos 4 e 5: localização do aparelho, com autorização, ou endereço digitado. */
export function LocationPanel() {
  const { location, status, error, useDeviceLocation, useAddress, clear } = useUserLocation();
  const [address, setAddress] = useState('');
  const busy = status !== 'idle';

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (address.trim()) void useAddress(address.trim());
  }

  if (location) {
    return (
      <section className="panel panel--highlight location-current" aria-label="Sua localização">
        <p>
          <MapPin aria-hidden="true" size={20} />
          <span>Distâncias a partir de: <strong>{location.label}</strong></span>
        </p>
        <button type="button" className="link-button" onClick={clear}>Alterar localização</button>
      </section>
    );
  }

  return (
    <section className="panel location-panel" aria-labelledby="localizacao-titulo">
      <p id="localizacao-titulo" className="location-panel__title">Veja primeiro os pontos mais perto de você</p>
      <button type="button" className="button button--secondary" onClick={() => void useDeviceLocation()} disabled={busy}>
        <Crosshair aria-hidden="true" size={20} />
        {status === 'locating' ? 'Localizando…' : 'Usar minha localização'}
      </button>
      <form className="location-panel__address" onSubmit={handleSubmit}>
        <label htmlFor="endereco" className="sr-only">Endereço ou bairro em Sorocaba</label>
        <input
          id="endereco"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Ou digite um endereço ou bairro"
          autoComplete="street-address"
          enterKeyHint="search"
        />
        <button type="submit" className="button button--secondary" disabled={busy || !address.trim()}>
          {status === 'searching' ? 'Buscando…' : 'Usar endereço'}
        </button>
      </form>
      <div role="status" style={{ display: 'contents' }}>
        {error && <p className="field-error">{error}</p>}
      </div>
    </section>
  );
}
