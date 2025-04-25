# Instruções para Implantação no GitHub

Este documento fornece instruções detalhadas sobre como fazer upload deste projeto para seu repositório GitHub pessoal e configurar a implantação.

## Pré-requisitos

- Uma conta no GitHub
- Git instalado em seu computador local
- Node.js e pnpm instalados (para desenvolvimento local)
- Uma conta na Vercel (opcional, para implantação)

## Passos para Upload no GitHub

### 1. Criar um novo repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login em sua conta
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Dê um nome ao repositório (ex: "trello-clone")
4. Escolha se deseja que o repositório seja público ou privado
5. Não inicialize o repositório com README, .gitignore ou licença
6. Clique em "Create repository"

### 2. Inicializar o repositório Git local e fazer upload

Após baixar os arquivos deste projeto, abra um terminal na pasta raiz do projeto e execute os seguintes comandos:

```bash
# Inicializar o repositório Git (se ainda não estiver inicializado)
git init

# Adicionar todos os arquivos ao controle de versão
git add .

# Fazer o commit inicial
git commit -m "Commit inicial do Trello Clone"

# Adicionar o repositório remoto (substitua 'seu-usuario' pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/seu-usuario/trello-clone.git

# Enviar o código para o GitHub
git push -u origin main
```

## Configuração do CI/CD com GitHub Actions

O projeto já está configurado com GitHub Actions para CI/CD. Para que a implantação automática funcione, você precisará configurar alguns segredos no seu repositório GitHub:

1. Acesse seu repositório no GitHub
2. Vá para "Settings" > "Secrets and variables" > "Actions"
3. Adicione os seguintes segredos:
   - `VERCEL_TOKEN`: Seu token de API da Vercel
   - `VERCEL_PROJECT_ID`: ID do projeto na Vercel
   - `VERCEL_ORG_ID`: ID da organização na Vercel

### Como obter os valores para os segredos da Vercel

1. Instale a CLI da Vercel: `npm i -g vercel`
2. Execute `vercel login` e faça login em sua conta
3. Na pasta do projeto, execute `vercel link` para vincular o projeto
4. Os valores necessários serão exibidos ou podem ser encontrados no arquivo `.vercel/project.json` criado

## Implantação Manual na Vercel

Se preferir implantar manualmente:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Instale a CLI da Vercel: `npm i -g vercel`
3. Execute `vercel login` e faça login em sua conta
4. Na pasta do projeto, execute `vercel` para implantar
5. Para implantar em produção, execute `vercel --prod`

## Implantação em Outras Plataformas

### Netlify

1. Crie uma conta na [Netlify](https://netlify.com)
2. Vá para "Sites" e clique em "New site from Git"
3. Selecione GitHub e o repositório
4. Configure as opções de build:
   - Build command: `pnpm build`
   - Publish directory: `.next`
5. Clique em "Deploy site"

### Cloudflare Pages

1. Crie uma conta na [Cloudflare](https://cloudflare.com)
2. Vá para "Pages" e clique em "Create a project"
3. Selecione GitHub e o repositório
4. Configure as opções de build:
   - Build command: `pnpm build`
   - Build output directory: `.next`
5. Clique em "Save and deploy"

## Desenvolvimento Local

Para executar o projeto localmente:

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar http://localhost:3000 no navegador
```

## Credenciais de Teste

- Email: admin@example.com
- Senha: senha123
