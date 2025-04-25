# Documentação Técnica do Trello Clone

## Visão Geral da Arquitetura

O Trello Clone é construído com as seguintes tecnologias:

1. **Frontend**:
   - Next.js 15.1.4 (React 19)
   - Tailwind CSS para estilização
   - Zustand para gerenciamento de estado
   - @dnd-kit para funcionalidade de arrastar e soltar

2. **Backend**:
   - Cloudflare Workers para hospedagem serverless
   - D1 Database (SQLite) para armazenamento de dados

3. **Autenticação**:
   - Sistema de autenticação baseado em JWT

## Estrutura do Projeto

```
trello-clone/
├── migrations/              # Migrações do banco de dados D1
│   └── 0001_initial.sql    # Esquema inicial do banco de dados
├── src/
│   ├── app/                # Páginas da aplicação (Next.js App Router)
│   │   ├── (auth)/         # Rotas de autenticação
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/    # Rotas do dashboard
│   │   │   ├── boards/
│   │   │   └── board/[id]/
│   │   ├── globals.css     # Estilos globais
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página inicial
│   ├── components/         # Componentes reutilizáveis
│   │   ├── auth/           # Componentes de autenticação
│   │   └── ui/             # Componentes de interface
│   │       ├── board/      # Componentes específicos do quadro
│   │       └── ...         # Outros componentes UI
│   ├── hooks/              # Hooks personalizados
│   └── lib/                # Utilitários e lógica de negócios
│       ├── auth/           # Lógica de autenticação
│       └── store.ts        # Store central (Zustand)
├── public/                 # Arquivos estáticos
├── tests/                  # Testes automatizados
├── tailwind.config.ts      # Configuração do Tailwind CSS
└── wrangler.toml           # Configuração do Cloudflare Workers
```

## Banco de Dados

O esquema do banco de dados inclui as seguintes tabelas principais:

1. **users**: Armazena informações dos usuários
2. **boards**: Armazena os quadros
3. **lists**: Armazena as listas dentro dos quadros
4. **cards**: Armazena os cartões dentro das listas
5. **labels**: Armazena as etiquetas disponíveis
6. **card_labels**: Relaciona cartões com etiquetas
7. **comments**: Armazena comentários nos cartões
8. **attachments**: Armazena informações sobre anexos

## Gerenciamento de Estado

O aplicativo utiliza Zustand para gerenciamento de estado, com os seguintes stores principais:

1. **useAuth**: Gerencia o estado de autenticação
2. **useBoardStore**: Gerencia o estado dos quadros, listas, cartões, etiquetas e comentários

## Fluxo de Dados

1. **Autenticação**:
   - O usuário faz login/registro
   - O token JWT é armazenado para autenticação
   - O estado de autenticação é atualizado no store

2. **Carregamento de Dados**:
   - Ao acessar a página de quadros, os quadros são carregados do banco de dados
   - Ao acessar um quadro específico, as listas e cartões são carregados
   - Os dados são armazenados no store central

3. **Modificação de Dados**:
   - As ações do usuário (criar, editar, excluir) são processadas pelo store
   - O store atualiza o estado local e envia as alterações para o banco de dados
   - A interface é atualizada para refletir as mudanças

## Funcionalidade de Arrastar e Soltar

A funcionalidade de arrastar e soltar é implementada usando a biblioteca @dnd-kit:

1. **DndContext**: Envolve a área onde o arrastar e soltar ocorre
2. **SortableContext**: Define o contexto de ordenação para listas ou cartões
3. **useSortable**: Hook usado nos componentes arrastáveis

## Personalização e Extensão

Para personalizar ou estender o aplicativo:

1. **Adicionar Novas Funcionalidades**:
   - Crie novos componentes em `src/components/`
   - Adicione novas rotas em `src/app/`
   - Estenda o store em `src/lib/store.ts`

2. **Modificar o Esquema do Banco de Dados**:
   - Crie novas migrações em `migrations/`
   - Aplique as migrações usando `wrangler d1 migrations apply DB --local`

3. **Personalizar a Aparência**:
   - Modifique os estilos em `src/app/globals.css`
   - Ajuste a configuração do Tailwind em `tailwind.config.ts`

## Implantação

O aplicativo pode ser implantado usando Cloudflare Workers:

1. **Preparação**:
   - Construa o aplicativo com `pnpm run build`
   - Configure o banco de dados D1 no Cloudflare

2. **Implantação**:
   - Use `wrangler deploy` para implantar o aplicativo
   - Configure as variáveis de ambiente necessárias

## Solução de Problemas

1. **Problemas de Autenticação**:
   - Verifique se o token JWT está sendo armazenado corretamente
   - Verifique se as credenciais estão corretas

2. **Problemas de Carregamento de Dados**:
   - Verifique a conexão com o banco de dados
   - Verifique se as consultas SQL estão corretas

3. **Problemas de Interface**:
   - Verifique o console do navegador para erros
   - Verifique se os componentes estão recebendo as props corretas
