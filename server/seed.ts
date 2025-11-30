/**
 * Script para popular o banco de dados com dados processados
 * Executa: tsx server/seed.ts
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  insertCurso,
  insertDisciplina,
  insertProfessor,
  insertDesignerInstrucional,
  insertOfertaDisciplina,
  insertVideoaula,
  getCursoByNome,
  getDisciplinaByCodigo,
  getProfessorByNome,
  getDesignerInstrucionalByNome,
  getOfertaByDisciplinaAnoEBimestre,
} from './db';

const DADOS_DIR = '/home/ubuntu/dados_processados';

async function seedCursos() {
  console.log('📚 Populando cursos...');
  const cursosData = JSON.parse(readFileSync(join(DADOS_DIR, 'cursos.json'), 'utf-8'));
  
  for (const curso of cursosData) {
    await insertCurso({
      eixo: curso.eixo,
      nome: curso.nome,
    });
  }
  
  console.log(`✅ ${cursosData.length} cursos inseridos`);
}

async function seedDisciplinas() {
  console.log('📖 Populando disciplinas...');
  const disciplinasData = JSON.parse(readFileSync(join(DADOS_DIR, 'disciplinas.json'), 'utf-8'));
  
  for (const disciplina of disciplinasData) {
    const curso = await getCursoByNome(disciplina.curso);
    if (!curso) {
      console.warn(`⚠️  Curso não encontrado: ${disciplina.curso}`);
      continue;
    }
    
    await insertDisciplina({
      codigo: disciplina.codigo,
      nome: disciplina.nome,
      cargaHoraria: disciplina.carga_horaria,
      anoCurso: disciplina.ano_curso,
      bimestrePedagogico: disciplina.bimestre_pedagogico,
      cursoId: curso.id,
    });
  }
  
  console.log(`✅ ${disciplinasData.length} disciplinas inseridas`);
}

async function seedProfessores() {
  console.log('👨‍🏫 Populando professores...');
  const professoresData = JSON.parse(readFileSync(join(DADOS_DIR, 'professores.json'), 'utf-8'));
  
  for (const professor of professoresData) {
    await insertProfessor({
      nome: professor.nome,
    });
  }
  
  console.log(`✅ ${professoresData.length} professores inseridos`);
}

async function seedDesignersInstrucionais() {
  console.log('🎨 Populando designers instrucionais...');
  const disData = JSON.parse(readFileSync(join(DADOS_DIR, 'designers_instrucionais.json'), 'utf-8'));
  
  for (const di of disData) {
    await insertDesignerInstrucional({
      nome: di.nome,
    });
  }
  
  console.log(`✅ ${disData.length} designers instrucionais inseridos`);
}

async function seedVideoaulas() {
  console.log('🎥 Populando videoaulas...');
  const videoaulasData = JSON.parse(readFileSync(join(DADOS_DIR, 'videoaulas.json'), 'utf-8'));
  
  let inseridas = 0;
  let erros = 0;
  
  for (const videoaula of videoaulasData) {
    try {
      // Buscar disciplina
      const disciplina = await getDisciplinaByCodigo(videoaula.codigo_disciplina);
      if (!disciplina) {
        console.warn(`⚠️  Disciplina não encontrada: ${videoaula.codigo_disciplina}`);
        erros++;
        continue;
      }
      
      // Buscar ou criar professor
      let professor = null;
      if (videoaula.professor) {
        professor = await getProfessorByNome(videoaula.professor);
      }
      
      // Buscar ou criar DI
      let di = null;
      if (videoaula.di && videoaula.di !== 'AUTOINSTRUCIONAL') {
        di = await getDesignerInstrucionalByNome(videoaula.di);
      }
      
      // Buscar ou criar oferta
      let oferta = await getOfertaByDisciplinaAnoEBimestre(
        disciplina.id,
        videoaula.ano,
        videoaula.bimestre_operacional
      );
      
      if (!oferta) {
        const result = await insertOfertaDisciplina({
          disciplinaId: disciplina.id,
          ano: videoaula.ano,
          bimestreOperacional: videoaula.bimestre_operacional,
          professorId: professor?.id || null,
          diId: di?.id || null,
          tipo: 'OFERTA',
        });
        
        // Buscar a oferta recém-criada
        oferta = await getOfertaByDisciplinaAnoEBimestre(
          disciplina.id,
          videoaula.ano,
          videoaula.bimestre_operacional
        );
      }
      
      if (!oferta) {
        console.warn(`⚠️  Não foi possível criar oferta para disciplina ${videoaula.codigo_disciplina}`);
        erros++;
        continue;
      }
      
      // Inserir videoaula
      await insertVideoaula({
        ofertaDisciplinaId: oferta.id,
        semana: videoaula.semana,
        numeroAula: videoaula.numero_aula,
        titulo: videoaula.titulo,
        sinopse: videoaula.sinopse || null,
        linkYoutubeOriginal: videoaula.link_youtube_original || null,
        slidesDisponivel: videoaula.slides_disponivel,
        status: videoaula.status || null,
        idTvCultura: videoaula.id_tv_cultura || null,
        duracaoMinutos: videoaula.duracao_minutos || null,
        linkLibras: videoaula.link_libras || null,
        linkAudiodescricao: videoaula.link_audiodescricao || null,
        ccLegenda: videoaula.cc_legenda,
        linkDownload: videoaula.link_download || null,
      });
      
      inseridas++;
      
      if (inseridas % 50 === 0) {
        console.log(`  📊 Progresso: ${inseridas}/${videoaulasData.length} videoaulas inseridas`);
      }
    } catch (error) {
      console.error(`❌ Erro ao inserir videoaula "${videoaula.titulo}":`, error);
      erros++;
    }
  }
  
  console.log(`✅ ${inseridas} videoaulas inseridas com sucesso`);
  if (erros > 0) {
    console.log(`⚠️  ${erros} erros durante a inserção`);
  }
}

async function main() {
  console.log('=' .repeat(60));
  console.log('🚀 SEED DO BANCO DE DADOS - SISTEMA VIDEOAULAS UNIVESP');
  console.log('=' .repeat(60));
  console.log('');
  
  try {
    await seedCursos();
    await seedDisciplinas();
    await seedProfessores();
    await seedDesignersInstrucionais();
    await seedVideoaulas();
    
    console.log('');
    console.log('=' .repeat(60));
    console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
    console.log('=' .repeat(60));
  } catch (error) {
    console.error('');
    console.error('=' .repeat(60));
    console.error('❌ ERRO DURANTE O SEED:');
    console.error(error);
    console.error('=' .repeat(60));
    process.exit(1);
  }
}

main();
