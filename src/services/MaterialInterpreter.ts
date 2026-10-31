import type { Interpretation, Material, MaterialId } from '../domain/types';
import { normalizeText } from './text';

/** Contrato do requisito 1. A versão com IA do back-end deve implementar esta interface. */
export interface MaterialInterpreter {
  interpret(query: string): Promise<Interpretation>;
}

/** Versão de demonstração: reconhece termos de um dicionário local, sem usar IA. */
export class DictionaryMaterialInterpreter implements MaterialInterpreter {
  private readonly materials: Material[];

  constructor(materials: Material[]) {
    this.materials = materials;
  }

  async interpret(query: string): Promise<Interpretation> {
    const words = ` ${normalizeText(query)} `;
    const matches = this.materials
      .map((material) => ({ id: material.id, term: this.longestMatch(material, words) }))
      .filter((match): match is { id: MaterialId; term: string } => match.term !== null)
      .sort((a, b) => wordCount(b.term) - wordCount(a.term));

    const [best, ...others] = matches;
    if (!best) return { query, material: null, alternatives: [], matchedTerm: null };

    // Um termo mais longo resolve a ambiguidade: "bateria de carro" não é "bateria".
    const alternatives = others
      .filter((other) => wordCount(other.term) === wordCount(best.term))
      .map((other) => other.id);
    return { query, material: best.id, alternatives, matchedTerm: best.term };
  }

  private longestMatch(material: Material, words: string): string | null {
    let longest: string | null = null;
    for (const term of material.terms) {
      const pattern = new RegExp(` ${normalizeText(term)}(s|es)? `);
      if (pattern.test(words) && (!longest || wordCount(term) > wordCount(longest))) longest = term;
    }
    return longest;
  }
}

function wordCount(term: string): number {
  return term.split(' ').length;
}
