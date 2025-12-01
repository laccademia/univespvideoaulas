/**
 * Adaptador que converte dados do Supabase para o formato esperado pelo frontend
 * Como a estrutura do Supabase é idêntica ao Manus, apenas reexportamos as funções
 */

import * as SupabaseDB from "./supabase-db";

// Reexportar todas as funções do Supabase
export const getVideoaulasComDetalhes = SupabaseDB.getVideoaulasComDetalhes;
export const getDisciplinasComCurso = SupabaseDB.getDisciplinasComCurso;
export const getEstatisticasGerais = SupabaseDB.getEstatisticas;
export const getAllCursos = SupabaseDB.getAllCursos;
export const getCursoById = SupabaseDB.getCursoById;
export const getDisciplinasByCursoId = SupabaseDB.getDisciplinasByCursoId;
export const getAllDisciplinas = SupabaseDB.getAllDisciplinas;
export const getAllProfessores = SupabaseDB.getAllProfessores;
export const getAllDesignersInstrucionais = SupabaseDB.getAllDesigners;

// Funções de busca
export async function getDisciplinaByCodigo(codigo: string) {
  const disciplinas = await SupabaseDB.getAllDisciplinas();
  return disciplinas.find((d: any) => d.codigo === codigo) || null;
}

export async function getProfessorByNome(nome: string) {
  const professores = await SupabaseDB.getAllProfessores();
  return professores.filter((p: any) => 
    p.nome.toLowerCase().includes(nome.toLowerCase())
  );
}

export async function getDesignerInstrucionalByNome(nome: string) {
  const designers = await SupabaseDB.getAllDesigners();
  return designers.filter((d: any) => 
    d.nome.toLowerCase().includes(nome.toLowerCase())
  );
}

export async function getVideoaulaById(id: number) {
  const videoaulas = await SupabaseDB.getVideoaulasComDetalhes();
  return videoaulas.find((v: any) => v.videoaula.id === id) || null;
}
