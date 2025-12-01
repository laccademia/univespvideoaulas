/**
 * Helpers para leitura de dados do Supabase
 * Estrutura idêntica ao banco Manus (com ofertasDisciplinas)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODE0NjMsImV4cCI6MjA4MDE1NzQ2M30.RlwNmYFqTVAP6U5dtx0rBaeGdG-JEX3UwxuDuG3QUP8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============= CURSOS =============

export async function getAllCursos() {
  const { data, error } = await supabase
    .from('cursos')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getCursoById(id: number) {
  const { data, error } = await supabase
    .from('cursos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// ============= DISCIPLINAS =============

export async function getAllDisciplinas() {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getDisciplinaById(id: number) {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// ============= CURSOS-DISCIPLINAS =============

export async function getCursosDisciplinas() {
  const { data, error } = await supabase
    .from('cursosDisciplinas')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getDisciplinasByCursoId(cursoId: number) {
  const { data: relacoes, error } = await supabase
    .from('cursosDisciplinas')
    .select('disciplinaId')
    .eq('cursoId', cursoId);
  
  if (error) throw error;

  const disciplinasIds = relacoes.map((r: any) => r.disciplinaId);
  const disciplinas = await getAllDisciplinas();
  
  return disciplinas.filter((d: any) => disciplinasIds.includes(d.id));
}

// ============= PROFESSORES =============

export async function getAllProfessores() {
  const { data, error } = await supabase
    .from('professores')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) throw error;
  return data;
}

// ============= DESIGNERS =============

export async function getAllDesigners() {
  const { data, error } = await supabase
    .from('designersInstrucionais')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) throw error;
  return data;
}

// ============= OFERTAS DISCIPLINAS =============

export async function getAllOfertasDisciplinas() {
  const { data, error } = await supabase
    .from('ofertasDisciplinas')
    .select('*');
  
  if (error) throw error;
  return data;
}

// ============= VIDEOAULAS =============

export async function getAllVideoaulas() {
  const { data, error } = await supabase
    .from('videoaulas')
    .select('*')
    .order('id', { ascending: false })
    .limit(10000);
  
  if (error) throw error;
  return data;
}

export async function getVideoaulaById(id: number) {
  const { data, error } = await supabase
    .from('videoaulas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// ============= QUERIES COMPLEXAS =============

/**
 * Busca videoaulas com todos os detalhes (disciplina, oferta, professor, DI)
 */
export async function getVideoaulasComDetalhes() {
  const [videoaulas, disciplinas, ofertas, professores, designers] = await Promise.all([
    getAllVideoaulas(),
    getAllDisciplinas(),
    getAllOfertasDisciplinas(),
    getAllProfessores(),
    getAllDesigners(),
  ]);

  // Criar maps para lookup rápido
  const disciplinasMap = new Map(disciplinas.map((d: any) => [d.id, d]));
  const ofertasMap = new Map(ofertas.map((o: any) => [o.id, o]));
  const professoresMap = new Map(professores.map((p: any) => [p.id, p]));
  const designersMap = new Map(designers.map((d: any) => [d.id, d]));

  return videoaulas.map((v: any) => {
    const oferta = ofertasMap.get(v.ofertaDisciplinaId);
    const disciplina = oferta ? disciplinasMap.get(oferta.disciplinaId) : null;
    const professor = oferta ? professoresMap.get(oferta.professorId) : null;
    const designer = oferta ? designersMap.get(oferta.diId) : null;

    return {
      videoaula: v,
      disciplina,
      oferta,
      professor,
      di: designer,
    };
  });
}

/**
 * Busca disciplinas com seus cursos associados
 */
export async function getDisciplinasComCurso() {
  const [disciplinas, cursosDisciplinas, cursos] = await Promise.all([
    getAllDisciplinas(),
    getCursosDisciplinas(),
    getAllCursos(),
  ]);

  const cursosMap = new Map(cursos.map((c: any) => [c.id, c]));

  // Agrupar disciplinas únicas com seus cursos
  const disciplinasMap = new Map();
  
  disciplinas.forEach((disciplina: any) => {
    const cursosAssociados = cursosDisciplinas
      .filter((cd: any) => cd.disciplinaId === disciplina.id)
      .map((cd: any) => cursosMap.get(cd.cursoId))
      .filter(Boolean);
    
    disciplinasMap.set(disciplina.id, {
      disciplina,
      cursos: cursosAssociados,
    });
  });
  
  return Array.from(disciplinasMap.values());
}

// ============= ESTATÍSTICAS =============

export async function getEstatisticas() {
  const [videoaulas, disciplinas, cursos, professores] = await Promise.all([
    supabase.from('videoaulas').select('*', { count: 'exact', head: true }),
    supabase.from('disciplinas').select('*', { count: 'exact', head: true }),
    supabase.from('cursos').select('*', { count: 'exact', head: true }),
    supabase.from('professores').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalVideoaulas: videoaulas.count || 0,
    totalDisciplinas: disciplinas.count || 0,
    totalCursos: cursos.count || 0,
    totalProfessores: professores.count || 0,
  };
}

export async function getVideoaulasPorCurso() {
  const videoaulasDetalhadas = await getVideoaulasComDetalhes();
  const cursos = await getAllCursos();
  const cursosDisciplinas = await getCursosDisciplinas();

  return cursos.map((curso: any) => {
    const disciplinasIds = cursosDisciplinas
      .filter((cd: any) => cd.cursoId === curso.id)
      .map((cd: any) => cd.disciplinaId);
    
    const videoaulasDoCurso = videoaulasDetalhadas.filter((v: any) => 
      v.disciplina && disciplinasIds.includes(v.disciplina.id)
    );

    return {
      nome: curso.nome,
      total: videoaulasDoCurso.length,
      comLibras: videoaulasDoCurso.filter((v: any) => v.videoaula.linkLibras).length,
      comAudiodescricao: videoaulasDoCurso.filter((v: any) => v.videoaula.linkAudiodescricao).length,
      comCC: videoaulasDoCurso.filter((v: any) => v.videoaula.ccLegenda).length,
    };
  }).filter(s => s.total > 0);
}

export async function getVideoaulasPorAno() {
  const videoaulasDetalhadas = await getVideoaulasComDetalhes();

  const anosCount: Record<number, number> = {};
  videoaulasDetalhadas.forEach((v: any) => {
    if (v.oferta?.ano) {
      anosCount[v.oferta.ano] = (anosCount[v.oferta.ano] || 0) + 1;
    }
  });

  return Object.entries(anosCount)
    .map(([ano, total]) => ({
      ano: parseInt(ano),
      total,
    }))
    .sort((a, b) => a.ano - b.ano);
}

export async function getVideoaulasPorAnoBimestre() {
  const videoaulasDetalhadas = await getVideoaulasComDetalhes();

  const grouped: Record<number, Record<number, number>> = {};
  
  videoaulasDetalhadas.forEach((v: any) => {
    if (v.oferta?.ano && v.oferta?.bimestreOperacional) {
      const ano = v.oferta.ano;
      const bimestre = v.oferta.bimestreOperacional;
      
      if (!grouped[ano]) grouped[ano] = {};
      grouped[ano][bimestre] = (grouped[ano][bimestre] || 0) + 1;
    }
  });

  return Object.entries(grouped).map(([ano, bimestres]: [string, any]) => ({
    ano: parseInt(ano),
    bim1: bimestres[1] || 0,
    bim2: bimestres[2] || 0,
    bim3: bimestres[3] || 0,
    bim4: bimestres[4] || 0,
  })).sort((a, b) => a.ano - b.ano);
}
