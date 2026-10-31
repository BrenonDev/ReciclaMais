import type { CollectionPoint } from '../domain/types';

/**
 * PONTOS FICTÍCIOS, apenas para demonstração. Nomes, endereços, horários e
 * coordenadas não correspondem a locais reais. Precisam ser substituídos por
 * dados confirmados antes dos testes com participantes.
 *
 * Nenhum ponto aceita "automotivos": assim é possível demonstrar o aviso de
 * ausência de resultado (requisito 10).
 */
export const SEED_POINTS: CollectionPoint[] = [
  {
    id: 'exemplo-centro',
    name: 'Ecoponto Exemplo Centro',
    address: 'Rua Exemplo A, 100',
    neighborhood: 'Centro',
    city: 'Sorocaba',
    lat: -23.5015,
    lng: -47.458,
    openingHours: 'Segunda a sábado, das 8h às 17h',
    materials: ['pilhas-baterias', 'eletronicos', 'lampadas', 'papel-papelao', 'plastico', 'vidro', 'metal'],
  },
  {
    id: 'exemplo-campolim',
    name: 'Farmácia Exemplo Campolim',
    address: 'Avenida Exemplo B, 200',
    neighborhood: 'Parque Campolim',
    city: 'Sorocaba',
    lat: -23.531,
    lng: -47.468,
    openingHours: 'Todos os dias, das 7h às 22h',
    materials: ['medicamentos', 'pilhas-baterias'],
  },
  {
    id: 'exemplo-hortencia',
    name: 'Supermercado Exemplo Vila Hortência',
    address: 'Rua Exemplo C, 300',
    neighborhood: 'Vila Hortência',
    city: 'Sorocaba',
    lat: -23.4895,
    lng: -47.44,
    openingHours: 'Todos os dias, das 8h às 21h',
    materials: ['pilhas-baterias', 'lampadas', 'oleo-cozinha', 'plastico', 'metal'],
  },
  {
    id: 'exemplo-eden',
    name: 'Ecoponto Exemplo Éden',
    address: 'Avenida Exemplo D, 400',
    neighborhood: 'Éden',
    city: 'Sorocaba',
    lat: -23.415,
    lng: -47.406,
    openingHours: 'Segunda a sexta, das 8h às 17h',
    materials: ['eletronicos', 'papel-papelao', 'plastico', 'vidro', 'metal', 'oleo-cozinha'],
  },
  {
    id: 'exemplo-vitoria-regia',
    name: 'Cooperativa Exemplo Vitória Régia',
    address: 'Rua Exemplo E, 500',
    neighborhood: 'Parque Vitória Régia',
    city: 'Sorocaba',
    lat: -23.465,
    lng: -47.475,
    openingHours: 'Segunda a sexta, das 7h às 16h',
    materials: ['papel-papelao', 'plastico', 'vidro', 'metal'],
  },
  {
    id: 'exemplo-santa-rosalia',
    name: 'Loja de Informática Exemplo Santa Rosália',
    address: 'Rua Exemplo F, 600',
    neighborhood: 'Santa Rosália',
    city: 'Sorocaba',
    lat: -23.492,
    lng: -47.47,
    openingHours: 'Segunda a sábado, das 9h às 18h',
    materials: ['eletronicos', 'pilhas-baterias'],
  },
  {
    id: 'exemplo-aparecidinha',
    name: 'Ecoponto Exemplo Aparecidinha',
    address: 'Estrada Exemplo G, 700',
    neighborhood: 'Aparecidinha',
    city: 'Sorocaba',
    lat: -23.44,
    lng: -47.38,
    openingHours: 'Segunda a sábado, das 8h às 16h',
    materials: ['lampadas', 'papel-papelao', 'vidro', 'metal', 'plastico'],
  },
  {
    id: 'exemplo-wanel-ville',
    name: 'Farmácia Exemplo Wanel Ville',
    address: 'Avenida Exemplo H, 800',
    neighborhood: 'Wanel Ville',
    city: 'Sorocaba',
    lat: -23.512,
    lng: -47.497,
    openingHours: 'Segunda a sábado, das 8h às 20h',
    materials: ['medicamentos', 'lampadas', 'oleo-cozinha'],
  },
];
