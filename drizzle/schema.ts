import { integer, pgTable, text, timestamp, varchar, boolean, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["viewer", "admin"]);
export const tipoOfertaEnum = pgEnum("tipo_oferta", ["OFERTA", "REOFERTA"]);
export const tipoImportacaoEnum = pgEnum("tipo_importacao", ["acessibilidade", "disciplinas", "videoaulas"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("viewer").notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de cursos da Univesp
 */
export const cursos = pgTable("cursos", {
  id: serial("id").primaryKey(),
  eixo: varchar("eixo", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Curso = typeof cursos.$inferSelect;
export type InsertCurso = typeof cursos.$inferInsert;

/**
 * Tabela de disciplinas (sem cursoId - relacionamento many-to-many)
 */
export const disciplinas = pgTable("disciplinas", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 500 }).notNull(),
  cargaHoraria: integer("cargaHoraria").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Disciplina = typeof disciplinas.$inferSelect;
export type InsertDisciplina = typeof disciplinas.$inferInsert;

/**
 * Tabela de relacionamento many-to-many entre cursos e disciplinas
 */
export const cursosDisciplinas = pgTable("cursosDisciplinas", {
  id: serial("id").primaryKey(),
  cursoId: integer("cursoId").notNull(),
  disciplinaId: integer("disciplinaId").notNull(),
  anoCurso: integer("anoCurso").notNull().default(1),
  bimestrePedagogico: integer("bimestrePedagogico").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CursoDisciplina = typeof cursosDisciplinas.$inferSelect;
export type InsertCursoDisciplina = typeof cursosDisciplinas.$inferInsert;

/**
 * Tabela de professores
 */
export const professores = pgTable("professores", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Professor = typeof professores.$inferSelect;
export type InsertProfessor = typeof professores.$inferInsert;

/**
 * Tabela de designers instrucionais
 */
export const designersInstrucionais = pgTable("designersInstrucionais", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type DesignerInstrucional = typeof designersInstrucionais.$inferSelect;
export type InsertDesignerInstrucional = typeof designersInstrucionais.$inferInsert;

/**
 * Tabela de ofertas de disciplinas (por ano e bimestre operacional)
 */
export const ofertasDisciplinas = pgTable("ofertasDisciplinas", {
  id: serial("id").primaryKey(),
  disciplinaId: integer("disciplinaId").notNull(),
  ano: integer("ano").notNull(),
  bimestreOperacional: integer("bimestreOperacional").notNull(),
  professorId: integer("professorId"),
  diId: integer("diId"),
  tipo: tipoOfertaEnum("tipo").default("OFERTA").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type OfertaDisciplina = typeof ofertasDisciplinas.$inferSelect;
export type InsertOfertaDisciplina = typeof ofertasDisciplinas.$inferInsert;

/**
 * Tabela de videoaulas
 */
export const videoaulas = pgTable("videoaulas", {
  id: serial("id").primaryKey(),
  ofertaDisciplinaId: integer("ofertaDisciplinaId").notNull(),
  semana: integer("semana").notNull(),
  numeroAula: integer("numeroAula").notNull(),
  titulo: text("titulo").notNull(),
  sinopse: text("sinopse"),
  linkYoutubeOriginal: text("linkYoutubeOriginal"),
  slidesDisponivel: boolean("slidesDisponivel").default(false).notNull(),
  status: varchar("status", { length: 100 }),
  idTvCultura: varchar("idTvCultura", { length: 100 }),
  duracaoMinutos: integer("duracaoMinutos"),
  linkLibras: text("linkLibras"),
  linkAudiodescricao: text("linkAudiodescricao"),
  ccLegenda: boolean("ccLegenda").default(false).notNull(),
  linkDownload: text("linkDownload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Videoaula = typeof videoaulas.$inferSelect;
export type InsertVideoaula = typeof videoaulas.$inferInsert;

/**
 * Tabela de histórico de importações
 */
export const historicoImportacoes = pgTable("historicoImportacoes", {
  id: serial("id").primaryKey(),
  tipo: tipoImportacaoEnum("tipo").notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  usuarioId: integer("usuarioId").notNull(),
  totalLinhas: integer("totalLinhas").notNull(),
  sucessos: integer("sucessos").notNull(),
  erros: integer("erros").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HistoricoImportacao = typeof historicoImportacoes.$inferSelect;
export type InsertHistoricoImportacao = typeof historicoImportacoes.$inferInsert;

/**
 * Relações entre tabelas
 */
export const cursosRelations = relations(cursos, ({ many }) => ({
  cursosDisciplinas: many(cursosDisciplinas),
}));

export const disciplinasRelations = relations(disciplinas, ({ many }) => ({
  cursosDisciplinas: many(cursosDisciplinas),
  ofertas: many(ofertasDisciplinas),
}));

export const cursosDisciplinasRelations = relations(cursosDisciplinas, ({ one }) => ({
  curso: one(cursos, {
    fields: [cursosDisciplinas.cursoId],
    references: [cursos.id],
  }),
  disciplina: one(disciplinas, {
    fields: [cursosDisciplinas.disciplinaId],
    references: [disciplinas.id],
  }),
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
