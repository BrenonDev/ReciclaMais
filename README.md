# Recicla+

O **Recicla+** é uma aplicação web responsiva que facilita o descarte correto de resíduos. A pessoa informa o que quer descartar, como “tenho uma pilha”, e recebe os pontos de coleta adequados mais próximos, com endereço, horário, materiais aceitos e rota.

A primeira área de atuação é **Sorocaba, SP**. O projeto foi desenvolvido na disciplina **Usina de Projetos Experimentais V** do **Centro Universitário Facens** e se relaciona aos ODS 11 (Cidades e Comunidades Sustentáveis) e 12 (Consumo e Produção Responsáveis).

## Estado desta entrega

Esta é a entrega parcial: o **front-end está completo** e o back-end será feito na entrega final.

| Item | Nesta versão | Na entrega final |
|---|---|---|
| Pontos de coleta | **Fictícios**, no arquivo `src/data/seedPoints.ts` | Dados reais em banco de dados |
| Alterações do administrador | Salvas apenas no navegador (`localStorage`) | Salvas pela API |
| Busca por descrição | Dicionário de termos, **sem IA** | Interpretação por inteligência artificial |
| Login do administrador | Só demonstra o fluxo, **sem segurança real** | Autenticação no back-end |

## Funcionalidades

| ID | Requisito | Onde está |
|---|---|---|
| 1 | Busca por descrição | `components/SearchForm.tsx`, `services/MaterialInterpreter.ts` |
| 2 | Confirmação do material | `pages/SearchPage.tsx` |
| 3 | Busca por categoria | `components/MaterialGrid.tsx` |
| 4 | Uso da localização | `components/LocationPanel.tsx`, `context/LocationContext.tsx` |
| 5 | Informe manual de endereço | `components/LocationPanel.tsx`, `services/geo.ts` |
| 6 | Lista de pontos compatíveis | `pages/SearchPage.tsx`, `components/PointCard.tsx` |
| 7 | Visualização em mapa | `components/PointsMap.tsx` |
| 8 | Detalhes do ponto de coleta | `pages/PointDetailPage.tsx` |
| 9 | Rota até o ponto | `services/geo.ts`, `pages/PointDetailPage.tsx` |
| 10 | Aviso de ausência de resultado | `pages/SearchPage.tsx` |
| 11 | Autenticação de administrador | `pages/AdminLoginPage.tsx`, `services/AuthService.ts` |
| 12 | Gerenciamento de pontos de coleta | `pages/AdminPage.tsx`, `pages/PointFormPage.tsx` |

Para demonstrar o requisito 10, nenhum ponto fictício aceita itens automotivos: busque por “bateria de carro”.

Para acessar a administração, use o link no rodapé, com o e-mail `admin@recicla.mais` e a senha `recicla2026`. Essas credenciais são públicas e servem só para a demonstração.

## Como executar

É preciso ter o [Node.js](https://nodejs.org/) 22 ou superior.

```bash
npm install
npm run dev       # servidor de desenvolvimento, em http://localhost:5173
npm test          # testes automatizados
npm run build     # verificação de tipos e versão de produção, na pasta dist
npm run preview   # serve a versão de produção localmente
```

O mapa e a busca de endereços usam serviços do OpenStreetMap e precisam de internet. A localização do aparelho só funciona em `localhost` ou em HTTPS.

## Estrutura do código

```text
public/                 Ícone e manifesto da aplicação
src/
├── main.tsx            Ponto de entrada
├── App.tsx             Rotas
├── domain/types.ts     Tipos do domínio: material, ponto de coleta, localização
├── data/
│   ├── materials.ts    Materiais e termos reconhecidos na busca
│   └── seedPoints.ts   Pontos de coleta fictícios
├── services/           Regras de negócio, sem dependência de interface
│   ├── MaterialInterpreter.ts        Interpreta a descrição do usuário
│   ├── CollectionPointRepository.ts  Acesso aos dados dos pontos
│   ├── AuthService.ts                Autenticação do administrador
│   ├── geo.ts                        Distância, ordenação, endereço e rota
│   ├── text.ts                       Normalização de texto
│   ├── container.ts                  Escolhe as implementações usadas
│   └── services.test.ts              Testes automatizados
├── context/            Estado compartilhado: autenticação e localização
├── hooks/              Hook do título da página
├── components/         Partes reutilizáveis da interface
├── pages/              Uma página para cada rota
└── styles/global.css   Estilos, com variáveis de cor e pontos de responsividade
```

### Como o back-end será integrado

As páginas dependem de **interfaces**, não da forma como os dados são guardados:

```text
páginas e componentes → interfaces em services/ → implementações de demonstração
```

Para ligar à API, basta criar novas classes que implementem `CollectionPointRepository`, `MaterialInterpreter` e `AuthService`, e trocar as instâncias em `src/services/container.ts`. As telas não precisam mudar.

## Tecnologias

React, TypeScript, Vite, React Router, Leaflet com mapas do OpenStreetMap, Lucide (ícones), Figtree (fonte) e Vitest (testes).

## Versionamento

O desenvolvimento é registrado em commits por etapa, e o histórico pode ser consultado na [página de commits](https://github.com/BrenonDev/ReciclaMais/commits/main). As tarefas são organizadas no Trello.

## Equipe

- **Brenon Olivetti Rondello**: front-end
- **Eliwelton Alves de Oliveira**: inteligência artificial, base de pontos de coleta e testes com participantes
- **Luiz Fernando de Souza Campos**: back-end, APIs e banco de dados

Sorocaba, São Paulo, 2026.
