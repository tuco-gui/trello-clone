-- Migration number: 0001 	 2025-04-23
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS labels;
DROP TABLE IF EXISTS card_labels;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS card_members;

-- Usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quadros
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  background TEXT DEFAULT '#f0f2f5',
  is_starred BOOLEAN DEFAULT 0,
  created_by INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Membros do quadro
CREATE TABLE IF NOT EXISTS board_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(board_id, user_id)
);

-- Listas
CREATE TABLE IF NOT EXISTS lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- Cartões
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  due_date DATETIME,
  is_completed BOOLEAN DEFAULT 0,
  created_by INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Etiquetas
CREATE TABLE IF NOT EXISTS labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- Relação entre cartões e etiquetas
CREATE TABLE IF NOT EXISTS card_labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  label_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE,
  UNIQUE(card_id, label_id)
);

-- Membros do cartão
CREATE TABLE IF NOT EXISTS card_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(card_id, user_id)
);

-- Comentários
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Anexos
CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhorar a performance
CREATE INDEX idx_boards_created_by ON boards(created_by);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_cards_created_by ON cards(created_by);
CREATE INDEX idx_labels_board_id ON labels(board_id);
CREATE INDEX idx_card_labels_card_id ON card_labels(card_id);
CREATE INDEX idx_card_labels_label_id ON card_labels(label_id);
CREATE INDEX idx_comments_card_id ON comments(card_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_attachments_card_id ON attachments(card_id);
CREATE INDEX idx_board_members_board_id ON board_members(board_id);
CREATE INDEX idx_board_members_user_id ON board_members(user_id);
CREATE INDEX idx_card_members_card_id ON card_members(card_id);
CREATE INDEX idx_card_members_user_id ON card_members(user_id);

-- Dados iniciais para teste
INSERT INTO users (email, name, password_hash) VALUES 
('admin@example.com', 'Administrador', '$2a$12$1234567890123456789012uvGU7zs.WBz/YUBR8iYYUpLLPGUvjHe'),
('usuario@example.com', 'Usuário Teste', '$2a$12$1234567890123456789012uvGU7zs.WBz/YUBR8iYYUpLLPGUvjHe');

-- Cores padrão para etiquetas
INSERT INTO boards (title, description, created_by) VALUES 
('Meu Primeiro Quadro', 'Quadro de exemplo para demonstração', 1);

INSERT INTO board_members (board_id, user_id, role) VALUES 
(1, 1, 'admin'),
(1, 2, 'member');

INSERT INTO lists (board_id, title, position) VALUES 
(1, 'A Fazer', 0),
(1, 'Em Progresso', 1),
(1, 'Concluído', 2);

INSERT INTO labels (board_id, name, color) VALUES 
(1, 'Urgente', '#f44336'),
(1, 'Importante', '#ff9800'),
(1, 'Baixa Prioridade', '#4caf50'),
(1, 'Bug', '#e91e63'),
(1, 'Melhoria', '#2196f3'),
(1, 'Documentação', '#9c27b0');

INSERT INTO cards (list_id, title, description, position, created_by) VALUES 
(1, 'Criar layout inicial', 'Desenvolver o layout básico da aplicação', 0, 1),
(1, 'Implementar autenticação', 'Criar sistema de login e registro', 1, 1),
(2, 'Configurar banco de dados', 'Configurar e testar conexão com banco de dados', 0, 1);

INSERT INTO card_labels (card_id, label_id) VALUES 
(1, 5),
(2, 2),
(3, 1);

INSERT INTO card_members (card_id, user_id) VALUES 
(1, 1),
(2, 1),
(2, 2),
(3, 1);

INSERT INTO comments (card_id, user_id, content) VALUES 
(1, 1, 'Vamos usar Tailwind CSS para o layout'),
(2, 1, 'Precisamos implementar autenticação com JWT');
