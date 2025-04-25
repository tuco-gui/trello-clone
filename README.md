# Trello Clone

Um aplicativo de gestão de tarefas similar ao Trello, com design minimalista e suporte para múltiplos usuários.

## Funcionalidades

- Sistema completo de autenticação (login, registro, recuperação de senha)
- Gerenciamento de quadros, listas e cartões
- Funcionalidade de arrastar e soltar
- Sistema de etiquetas coloridas
- Datas de vencimento com marcação de conclusão
- Sistema de comentários
- Suporte para anexos
- Design responsivo para todos os dispositivos

## Tecnologias Utilizadas

- Next.js 15.1.4 (React 19)
- Tailwind CSS
- Zustand para gerenciamento de estado
- @dnd-kit para arrastar e soltar
- Cloudflare Workers e D1 Database

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/trello-clone.git
cd trello-clone

# Instalar dependências
pnpm install

# Configurar banco de dados local
wrangler d1 execute DB --local --file=migrations/0001_initial.sql

# Iniciar servidor de desenvolvimento
pnpm run dev
```

## Estrutura do Projeto

```
trello-clone/
├── migrations/              # Migrações do banco de dados D1
├── src/
│   ├── app/                # Páginas da aplicação (Next.js App Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Hooks personalizados
│   └── lib/                # Utilitários e lógica de negócios
├── public/                 # Arquivos estáticos
├── tests/                  # Testes automatizados
└── ...                     # Arquivos de configuração
```

## Scripts Disponíveis

- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Compila o aplicativo para produção
- `pnpm run start` - Inicia o aplicativo compilado
- `pnpm run test` - Executa os testes

## Credenciais de Teste

- Email: admin@example.com
- Senha: senha123

## Documentação

Para mais detalhes, consulte:
- [Guia do Usuário](./GUIA_USUARIO.md)
- [Documentação Técnica](./DOCUMENTACAO_TECNICA.md)

## Licença

MIT
# trello-clone
