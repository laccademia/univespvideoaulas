-- Script SQL para criar estrutura de tabelas no Supabase (PostgreSQL)
-- Versão corrigida sem políticas RLS complexas

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. TABELA DE CURSOS
-- ============================================
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  eixo VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. TABELA DE DISCIPLINAS
-- ============================================
CREATE TABLE IF NOT EXISTS disciplinas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nome VARCHAR(500) NOT NULL,
  "cargaHoraria" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. TABELA DE PROFESSORES
-- ============================================
CREATE TABLE IF NOT EXISTS professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. TABELA DE DESIGNERS INSTRUCIONAIS
-- ============================================
CREATE TABLE IF NOT EXISTS "designersInstrucionais" (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 6. TABELA DE RELACIONAMENTO CURSOS-DISCIPLINAS
-- ============================================
CREATE TABLE IF NOT EXISTS "cursosDisciplinas" (
  id SERIAL PRIMARY KEY,
  "cursoId" INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  "disciplinaId" INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  "anoCurso" INTEGER NOT NULL DEFAULT 1,
  "bimestrePedagogico" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 7. TABELA DE OFERTAS DE DISCIPLINAS
-- ============================================
CREATE TABLE IF NOT EXISTS "ofertasDisciplinas" (
  id SERIAL PRIMARY KEY,
  "disciplinaId" INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  "bimestreOperacional" INTEGER NOT NULL,
  "professorId" INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  "diId" INTEGER REFERENCES "designersInstrucionais"(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'OFERTA' CHECK (tipo IN ('OFERTA', 'REOFERTA')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 8. TABELA DE VIDEOAULAS
-- ============================================
CREATE TABLE IF NOT EXISTS videoaulas (
  id SERIAL PRIMARY KEY,
  "ofertaDisciplinaId" INTEGER NOT NULL REFERENCES "ofertasDisciplinas"(id) ON DELETE CASCADE,
  semana INTEGER NOT NULL,
  "numeroAula" INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  sinopse TEXT,
  "linkYoutubeOriginal" TEXT,
  "slidesDisponivel" BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(100),
  "idTvCultura" VARCHAR(100),
  "duracaoMinutos" INTEGER,
  "linkLibras" TEXT,
  "linkAudiodescricao" TEXT,
  "ccLegenda" BOOLEAN NOT NULL DEFAULT FALSE,
  "linkDownload" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 9. TABELA DE HISTÓRICO DE IMPORTAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS "historicoImportacoes" (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('acessibilidade', 'disciplinas', 'videoaulas')),
  "nomeArquivo" VARCHAR(255) NOT NULL,
  "usuarioId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "totalLinhas" INTEGER NOT NULL,
  sucessos INTEGER NOT NULL,
  erros INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_openId ON users("openId");
CREATE INDEX IF NOT EXISTS idx_cursos_nome ON cursos(nome);
CREATE INDEX IF NOT EXISTS idx_disciplinas_codigo ON disciplinas(codigo);
CREATE INDEX IF NOT EXISTS idx_professores_nome ON professores(nome);
CREATE INDEX IF NOT EXISTS idx_designers_nome ON "designersInstrucionais"(nome);
CREATE INDEX IF NOT EXISTS idx_cursosDisciplinas_cursoId ON "cursosDisciplinas"("cursoId");
CREATE INDEX IF NOT EXISTS idx_cursosDisciplinas_disciplinaId ON "cursosDisciplinas"("disciplinaId");
CREATE INDEX IF NOT EXISTS idx_ofertasDisciplinas_disciplinaId ON "ofertasDisciplinas"("disciplinaId");
CREATE INDEX IF NOT EXISTS idx_ofertasDisciplinas_professorId ON "ofertasDisciplinas"("professorId");
CREATE INDEX IF NOT EXISTS idx_ofertasDisciplinas_diId ON "ofertasDisciplinas"("diId");
CREATE INDEX IF NOT EXISTS idx_videoaulas_ofertaDisciplinaId ON videoaulas("ofertaDisciplinaId");
CREATE INDEX IF NOT EXISTS idx_historicoImportacoes_usuarioId ON "historicoImportacoes"("usuarioId");

-- ============================================
-- TRIGGERS PARA ATUALIZAR updatedAt
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON cursos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disciplinas_updated_at BEFORE UPDATE ON disciplinas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professores_updated_at BEFORE UPDATE ON professores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designers_updated_at BEFORE UPDATE ON "designersInstrucionais"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursosDisciplinas_updated_at BEFORE UPDATE ON "cursosDisciplinas"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ofertasDisciplinas_updated_at BEFORE UPDATE ON "ofertasDisciplinas"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videoaulas_updated_at BEFORE UPDATE ON videoaulas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - DESABILITADO POR ENQUANTO
-- ============================================
-- Vamos desabilitar RLS por enquanto para facilitar a migração
-- Você pode habilitar depois via interface do Supabase
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE professores DISABLE ROW LEVEL SECURITY;
ALTER TABLE "designersInstrucionais" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "cursosDisciplinas" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ofertasDisciplinas" DISABLE ROW LEVEL SECURITY;
ALTER TABLE videoaulas DISABLE ROW LEVEL SECURITY;
ALTER TABLE "historicoImportacoes" DISABLE ROW LEVEL SECURITY;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE users IS 'Tabela de usuários do sistema com autenticação';
COMMENT ON TABLE cursos IS 'Cursos oferecidos pela Univesp';
COMMENT ON TABLE disciplinas IS 'Disciplinas dos cursos';
COMMENT ON TABLE professores IS 'Professores responsáveis pelas videoaulas';
COMMENT ON TABLE "designersInstrucionais" IS 'Designers instrucionais responsáveis pelo conteúdo';
COMMENT ON TABLE "cursosDisciplinas" IS 'Relacionamento many-to-many entre cursos e disciplinas';
COMMENT ON TABLE "ofertasDisciplinas" IS 'Ofertas de disciplinas por ano e bimestre';
COMMENT ON TABLE videoaulas IS 'Videoaulas disponíveis no sistema';
COMMENT ON TABLE "historicoImportacoes" IS 'Histórico de importações de dados';
