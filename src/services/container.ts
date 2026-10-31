import { MATERIALS } from '../data/materials';
import { SEED_POINTS } from '../data/seedPoints';
import { DemoAuthService, type AuthService } from './AuthService';
import { LocalCollectionPointRepository, type CollectionPointRepository } from './CollectionPointRepository';
import { DictionaryMaterialInterpreter, type MaterialInterpreter } from './MaterialInterpreter';

// Único ponto a alterar para ligar o front-end ao back-end: basta trocar estas
// instâncias por implementações que chamem a API.
export const pointRepository: CollectionPointRepository = new LocalCollectionPointRepository(
  localStorage,
  SEED_POINTS,
);
export const materialInterpreter: MaterialInterpreter = new DictionaryMaterialInterpreter(MATERIALS);
export const authService: AuthService = new DemoAuthService(sessionStorage);
