# Guia técnico do site de apresentação

Este documento descreve a aplicação local que lista capítulos e executa os
sketches p5.js do projeto. O objetivo é servir de referência para implementar
funcionalidades, investigar falhas e manter o comportamento existente.

## Escopo

O site é uma ferramenta local de estudo para:

- encontrar capítulos e exemplos nas pastas do projeto;
- permitir navegar pela seleção de capítulo e exemplo;
- carregar um sketch p5.js com seus arquivos JavaScript auxiliares;
- executar o sketch em uma área isolada da tela, com opções para voltar ou sair.

O projeto não é, no estado atual, um serviço de publicação, uma aplicação com
contas ou banco de dados, nem um empacotador de sketches. O p5.js é obtido do
CDN jsDelivr, portanto a execução dos exemplos requer acesso à internet.

## Arquivos do site

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Página inicial, estilos e interface de seleção. Consulta o catálogo, apresenta capítulos e exemplos e controla a navegação entre telas. |
| `server.js` | Inicializa o `live-server` na porta 8080 e implementa `GET /api/chapters`, que descobre os capítulos, exemplos, sketches e arquivos `.js` auxiliares no disco. |
| `runner.html` | Documento carregado no `iframe` da interface. Valida os caminhos recebidos, carrega p5.js, carrega os scripts auxiliares em sequência e, por último, o sketch selecionado. |
| `package.json` | Define `npm run dev` e a dependência de desenvolvimento `live-server`. |
| `package-lock.json` | Registra as versões resolvidas das dependências npm; deve ser atualizado pelo npm quando as dependências mudarem. |
| `.devcontainer/devcontainer.json` | Configura o ambiente de desenvolvimento, o encaminhamento da porta 8080 e o limite de memória do container. |
| `template/` | Guarda materiais de referência para iniciar sketches. `template/index.html` é um exemplo independente e não é necessário dentro de cada pasta de exemplo do catálogo. |
| `docs/` | Guarda documentação técnica que não é o guia de instalação e uso principal. |
| `CHANGELOG.md` | Registra mudanças relevantes do projeto, com foco nas alterações feitas pelo agente de IA. |

## Como a descoberta funciona

1. O navegador carrega `/` e recebe `index.html` do `live-server`.
2. A interface solicita `GET /api/chapters`.
3. `server.js` procura, na raiz do projeto, diretórios cujo nome começa com
   `chapter` (sem diferenciar maiúsculas de minúsculas).
4. Dentro de cada capítulo, considera diretórios cujo nome começa com
   `example`.
5. Percorre recursivamente cada exemplo e encontra arquivos `.js`. O sketch
   selecionado deve terminar em `sketch.js`. Se houver um arquivo chamado
   exatamente `sketch.js`, ele tem preferência; caso contrário, seleciona o
   primeiro arquivo compatível em ordem alfabética.
6. Os demais arquivos `.js` encontrados naquele exemplo são enviados como
   auxiliares e carregados em ordem alfabética antes do sketch.
7. `index.html` abre `/runner.html` no `iframe`, passando o caminho do sketch e
   a lista de auxiliares. O runner carrega p5.js 1.9.4 do CDN, os auxiliares em
   sequência e, por fim, o sketch.

Não é preciso criar um `index.html` para cada exemplo. Exemplo de estrutura:

```text
chapter-01-randomness/
└── example-01-random-walker/
    ├── walker.js
    └── random-walker-sketch.js
```

## Padrões para novas implementações

- Preserve os nomes e responsabilidades dos três pontos de entrada: `index.html`
  para seleção, `server.js` para o catálogo e `runner.html` para execução.
- Mantenha o catálogo derivado das pastas e arquivos existentes; evite manter
  uma segunda lista manual de capítulos ou exemplos.
- Um exemplo precisa ter pelo menos um arquivo cujo nome termine em
  `sketch.js`. Arquivos auxiliares devem ter extensão `.js` e estar dentro da
  pasta do exemplo.
- Os auxiliares são scripts clássicos carregados antes do sketch, em ordem
  alfabética. Exponha classes e funções que o sketch usa no escopo global e
  evite nomes globais duplicados.
- Use funções globais do p5.js (`setup`, `draw`, `createCanvas` etc.) nos
  sketches atuais; o runner não configura instâncias de p5 em modo `new
  p5(...)`.
- Construa elementos de interface com APIs DOM e atribua nomes de pastas como
  texto, não como HTML. Se adicionar entrada fornecida por usuário, valide-a
  antes de montar URLs ou usá-la para acessar arquivos.
- Preserve a navegação de histórico do navegador e os controles de voltar e
  sair ao alterar os estados da interface.
- Erros de leitura do catálogo, carregamento de CDN ou carregamento de scripts
  devem permanecer visíveis; não substitua falhas por uma tela aparentemente
  bem-sucedida.
- Mantenha acessibilidade: controles nativos (`button`), rótulos, foco visível,
  mensagens anunciadas e suporte a telas estreitas e movimento reduzido.
- Se o código inline de `index.html` crescer, prefira mover estilos e lógica
  para arquivos próprios em `assets/`, sem alterar a URL pública `/` nem o
  contrato de `/api/chapters`.
- Ao alterar scripts, paths ou formatos do catálogo, teste tanto um exemplo
  com arquivo auxiliar quanto um exemplo sem auxiliares. Também verifique o
  retorno à seleção e os estados sem capítulos ou sem sketches.

## Execução e verificação manual

Inicie o site na raiz do projeto:

```bash
npm run dev
```

Abra `http://localhost:8080/`. Para investigar a descoberta, consulte
`http://localhost:8080/api/chapters`. Depois selecione um exemplo com arquivo
auxiliar, confirme que o sketch aparece e teste **Voltar aos exemplos** e
**Sair do exemplo**.

O `server.js` usa um servidor de desenvolvimento e expõe a raiz do projeto como
conteúdo estático. Destina-se ao uso local de estudo, não à hospedagem de
produção ou à exposição do servidor a redes não confiáveis.

## Revisão da organização atual

Para o tamanho atual, manter `index.html`, `runner.html` e `server.js` na raiz
faz sentido: a raiz já é a raiz estática do `live-server`, `/` abre diretamente
o seletor e `/runner.html` é uma rota simples para o executor. Separar agora
esses poucos arquivos em uma pasta `site/` exigiria alterar a raiz servida ou
adicionar regras de montagem de caminhos no servidor, sem benefício claro.

A pasta `docs/` é um local apropriado para este guia. Quando a interface
precisar ser mantida por mais pessoas ou crescer, a primeira separação útil
seria extrair o CSS e o JavaScript de `index.html` para arquivos estáticos,
mantendo a página de entrada na raiz:

```text
.
├── .devcontainer/
├── docs/
├── assets/
│   ├── css/
│   │   └── site.css
│   └── js/
│       └── app.js
├── chapter-.../
├── template/
├── index.html
├── runner.html
├── server.js
└── package.json
```

Uma futura pasta `src/` para módulos do servidor também só se justifica se
`server.js` ganhar responsabilidades ou testes automatizados próprios. Se isso
acontecer, preserve o `server.js` como inicializador simples do comando
`npm run dev`. Não mova os documentos públicos para `src/`; uma pasta `public/`
seria uma alternativa apenas se o servidor passasse a servir explicitamente
essa pasta e também disponibilizasse os exemplos.

### Oportunidade de melhoria identificada

Atualmente, o catálogo envia todos os arquivos `.js` do exemplo, exceto o
sketch selecionado, como auxiliares. Se um exemplo vier a ter mais de um arquivo
terminado em `sketch.js`, os outros também poderão ser executados como
auxiliares. Para evitar conflitos, mantenha apenas um sketch selecionável por
exemplo. Uma melhoria futura pode excluir todos os arquivos `*sketch.js` da
lista de auxiliares e definir explicitamente quais auxiliares são carregados.
