import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de cursos da Univesp
 */
export const cursos = mysqlTable("cursos", {
  id: int("id").autoincrement().primaryKey(),
  eixo: varchar("eixo", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Curso = typeof cursos.$inferSelect;
export type InsertCurso = typeof cursos.$inferInsert;

/**
 * Tabela de disciplinas
 */
export const disciplinas = mysqlTable("disciplinas", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 500 }).notNull(),
  cargaHoraria: int("cargaHoraria").notNull().default(0),
  anoCurso: int("anoCurso").notNull().default(1),
  bimestrePedagogico: int("bimestrePedagogico").notNull().default(1),
  cursoId: int("cursoId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Disciplina = typeof disciplinas.$inferSelect;
export type InsertDisciplina = typeof disciplinas.$inferInsert;

/**
 * Tabela de professores
 */
export const professores = mysqlTable("professores", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Professor = typeof professores.$inferSelect;
export type InsertProfessor = typeof professores.$inferInsert;

/**
 * Tabela de designers instrucionais
 */
export const designersInstrucionais = mysqlTable("designersInstrucionais", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DesignerInstrucional = typeof designersInstrucionais.$inferSelect;
export type InsertDesignerInstrucional = typeof designersInstrucionais.$inferInsert;

/**
 * Tabela de ofertas de disciplinas (por ano e bimestre operacional)
 */
export const ofertasDisciplinas = mysqlTable("ofertasDisciplinas", {
  id: int("id").autoincrement().primaryKey(),
  disciplinaId: int("disciplinaId").notNull(),
  ano: int("ano").notNull(),
  bimestreOperacional: int("bimestreOperacional").notNull(),
  professorId: int("professorId"),
  diId: int("diId"),
  tipo: mysqlEnum("tipo", ["OFERTA", "REOFERTA"]).default("OFERTA").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OfertaDisciplina = typeof ofertasDisciplinas.$inferSelect;
export type InsertOfertaDisciplina = typeof ofertasDisciplinas.$inferInsert;

/**
 * Tabela de videoaulas
 */
export const videoaulas = mysqlTable("videoaulas", {
  id: int("id").autoincrement().primaryKey(),
  ofertaDisciplinaId: int("ofertaDisciplinaId").notNull(),
  semana: int("semana").notNull(),
  numeroAula: int("numeroAula").notNull(),
  titulo: text("titulo").notNull(),
  sinopse: text("sinopse"),
  linkYoutubeOriginal: text("linkYoutubeOriginal"),
  slidesDisponivel: boolean("slidesDisponivel").default(false).notNull(),
  status: varchar("status", { length: 100 }),
  idTvCultura: varchar("idTvCultura", { length: 100 }),
  duracaoMinutos: int("duracaoMinutos"),
  linkLibras: text("linkLibras"),
  linkAudiodescricao: text("linkAudiodescricao"),
  ccLegenda: boolean("ccLegenda").default(false).notNull(),
  linkDownload: text("linkDownload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Videoaula = typeof videoaulas.$inferSelect;
export type InsertVideoaula = typeof videoaulas.$inferInsert;

/**
 * Relações entre tabelas
 */
export const cursosRelations = relations(cursos, ({ many }) => ({
  disciplinas: many(disciplinas),
}));

export const disciplinasRelations = relations(disciplinas, ({ one, many }) => ({
  curso: one(cursos, {
    fields: [disciplinas.cursoId],
    references: [cursos.id],
  }),
  ofertas: many(ofertasDisciplinas),
}));

export const professoresRelations = relations(professores, ({ many }) => ({
  ofertas: many(ofertasDisciplinas),
}));

export const designersInstrucionaisRelations = relations(designersInstrucionais, ({ many }) => ({
  ofertas: many(ofertasDisciplinas),
}));

export const ofertasDisciplinasRelations = relations(ofertasDisciplinas, ({ one, many }) => ({
  disciplina: one(disciplinas, {
    fields: [ofertasDisciplinas.disciplinaId],
    references: [disciplinas.id],
  }),
  professor: one(professores, {
    fields: [ofertasDisciplinas.professorId],
    references: [professores.id],
  }),
  di: one(designersInstrucionais, {
    fields: [ofertasDisciplinas.diId],
    references: [designersInstrucionais.id],
  }),
  videoaulas: many(videoaulas),
}));

export const videoaulasRelations = relations(videoaulas, ({ one }) => ({
  ofertaDisciplina: one(ofertasDisciplinas, {
    fields: [videoaulas.ofertaDisciplinaId],
    references: [ofertasDisciplinas.id],
  }),
}));
