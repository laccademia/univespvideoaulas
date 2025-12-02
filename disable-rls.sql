-- Script para desabilitar RLS (Row Level Security) em todas as tabelas
-- Isso permite que todos possam ler e editar os dados sem restrições

-- Desabilitar RLS nas tabelas principais
ALTER TABLE cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE professores DISABLE ROW LEVEL SECURITY;
ALTER TABLE designers_instrucionais DISABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE videoaulas DISABLE ROW LEVEL SECURITY;
ALTER TABLE historico_importacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir leitura pública" ON cursos;
DROP POLICY IF EXISTS "Permitir leitura pública" ON disciplinas;
DROP POLICY IF EXISTS "Permitir leitura pública" ON cursos_disciplinas;
DROP POLICY IF EXISTS "Permitir leitura pública" ON professores;
DROP POLICY IF EXISTS "Permitir leitura pública" ON designers_instrucionais;
DROP POLICY IF EXISTS "Permitir leitura pública" ON ofertas_disciplinas;
DROP POLICY IF EXISTS "Permitir leitura pública" ON videoaulas;
DROP POLICY IF EXISTS "Permitir leitura pública" ON historico_importacoes;
DROP POLICY IF EXISTS "Permitir leitura pública" ON users;

-- Mensagem de confirmação
SELECT 'RLS desabilitado em todas as tabelas. Todos podem ler e editar os dados agora.' AS status;
