import { eq, and, like, or, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  users,
  cursos,
  disciplinas,
  cursosDisciplinas,
  professores,
  designersInstrucionais,
  ofertasDisciplinas,
  videoaulas,
  InsertCurso,
  InsertDisciplina,
  InsertCursoDisciplina,
  InsertProfessor,
  InsertDesignerInstrucional,
  InsertOfertaDisciplina,
  InsertVideoaula,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client, {
        schema: {
          users, cursos, disciplines: disciplinas, cursosDisciplinas, professores, designersInstrucionais, ofertasDisciplinas, videoaulas
        }
      });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER QUERIES
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    // Proteção do owner: sempre admin, não pode ser rebaixado
    if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    } else if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else {
      // Novos usuários começam como viewer
      values.role = 'viewer';
      // Não atualiza role em updates subsequentes (preserva promoções)
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// CURSO QUERIES
// ============================================

export async function insertCurso(curso: InsertCurso) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cursos).values(curso).onConflictDoUpdate({
    target: cursos.nome,
    set: { eixo: curso.eixo, nome: curso.nome }
  });
}

export async function getAllCursos() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cursos);
}

export async function getCursoById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(cursos).where(eq(cursos.id, id)).limit(1);
  return result[0] || null;
}

export async function getCursoByNome(nome: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(cursos).where(eq(cursos.nome, nome)).limit(1);
  return result[0] || null;
}

// ============================================
// DISCIPLINA QUERIES
// ============================================

export async function insertDisciplina(disciplina: InsertDisciplina) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(disciplinas).values(disciplina).onConflictDoUpdate({
    target: disciplinas.codigo,
    set: {
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
    }
  });
}

export async function insertCursoDisciplina(cursoDisciplina: InsertCursoDisciplina) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cursosDisciplinas).values(cursoDisciplina);
}

export async function getAllDisciplinas() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(disciplinas);
}

export async function getDisciplinaByCodigo(codigo: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(disciplinas).where(eq(disciplinas.codigo, codigo)).limit(1);
  return result[0] || null;
}

export async function getDisciplinasByCursoId(cursoId: number) {
  const db = await getDb();
  if (!db) return [];

  // Buscar através da tabela de relacionamento
  const result = await db
    .select({
      disciplina: disciplinas,
      cursoDisciplina: cursosDisciplinas,
    })
    .from(cursosDisciplinas)
    .innerJoin(disciplinas, eq(cursosDisciplinas.disciplinaId, disciplinas.id))
    .where(eq(cursosDisciplinas.cursoId, cursoId));

  return result.map(r => ({
    ...r.disciplina,
    anoCurso: r.cursoDisciplina.anoCurso,
    bimestrePedagogico: r.cursoDisciplina.bimestrePedagogico,
  }));
}

// ============================================
// PROFESSOR QUERIES
// ============================================

export async function insertProfessor(professor: InsertProfessor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(professores).values(professor).onConflictDoUpdate({
    target: professores.nome,
    set: { nome: professor.nome }
  });
}

export async function getAllProfessores() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(professores);
}

export async function getProfessorByNome(nome: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(professores).where(eq(professores.nome, nome)).limit(1);
  return result[0] || null;
}

// ============================================
// DESIGNER INSTRUCIONAL QUERIES
// ============================================

export async function insertDesignerInstrucional(di: InsertDesignerInstrucional) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(designersInstrucionais).values(di).onConflictDoUpdate({
    target: designersInstrucionais.nome,
    set: { nome: di.nome }
  });
}

export async function getAllDesignersInstrucionais() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(designersInstrucionais);
}

export async function getDesignerInstrucionalByNome(nome: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(designersInstrucionais).where(eq(designersInstrucionais.nome, nome)).limit(1);
  return result[0] || null;
}

// ============================================
// OFERTA DISCIPLINA QUERIES
// ============================================

export async function insertOfertaDisciplina(oferta: InsertOfertaDisciplina) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(ofertasDisciplinas).values(oferta).returning({ id: ofertasDisciplinas.id });
  return result;
}

export async function getOfertaByDisciplinaAnoEBimestre(disciplinaId: number, ano: number, bimestreOperacional: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(ofertasDisciplinas).where(
    and(
      eq(ofertasDisciplinas.disciplinaId, disciplinaId),
      eq(ofertasDisciplinas.ano, ano),
      eq(ofertasDisciplinas.bimestreOperacional, bimestreOperacional)
    )
  ).limit(1);

  return result[0] || null;
}

// ============================================
// VIDEOAULA QUERIES
// ============================================

export async function insertVideoaula(videoaula: InsertVideoaula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(videoaulas).values(videoaula);
}

export async function getAllVideoaulas() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(videoaulas);
}

export async function getVideoaulaById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(videoaulas).where(eq(videoaulas.id, id)).limit(1);
  return result[0] || null;
}

// ============================================
// QUERIES COMPLEXAS COM JOINS
// ============================================

export async function getVideoaulasComDetalhes() {
  const db = await getDb();
  if (!db) return [];

  // Nota: Como disciplinas agora podem ter múltiplos cursos, não incluimos curso aqui
  // O curso deve ser obtido via cursosDisciplinas quando necessário
  return await db
    .select({
      videoaula: videoaulas,
      oferta: ofertasDisciplinas,
      disciplina: disciplinas,
      professor: professores,
      di: designersInstrucionais,
    })
    .from(videoaulas)
    .leftJoin(ofertasDisciplinas, eq(videoaulas.ofertaDisciplinaId, ofertasDisciplinas.id))
    .leftJoin(disciplinas, eq(ofertasDisciplinas.disciplinaId, disciplinas.id))
    .leftJoin(professores, eq(ofertasDisciplinas.professorId, professores.id))
    .leftJoin(designersInstrucionais, eq(ofertasDisciplinas.diId, designersInstrucionais.id))
    .orderBy(desc(videoaulas.id))
    .limit(10000); // Garantir que todas as videoaulas sejam retornadas
}

export async function getDisciplinasComCurso() {
  const db = await getDb();
  if (!db) return [];

  // Buscar disciplinas com seus cursos através da tabela de relacionamento
  const results = await db
    .select({
      disciplina: disciplinas,
      curso: cursos,
      cursoDisciplina: cursosDisciplinas,
    })
    .from(disciplinas)
    .leftJoin(cursosDisciplinas, eq(disciplinas.id, cursosDisciplinas.disciplinaId))
    .leftJoin(cursos, eq(cursosDisciplinas.cursoId, cursos.id));

  // Agrupar disciplinas únicas com seus cursos
  const disciplinasMap = new Map();

  for (const row of results) {
    const disciplinaId = row.disciplina.id;

    if (!disciplinasMap.has(disciplinaId)) {
      disciplinasMap.set(disciplinaId, {
        disciplina: row.disciplina,
        cursos: [],
      });
    }

    if (row.curso) {
      disciplinasMap.get(disciplinaId).cursos.push(row.curso);
    }
  }

  return Array.from(disciplinasMap.values());
}

// ============================================
// ESTATÍSTICAS
// ============================================

export async function getEstatisticasGerais() {
  const db = await getDb();
  if (!db) return null;

  const [totalVideoaulas] = await db.select({ count: sql<number>`count(*)` }).from(videoaulas);
  const [totalDisciplinas] = await db.select({ count: sql<number>`count(*)` }).from(disciplinas);
  const [totalCursos] = await db.select({ count: sql<number>`count(*)` }).from(cursos);
  const [totalProfessores] = await db.select({ count: sql<number>`count(*)` }).from(professores);
  const [totalDIs] = await db.select({ count: sql<number>`count(*)` }).from(designersInstrucionais);

  const [comLibras] = await db.select({ count: sql<number>`count(*)` }).from(videoaulas).where(sql`${videoaulas.linkLibras} IS NOT NULL AND ${videoaulas.linkLibras} != ''`);
  const [comAudiodescricao] = await db.select({ count: sql<number>`count(*)` }).from(videoaulas).where(sql`${videoaulas.linkAudiodescricao} IS NOT NULL AND ${videoaulas.linkAudiodescricao} != ''`);
  const [comCC] = await db.select({ count: sql<number>`count(*)` }).from(videoaulas).where(eq(videoaulas.ccLegenda, true));
  const [comSlides] = await db.select({ count: sql<number>`count(*)` }).from(videoaulas).where(eq(videoaulas.slidesDisponivel, true));

  return {
    totalVideoaulas: totalVideoaulas?.count || 0,
    totalDisciplinas: totalDisciplinas?.count || 0,
    totalCursos: totalCursos?.count || 0,
    totalProfessores: totalProfessores?.count || 0,
    totalDIs: totalDIs?.count || 0,
    acessibilidade: {
      comLibras: comLibras?.count || 0,
      comAudiodescricao: comAudiodescricao?.count || 0,
      comCC: comCC?.count || 0,
    },
    comSlides: comSlides?.count || 0,
  };
}

// ============================================
// VIDEOAULAS CRUD
// ============================================

export async function createVideoaula(data: InsertVideoaula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(videoaulas).values(data).returning({ id: videoaulas.id });
  return result.id;
}

export async function updateVideoaula(id: number, data: Partial<InsertVideoaula>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(videoaulas).set(data).where(eq(videoaulas.id, id));
  return true;
}

export async function deleteVideoaula(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(videoaulas).where(eq(videoaulas.id, id));
  return true;
}

// ============================================
// OFERTAS DISCIPLINAS CRUD (necessário para criar videoaulas)
// ============================================

export async function getOrCreateOfertaDisciplina(
  disciplinaId: number,
  ano: number,
  bimestreOperacional: number,
  professorId?: number,
  diId?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar oferta existente
  const [existing] = await db
    .select()
    .from(ofertasDisciplinas)
    .where(
      and(
        eq(ofertasDisciplinas.disciplinaId, disciplinaId),
        eq(ofertasDisciplinas.ano, ano),
        eq(ofertasDisciplinas.bimestreOperacional, bimestreOperacional)
      )
    )
    .limit(1);

  if (existing) {
    return existing.id;
  }

  // Criar nova oferta
  const [result] = await db.insert(ofertasDisciplinas).values({
    disciplinaId,
    ano,
    bimestreOperacional,
    professorId: professorId || null,
    diId: diId || null,
    tipo: "OFERTA",
  }).returning({ id: ofertasDisciplinas.id });

  return result.id;
}


// ============================================
// CRUD Helpers - Professores
// ============================================

export async function createProfessor(data: { nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(professores).values(data).returning({ id: professores.id });
  return result;
}

export async function updateProfessor(id: number, data: { nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(professores).set(data).where(eq(professores.id, id));
}

export async function deleteProfessor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(professores).where(eq(professores.id, id));
}

export async function getProfessorById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [professor] = await db.select().from(professores).where(eq(professores.id, id));
  return professor;
}


// ============================================
// CRUD Helpers - Disciplinas
// ============================================

export async function createDisciplina(data: { codigo: string; nome: string; cargaHoraria: number; cursoIds: number[] }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Inserir disciplina
  const [result] = await db.insert(disciplinas).values({
    codigo: data.codigo,
    nome: data.nome,
    cargaHoraria: data.cargaHoraria,
  }).returning({ id: disciplinas.id });

  const disciplinaId = result.id;

  // Inserir relacionamentos com cursos
  if (data.cursoIds.length > 0) {
    await db.insert(cursosDisciplinas).values(
      data.cursoIds.map(cursoId => ({
        cursoId,
        disciplinaId,
      }))
    );
  }

  return result;
}

export async function updateDisciplina(id: number, data: { codigo: string; nome: string; cargaHoraria: number; cursoIds: number[] }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Atualizar disciplina
  await db.update(disciplinas).set({
    codigo: data.codigo,
    nome: data.nome,
    cargaHoraria: data.cargaHoraria,
  }).where(eq(disciplinas.id, id));

  // Remover relacionamentos antigos
  await db.delete(cursosDisciplinas).where(eq(cursosDisciplinas.disciplinaId, id));

  // Inserir novos relacionamentos
  if (data.cursoIds.length > 0) {
    await db.insert(cursosDisciplinas).values(
      data.cursoIds.map(cursoId => ({
        cursoId,
        disciplinaId: id,
      }))
    );
  }
}

export async function deleteDisciplina(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remover relacionamentos primeiro
  await db.delete(cursosDisciplinas).where(eq(cursosDisciplinas.disciplinaId, id));

  // Remover disciplina
  await db.delete(disciplinas).where(eq(disciplinas.id, id));
}

export async function getDisciplinaById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [disciplina] = await db.select().from(disciplinas).where(eq(disciplinas.id, id));

  if (!disciplina) return null;

  // Buscar cursos associados
  const cursosAssociados = await db
    .select({ cursoId: cursosDisciplinas.cursoId })
    .from(cursosDisciplinas)
    .where(eq(cursosDisciplinas.disciplinaId, id));

  return {
    ...disciplina,
    cursoIds: cursosAssociados.map(c => c.cursoId),
  };
}


// ============================================
// CRUD Helpers - Designers Instrucionais
// ============================================

export async function createDesignerInstrucional(data: { nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(designersInstrucionais).values(data).returning({ id: designersInstrucionais.id });
  return result;
}

export async function updateDesignerInstrucional(id: number, data: { nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(designersInstrucionais).set(data).where(eq(designersInstrucionais.id, id));
}

export async function deleteDesignerInstrucional(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(designersInstrucionais).where(eq(designersInstrucionais.id, id));
}

export async function getDesignerInstrucionalById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [designer] = await db.select().from(designersInstrucionais).where(eq(designersInstrucionais.id, id));
  return designer;
}


// ============================================
// CRUD Helpers - Cursos
// ============================================

export async function createCurso(data: { eixo: string; nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(cursos).values(data).returning({ id: cursos.id });
  return result;
}

export async function updateCurso(id: number, data: { eixo: string; nome: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cursos).set(data).where(eq(cursos.id, id));
}

export async function deleteCurso(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remover relacionamentos com disciplinas primeiro
  await db.delete(cursosDisciplinas).where(eq(cursosDisciplinas.cursoId, id));

  // Remover curso
  await db.delete(cursos).where(eq(cursos.id, id));
}
