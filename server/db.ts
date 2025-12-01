import { eq, and, like, or, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
      _db = drizzle(process.env.DATABASE_URL);
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
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
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
  
  await db.insert(cursos).values(curso).onDuplicateKeyUpdate({
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
  
  await db.insert(disciplinas).values(disciplina).onDuplicateKeyUpdate({
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
  
  await db.insert(professores).values(professor).onDuplicateKeyUpdate({
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
  
  await db.insert(designersInstrucionais).values(di).onDuplicateKeyUpdate({
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
  
  const result = await db.insert(ofertasDisciplinas).values(oferta);
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
  
  const [result] = await db.insert(videoaulas).values(data);
  return result.insertId;
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
  });
  
  return result.insertId;
}
