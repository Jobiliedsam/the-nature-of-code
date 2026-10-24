# The Nature of Code (Daniel Shiffman): ambiente com VS Code + Dev Container

Este guia monta um ambiente de desenvolvimento isolado, com Node.js, p5.js, VS Code e extensões, dentro de um container Docker. Na sua máquina ficam apenas os arquivos do projeto.

## Documentação do projeto

- [Guia técnico do site](./docs/GUIA-DO-SITE.md): escopo, responsabilidades de `index.html`, `server.js` e `runner.html`, convenções de implementação e revisão da organização de pastas.
- [Changelog](./CHANGELOG.md): resumo do estado anterior e posterior das mudanças relevantes feitas pelo agente de IA.

## O que será instalado no Windows

- WSL2 (subsistema Linux, exigido pelo Docker no Windows)
- Docker Desktop
- VS Code
- Extensão "Dev Containers" dentro do VS Code

Todo o resto (Node.js, npm, Git, p5.js e as extensões de edição) fica dentro do container.

## Pré-requisitos

- Windows 10 versão 2004 (build 19041) ou superior, 64 bits
- Virtualização habilitada na BIOS/UEFI
- Permissão de administrador
- winget disponível. Verifique com `winget --version` no PowerShell.

## Passo 1: habilitar o WSL2

Abra o PowerShell como administrador e execute:

```powershell
wsl --install
```

Reinicie o computador quando solicitado. Depois da reinicialização, defina o WSL2 como padrão:

```powershell
wsl --set-default-version 2
```

Se aparecer erro de versão antiga, execute `wsl --update`.

## Passo 2: instalar o Docker Desktop

```powershell
winget install -e --id Docker.DockerDesktop
```

Abra o Docker Desktop, aceite os termos e aguarde o status "Engine running". Em **Settings > General**, confirme que a opção **Use the WSL 2 based engine** está marcada.

Teste a instalação:

```powershell
docker run hello-world
```

Se aparecer a mensagem "Hello from Docker!", a instalação está correta.

## Passo 3: instalar o VS Code e a extensão Dev Containers

```powershell
winget install -e --id Microsoft.VisualStudioCode
```

Feche e reabra o PowerShell (para o comando `code` ser reconhecido) e execute:

```powershell
code --install-extension ms-vscode-remote.remote-containers
```

## Passo 4: criar a pasta do projeto

No PowerShell (o caminho pode ser outro, à sua escolha):

```powershell
mkdir C:\Estudos\nature-of-code
cd C:\Estudos\nature-of-code
```

Copie para essa pasta os arquivos entregues: `README.MD`, `CHANGELOG.md`, `index.html`, `runner.html`, `server.js`, as pastas `.devcontainer`, `docs` e `template`, `package.json` e as pastas dos capítulos.

A estrutura deve ficar assim:

```
nature-of-code/
├── .devcontainer/
│   └── devcontainer.json
├── chapter-01-randomness/
│   └── example-01-random-walker/
│       ├── walker.js
│       └── random-walker-sketch.js
├── docs/
│   └── GUIA-DO-SITE.md
├── template/
│   ├── index.html
│   └── sketch.js
├── .gitignore
├── CHANGELOG.md
├── index.html
├── package-lock.json
├── package.json
├── README.MD
├── runner.html
└── server.js
```

## Passo 5: abrir o projeto no container

Dentro da pasta do projeto, execute:

```powershell
code .
```

Quando aparecer o aviso **"Reopen in Container"**, clique nele. Se o aviso não aparecer, pressione `Ctrl+Shift+P` e escolha **Dev Containers: Reopen in Container**.

Na primeira vez, o Docker baixa a imagem base e monta o ambiente. Isso pode levar alguns minutos. Quando terminar, o canto inferior esquerdo da janela do VS Code mostra "Dev Container". As extensões listadas no `devcontainer.json` são instaladas automaticamente, e o `npm install` roda sozinho ao final da criação.

Para confirmar, abra o terminal integrado (`Ctrl+'`) e execute:

```bash
node -v
npm -v
ls node_modules
```

## Passo 6: executar o primeiro exemplo

No terminal do VS Code (que agora está dentro do container), execute:

```bash
npm run dev
```

O VS Code encaminha a porta 8080 para o seu Windows. Acesse http://localhost:8080/ para abrir o seletor. A página lê automaticamente as pastas `chapter-*`, seus exemplos `example*` e os arquivos JavaScript terminados em `sketch.js`. Selecione um capítulo e depois um exemplo para executá-lo; use os controles para voltar aos exemplos ou sair para a seleção de capítulos.

Cada exemplo precisa de um arquivo JavaScript terminado em `sketch.js`; não precisa de um `index.html`. Outros arquivos `.js` na pasta do exemplo são carregados antes do sketch, em ordem alfabética, para disponibilizar classes auxiliares como `Walker`. O `runner.html` da raiz carrega o p5.js, os auxiliares e o sketch escolhido dentro do portal. Por exemplo:

```text
chapter-01-randomness/
└── example-01-random-walker/
    ├── walker.js
    └── random-walker-sketch.js
```

## Passo 7: criar um novo exemplo

Para criar um capítulo e um exemplo, use o template de sketch. No terminal do container:

```bash
mkdir -p chapter-02-vectors/example-01-nome
cp template/sketch.js chapter-02-vectors/example-01-nome/nome-sketch.js
```

O nome da pasta do capítulo deve começar com `chapter`; a pasta do exemplo deve começar com `example`; e o arquivo de p5.js deve terminar com `sketch.js`. O seletor detecta novas pastas e arquivos automaticamente. Não copie `template/index.html` para a pasta do exemplo.

Exemplo completo: `chapter-02-vectors/example-01-nome/nome-sketch.js`.

## Rotina diária

1. Abra o Docker Desktop e aguarde o status "Engine running".
2. Abra a pasta do projeto no VS Code. Se estiver usando `code .`, o VS Code reabre o container automaticamente, ou então use **Dev Containers: Reopen in Container**.
3. No terminal, execute `npm run dev` e trabalhe normalmente.

## Solução de problemas

- **"Cannot connect to the Docker daemon"**: o Docker Desktop não está em execução. Abra-o e aguarde.
- **Porta 8080 já em uso**: altere o número em `package.json` (`--port=XXXX`) e em `.devcontainer/devcontainer.json` (`forwardPorts` e a chave dentro de `portsAttributes`), depois faça o rebuild do container.
- **Erro `EACCES` no `npm install`**: no terminal do container, execute `sudo chown node:node node_modules && npm install`.
- **Alterei o `devcontainer.json` e nada mudou**: pressione `Ctrl+Shift+P` e escolha **Dev Containers: Rebuild Container**.
- **Exemplo não aparece no seletor**: confira os prefixos `chapter` e `example`, e confirme que o arquivo JavaScript termina com `sketch.js`.
- **Sketch não carrega**: confira se o arquivo selecionado usa as funções globais do p5.js e se há conexão com a internet para carregar a biblioteca p5.js do CDN.

## Limpeza

Para voltar a trabalhar sem o container, use **Dev Containers: Reopen Folder Locally** no VS Code.

Para remover o ambiente do Docker (sem afetar os seus arquivos), execute no PowerShell:

```powershell
docker container prune -f
docker volume rm nature-of-code-node_modules
```

Para remover a imagem base, use a aba **Images** do Docker Desktop.

Os arquivos do projeto ficam sempre na pasta local. O `node_modules` fica em um volume Docker separado, o que mantém a pasta do projeto limpa.

## Observações

- O p5.js é carregado por CDN com a versão fixada em 1.9.4 no `runner.html`. Para trocar a versão, altere a URL nesse arquivo.
- O livro usa p5.js como base dos exemplos. Consulte o repositório oficial do livro para os códigos de referência e compare com as suas versões.