-- Adicionar campo password_hash na tabela users
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;

-- Criar índice no email para otimizar login
CREATE INDEX idx_users_email ON users(email);
