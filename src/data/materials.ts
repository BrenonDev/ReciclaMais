import type { Material, MaterialId } from '../domain/types';

export const MATERIALS: Material[] = [
  {
    id: 'pilhas-baterias',
    name: 'Pilhas e baterias',
    examples: 'Pilhas comuns, baterias de celular e de notebook',
    terms: ['pilha', 'bateria', 'bateria de celular', 'bateria de notebook', 'bateria de relogio'],
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos',
    examples: 'Celulares, computadores, carregadores e cabos',
    terms: [
      'eletronico', 'eletroeletronico', 'eletrodomestico', 'celular', 'smartphone', 'telefone',
      'computador', 'notebook', 'tablet', 'impressora', 'monitor', 'teclado', 'mouse', 'carregador',
      'cabo', 'fone de ouvido', 'televisao', 'televisor', 'tv', 'radio', 'microondas', 'liquidificador',
    ],
  },
  {
    id: 'lampadas',
    name: 'Lâmpadas',
    examples: 'Fluorescentes, de LED e de vapor de mercúrio',
    terms: ['lampada', 'lampada fluorescente', 'lampada de led', 'fluorescente'],
  },
  {
    id: 'oleo-cozinha',
    name: 'Óleo de cozinha',
    examples: 'Óleo usado em frituras, guardado em garrafa fechada',
    terms: ['oleo', 'oleo de cozinha', 'oleo usado', 'oleo de fritura', 'gordura de fritura'],
  },
  {
    id: 'papel-papelao',
    name: 'Papel e papelão',
    examples: 'Caixas, jornais, revistas e cadernos',
    terms: ['papel', 'papeis', 'papelao', 'caixa', 'caixa de papelao', 'jornal', 'revista', 'caderno', 'livro'],
  },
  {
    id: 'plastico',
    name: 'Plástico',
    examples: 'Garrafas PET, potes, sacolas e embalagens',
    terms: ['plastico', 'garrafa', 'garrafa pet', 'garrafa plastica', 'pet', 'pote', 'sacola', 'embalagem', 'embalagem plastica'],
  },
  {
    id: 'vidro',
    name: 'Vidro',
    examples: 'Garrafas, potes e frascos de vidro',
    terms: ['vidro', 'garrafa', 'garrafa de vidro', 'pote de vidro', 'frasco de vidro', 'copo de vidro'],
  },
  {
    id: 'metal',
    name: 'Metal',
    examples: 'Latas de alimento e de bebida, sucata pequena',
    terms: ['metal', 'lata', 'latinha', 'aluminio', 'sucata', 'ferro', 'panela'],
  },
  {
    id: 'medicamentos',
    name: 'Medicamentos',
    examples: 'Remédios vencidos ou sem uso, com a embalagem',
    terms: ['medicamento', 'remedio', 'comprimido', 'xarope', 'antibiotico', 'remedio vencido'],
  },
  {
    id: 'automotivos',
    name: 'Pneus e itens automotivos',
    examples: 'Pneus, baterias de carro e óleo de motor',
    terms: ['pneu', 'bateria de carro', 'bateria de moto', 'bateria automotiva', 'oleo de motor', 'oleo lubrificante'],
  },
];

const BY_ID = new Map(MATERIALS.map((material) => [material.id, material]));

export function getMaterial(id: MaterialId): Material {
  return BY_ID.get(id) as Material;
}

export function isMaterialId(value: string | null): value is MaterialId {
  return value !== null && BY_ID.has(value as MaterialId);
}
