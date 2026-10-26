# Changelog

Este arquivo registra mudanças relevantes feitas pelo agente de IA no projeto.
Entradas descrevem o estado anterior e o estado posterior conhecido; alterações
feitas manualmente pelo usuário não são atribuídas ao agente.

## 2026-10-24

### Catálogo de sketches e carregamento de dependências

- **Antes:** o seletor dependia da existência de `index.html` dentro de cada
  exemplo; depois da mudança para `chapter`/`example`, o runner carregava apenas
  o arquivo terminado em `sketch.js`. Classes auxiliares em outros arquivos
  `.js`, como `Walker` em `walker.js`, não estavam disponíveis para o sketch.
- **Depois:** o catálogo não exige HTML por exemplo, encontra recursivamente
  arquivos JavaScript dentro da pasta do exemplo e envia os auxiliares ao
  runner. O runner carrega os auxiliares em ordem alfabética, antes do sketch,
  e informa falhas de carregamento.
- **Documentação:** o README descreve a convenção; este guia explica a
  descoberta e o carregamento.

### Navegação de capítulos e exemplos

- **Antes:** o projeto era documentado com pastas `capitulo-*` e
  `exemplo-*`, páginas HTML individuais e execução direta por URL.
- **Depois:** o catálogo identifica diretórios iniciados por `chapter` e
  `example`, o seletor da página inicial permite navegar até o exemplo e o
  `runner.html` da raiz executa o sketch selecionado sem um `index.html` por
  exemplo.
- **Documentação:** as instruções de estrutura, execução e criação de exemplos
  do README foram atualizadas para os nomes e o fluxo atuais.

### Página de apresentação

- **Antes:** não havia uma interface central para selecionar capítulos e
  exemplos.
- **Depois:** `index.html` apresenta um seletor responsivo com a identidade
  visual em tons de rosa e verde, navegação de volta e execução do sketch
  selecionado em um `iframe`.

## 2026-10-23

### Limite de memória do Dev Container

- **Antes:** o Dev Container não declarava um limite explícito de memória.
- **Depois:** `.devcontainer/devcontainer.json` aplica ao container Docker o
  limite `--memory=3g`.
