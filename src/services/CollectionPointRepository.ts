import type { CollectionPoint, CollectionPointInput, MaterialId } from '../domain/types';

/** Contrato de acesso aos dados. A versão com API e banco deve implementar esta interface. */
export interface CollectionPointRepository {
  list(): Promise<CollectionPoint[]>;
  findByMaterial(material: MaterialId): Promise<CollectionPoint[]>;
  getById(id: string): Promise<CollectionPoint | null>;
  create(input: CollectionPointInput): Promise<CollectionPoint>;
  update(id: string, input: CollectionPointInput): Promise<CollectionPoint>;
  remove(id: string): Promise<void>;
  reset(): Promise<void>;
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Versão de demonstração: os dados ficam apenas no navegador de quem está usando. */
export class LocalCollectionPointRepository implements CollectionPointRepository {
  private static readonly KEY = 'recicla-mais:pontos:v1';
  private readonly storage: KeyValueStorage;
  private readonly seed: CollectionPoint[];

  constructor(storage: KeyValueStorage, seed: CollectionPoint[]) {
    this.storage = storage;
    this.seed = seed;
  }

  async list(): Promise<CollectionPoint[]> {
    return this.read();
  }

  async findByMaterial(material: MaterialId): Promise<CollectionPoint[]> {
    return this.read().filter((point) => point.materials.includes(material));
  }

  async getById(id: string): Promise<CollectionPoint | null> {
    return this.read().find((point) => point.id === id) ?? null;
  }

  async create(input: CollectionPointInput): Promise<CollectionPoint> {
    const point: CollectionPoint = { ...input, id: crypto.randomUUID() };
    this.write([...this.read(), point]);
    return point;
  }

  async update(id: string, input: CollectionPointInput): Promise<CollectionPoint> {
    const points = this.read();
    if (!points.some((point) => point.id === id)) throw new Error('Ponto de coleta não encontrado.');
    const updated: CollectionPoint = { ...input, id };
    this.write(points.map((point) => (point.id === id ? updated : point)));
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((point) => point.id !== id));
  }

  async reset(): Promise<void> {
    this.storage.removeItem(LocalCollectionPointRepository.KEY);
  }

  private read(): CollectionPoint[] {
    const stored = this.storage.getItem(LocalCollectionPointRepository.KEY);
    if (!stored) return this.seed;
    try {
      return JSON.parse(stored) as CollectionPoint[];
    } catch {
      return this.seed;
    }
  }

  private write(points: CollectionPoint[]): void {
    this.storage.setItem(LocalCollectionPointRepository.KEY, JSON.stringify(points));
  }
}
