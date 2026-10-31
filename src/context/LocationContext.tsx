import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserLocation } from '../domain/types';
import { geocodeAddress, getBrowserPosition } from '../services/geo';

type LocationStatus = 'idle' | 'locating' | 'searching';

interface LocationValue {
  location: UserLocation | null;
  status: LocationStatus;
  error: string | null;
  useDeviceLocation(): Promise<void>;
  useAddress(address: string): Promise<void>;
  clear(): void;
}

const STORAGE_KEY = 'recicla-mais:localizacao';
const LocationContext = createContext<LocationValue | null>(null);

function readStored(): UserLocation | null {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as UserLocation | null;
  } catch {
    return null;
  }
}

/** A localização fica só nesta aba do navegador e não é enviada ao projeto. */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(readStored);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const save = useCallback((next: UserLocation | null) => {
    setLocation(next);
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const useDeviceLocation = useCallback(async () => {
    setStatus('locating');
    setError(null);
    try {
      save({ ...(await getBrowserPosition()), label: 'Sua localização atual' });
    } catch (reason) {
      const denied = (reason as GeolocationPositionError).code === 1;
      setError(
        denied
          ? 'Você não autorizou o uso da localização. Digite um endereço ou bairro.'
          : 'Não foi possível obter sua localização. Digite um endereço ou bairro.',
      );
    } finally {
      setStatus('idle');
    }
  }, [save]);

  const useAddress = useCallback(
    async (address: string) => {
      setStatus('searching');
      setError(null);
      try {
        const found = await geocodeAddress(address);
        if (found) save(found);
        else setError('Não encontramos esse endereço em Sorocaba. Confira e tente de novo, ou digite o bairro.');
      } catch {
        setError('Não foi possível buscar o endereço agora. Verifique sua conexão ou digite o nome do bairro.');
      } finally {
        setStatus('idle');
      }
    },
    [save],
  );

  const clear = useCallback(() => {
    save(null);
    setError(null);
  }, [save]);

  const value = useMemo(
    () => ({ location, status, error, useDeviceLocation, useAddress, clear }),
    [location, status, error, useDeviceLocation, useAddress, clear],
  );
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useUserLocation(): LocationValue {
  const value = useContext(LocationContext);
  if (!value) throw new Error('useUserLocation precisa estar dentro de LocationProvider.');
  return value;
}
