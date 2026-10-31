import { usePageTitle } from '../hooks/usePageTitle';

const FEATURES = [
  ['Busca por descrição', 'Entende frases como “tenho uma pilha” e identifica o resíduo.'],
  ['Confirmação do material', 'Mostra o que foi entendido e permite corrigir antes dos resultados.'],
  ['Busca por categoria', 'Permite escolher o material em uma lista, sem digitar.'],
  ['Uso da localização', 'Usa a localização do aparelho, somente com a sua autorização.'],
  ['Informe manual de endereço', 'Busca a partir de um endereço ou bairro, se preferir não compartilhar a localização.'],
  ['Lista de pontos compatíveis', 'Lista os locais que aceitam o material, do mais próximo ao mais distante.'],
  ['Visualização em mapa', 'Exibe em um mapa os pontos encontrados.'],
  ['Detalhes do ponto de coleta', 'Informa nome, endereço, distância, horário e materiais aceitos.'],
  ['Rota até o ponto', 'Abre o aplicativo de mapas com o trajeto até o local escolhido.'],
  ['Aviso de ausência de resultado', 'Avisa quando não há ponto compatível e orienta uma nova busca.'],
  ['Autenticação de administrador', 'Restringe o acesso ao painel de administração.'],
  ['Gerenciamento de pontos de coleta', 'Permite cadastrar, editar e remover pontos e materiais aceitos.'],
];

const TEAM = [
  ['Brenon Olivetti Rondello', 'Front-end: interfaces, navegação e interação com o usuário.'],
  ['Eliwelton Alves de Oliveira', 'Inteligência artificial, base de pontos de coleta e testes com participantes.'],
  ['Luiz Fernando de Souza Campos', 'Back-end: lógica do sistema, APIs e banco de dados.'],
];

export function AboutPage() {
  usePageTitle('Sobre o projeto');

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="eyebrow">Sobre o projeto</p>
          <h1>Informação clara para descartar do jeito certo</h1>
          <p className="page-header__lead">
            Muita gente sabe que certos materiais não devem ir para o lixo comum, mas não sabe para onde levá-los. O Recicla+ existe para resolver essa dúvida.
          </p>
        </div>
      </header>

      <section className="section" aria-labelledby="problema-title">
        <div className="container two-columns">
          <div>
            <h2 id="problema-title">O problema</h2>
            <p>
              A Política Nacional de Resíduos Sólidos inclui pilhas e baterias, lâmpadas fluorescentes e produtos eletroeletrônicos entre os itens sujeitos à logística reversa, mas nem sempre o consumidor sabe onde entregá-los.{' '}
              <a href="https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm" target="_blank" rel="noreferrer">Consulte a Lei nº 12.305/2010</a>.
            </p>
          </div>
          <div>
            <h2>A proposta</h2>
            <p>
              Indicar pontos de coleta adequados a partir de uma descrição simples do material. A primeira área de atuação é Sorocaba, com possibilidade de expansão para outras cidades.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tinted" aria-labelledby="ods-title">
        <div className="container">
          <h2 id="ods-title">Objetivos de Desenvolvimento Sustentável</h2>
          <div className="ods-list">
            <article className="ods-card">
              <span className="ods-card__number" aria-hidden="true">11</span>
              <div>
                <h3>Cidades e comunidades sustentáveis</h3>
                <p>Aproxima a população dos pontos de coleta e apoia a gestão de resíduos na cidade.</p>
                <a href="https://brasil.un.org/pt-br/sdgs/11" target="_blank" rel="noreferrer">Ver o ODS 11</a>
              </div>
            </article>
            <article className="ods-card">
              <span className="ods-card__number" aria-hidden="true">12</span>
              <div>
                <h3>Consumo e produção responsáveis</h3>
                <p>Incentiva a reciclagem, o reaproveitamento de materiais e a destinação adequada dos resíduos.</p>
                <a href="https://brasil.un.org/pt-br/sdgs/12" target="_blank" rel="noreferrer">Ver o ODS 12</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="funcionalidades-title">
        <div className="container">
          <h2 id="funcionalidades-title">Funcionalidades</h2>
          <p className="section__lead">Todas as funcionalidades abaixo já podem ser usadas nesta versão.</p>
          <ol className="feature-list">
            {FEATURES.map(([name, description]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{description}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tinted" aria-labelledby="status-title">
        <div className="container two-columns">
          <div>
            <h2 id="status-title">O que esta versão ainda não faz</h2>
            <ul className="plain-list">
              <li>Os pontos de coleta são fictícios e as alterações ficam só no seu navegador.</li>
              <li>A busca por descrição reconhece um dicionário de termos; a inteligência artificial entra com o back-end.</li>
              <li>O acesso de administrador é só uma demonstração do fluxo, sem segurança real.</li>
            </ul>
          </div>
          <div>
            <h2>Equipe</h2>
            <ul className="team-list">
              {TEAM.map(([name, role]) => (
                <li key={name}><strong>{name}</strong><span>{role}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
