import { describe, expect, it } from 'vitest';
import { MATERIALS } from '../data/materials';
import { SEED_POINTS } from '../data/seedPoints';
import { DemoAuthService, DEMO_CREDENTIALS } from './AuthService';
import { LocalCollectionPointRepository } from './CollectionPointRepository';
import { distanceKm, findNeighborhood, formatDistance, routeUrl, sortPoints } from './geo';
import { DictionaryMaterialInterpreter } from './MaterialInterpreter';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

describe('DictionaryMaterialInterpreter', () => {
  const interpreter = new DictionaryMaterialInterpreter(MATERIALS);

  it.each([
    ['tenho uma pilha', 'pilhas-baterias'],
    ['quero descartar um celular antigo', 'eletronicos'],
    ['LÂMPADAS queimadas', 'lampadas'],
    ['remédio vencido', 'medicamentos'],
    ['óleo de cozinha usado', 'oleo-cozinha'],
    ['bateria de carro', 'automotivos'],
    ['óleo de motor', 'automotivos'],
    ['bateria de celular', 'pilhas-baterias'],
    ['garrafa de vidro', 'vidro'],
    ['caixas de papelão', 'papel-papelao'],
  ])('entende "%s"', async (query, expected) => {
    expect((await interpreter.interpret(query)).material).toBe(expected);
  });

  it('oferece alternativas quando a descrição é ambígua', async () => {
    const result = await interpreter.interpret('tenho uma garrafa');
    expect([result.material, ...result.alternatives].sort()).toEqual(['plastico', 'vidro']);
  });

  it('não confunde partes de palavras', async () => {
    expect((await interpreter.interpret('petróleo')).material).toBeNull();
    expect((await interpreter.interpret('tenho uma pipa')).material).toBeNull();
  });
});

describe('geo', () => {
  it('calcula distâncias conhecidas', () => {
    expect(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(111.19, 1);
  });

  it('formata distâncias', () => {
    expect(formatDistance(0.85)).toBe('850 m');
    expect(formatDistance(1.26)).toBe('1,3 km');
  });

  it('ordena por proximidade e, sem localização, por nome', () => {
    const near = sortPoints(SEED_POINTS, { lat: -23.415, lng: -47.406 });
    expect(near[0].id).toBe('exemplo-eden');
    const noLocation = sortPoints(SEED_POINTS, null);
    expect(noLocation[0].distanceKm).toBeNull();
    expect(noLocation[0].name).toBe('Cooperativa Exemplo Vitória Régia');
  });

  it('reconhece bairros com ou sem acento', () => {
    expect(findNeighborhood('eden')?.label).toBe('Éden');
    expect(findNeighborhood('Campolim')?.label).toBe('Parque Campolim');
    expect(findNeighborhood('xyz')).toBeNull();
  });

  it('monta o link da rota', () => {
    expect(routeUrl({ lat: -23.5, lng: -47.4 })).toContain('destination=-23.5%2C-47.4');
  });
});

describe('LocalCollectionPointRepository', () => {
  const input = {
    name: 'Novo',
    address: 'Rua X, 1',
    neighborhood: 'Centro',
    city: 'Sorocaba',
    lat: -23.5,
    lng: -47.4,
    openingHours: 'Sempre',
    materials: ['vidro' as const],
  };

  it('nenhum ponto de demonstração aceita itens automotivos', async () => {
    const repository = new LocalCollectionPointRepository(memoryStorage(), SEED_POINTS);
    expect(await repository.findByMaterial('automotivos')).toEqual([]);
  });

  it('cria, edita, remove e restaura', async () => {
    const repository = new LocalCollectionPointRepository(memoryStorage(), SEED_POINTS);
    const created = await repository.create(input);
    expect(await repository.getById(created.id)).toMatchObject({ name: 'Novo' });

    await repository.update(created.id, { ...input, name: 'Editado' });
    expect((await repository.getById(created.id))?.name).toBe('Editado');

    await repository.remove(created.id);
    expect(await repository.getById(created.id)).toBeNull();
    expect(await repository.list()).toHaveLength(SEED_POINTS.length);

    await repository.remove(SEED_POINTS[0].id);
    await repository.reset();
    expect(await repository.list()).toHaveLength(SEED_POINTS.length);
  });

  it('recupera os dados iniciais se o armazenamento estiver corrompido', async () => {
    const storage = memoryStorage();
    storage.setItem('recicla-mais:pontos:v1', '{quebrado');
    const repository = new LocalCollectionPointRepository(storage, SEED_POINTS);
    expect(await repository.list()).toHaveLength(SEED_POINTS.length);
  });
});

describe('DemoAuthService', () => {
  it('só autentica com as credenciais de demonstração', async () => {
    const auth = new DemoAuthService(memoryStorage());
    expect(await auth.signIn(DEMO_CREDENTIALS.email, 'errada')).toBe(false);
    expect(auth.isAuthenticated()).toBe(false);
    expect(await auth.signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true);
    expect(auth.isAuthenticated()).toBe(true);
    auth.signOut();
    expect(auth.isAuthenticated()).toBe(false);
  });
});
