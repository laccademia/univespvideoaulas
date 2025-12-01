-- SQL para promover usuário para admin
-- Execute este script no painel do Supabase (SQL Editor)

-- Primeiro, crie a conta manualmente no Supabase Auth:
-- 1. Vá para Authentication > Users
-- 2. Clique em "Add user" > "Create new user"
-- 3. Email: claudia.mori.di@gmail.com
-- 4. Password: Univesp@br2025!
-- 5. Marque "Auto Confirm User" para não precisar confirmar email

-- Depois, execute este SQL para promover para admin:

-- Atualizar role para admin (se o usuário já existe na tabela users)
UPDATE users 
SET role = 'admin'
WHERE email = 'claudia.mori.di@gmail.com';

-- OU inserir novo registro se não existir ainda:
-- (Substitua 'USER_ID_AQUI' pelo ID do usuário criado no Auth)

INSERT INTO users (openId, email, name, role, loginMethod)
VALUES (
  'USER_ID_AQUI',  -- Copie o ID do usuário do painel Authentication > Users
  'claudia.mori.di@gmail.com',
  'Claudia Mori',
  'admin',
  'email'
)
ON CONFLICT (openId) 
DO UPDATE SET role = 'admin';
