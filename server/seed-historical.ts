/**
 * Script para popular videoaulas históricas (2023 e 2024)
 * Executa: tsx server/seed-historical.ts
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  insertDisciplina,
  insertProfessor,
  insertOfertaDisciplina,
  insertVideoaula,
  getDisciplinaByCodigo,
  getProfessorByNome,
  getOfertaByDisciplinaAnoEBimestre,
} from './db';

const DATA_FILE = '/home/ubuntu/sistema-videoaulas-univesp/videoaulas_historical_final.json';

async function seedHistoricalVideoaulas() {
  console.log('🎥 Populando videoaulas históricas (2023 e 2024)...');
  
  const videoaulasData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  
  let inseridas = 0;
  let disciplinasNovas = 0;
  let professoresNovos = 0;
  let ofertasNovas = 0;
  let erros = 0;
  
  for (const videoaula of videoaulasData) {
    try {
      // Pular se não tiver título ou código de disciplina
      if (!videoaula.titulo || videoaula.titulo.trim() === '') {
        continue;
      }
      
      if (!videoaula.codigo_disciplina || videoaula.codigo_disciplina.trim() === '' || videoaula.codigo_disciplina === 'null') {
        continue;
      }
      
      // Buscar ou criar disciplina
      let disciplina = await getDisciplinaByCodigo(videoaula.codigo_disciplina);
      if (!disciplina && videoaula.codigo_disciplina) {
        await insertDisciplina({
          codigo: videoaula.codigo_disciplina,
          nome: videoaula.codigo_disciplina, // Usar código como nome temporário
          cargaHoraria: 80, // Valor padrão
        });
        disciplina = await getDisciplinaByCodigo(videoaula.codigo_disciplina);
        disciplinasNovas++;
      }
      
      if (!disciplina) {
        console.warn(`⚠️  Disciplina não encontrada e não foi possível criar: ${videoaula.codigo_disciplina}`);
        erros++;
        continue;
      }
      
      // Buscar ou criar professor
      let professor = null;
      if (videoaula.professor && videoaula.professor.trim() !== '') {
        professor = await getProfessorByNome(videoaula.professor);
        if (!professor) {
          await insertProfessor({
            nome: videoaula.professor,
          });
          professor = await getProfessorByNome(videoaula.professor);
          professoresNovos++;
        }
      }
      
      // Buscar ou criar oferta
      let oferta = await getOfertaByDisciplinaAnoEBimestre(
        disciplina.id,
        videoaula.ano,
        videoaula.bimestre
      );
      
      if (!oferta) {
        await insertOfertaDisciplina({
          disciplinaId: disciplina.id,
          ano: videoaula.ano,
          bimestreOperacional: videoaula.bimestre,
          professorId: professor?.id || null,
          diId: null, // Sem DI para dados históricos
          tipo: 'OFERTA',
        });
        
        oferta = await getOfertaByDisciplinaAnoEBimestre(
          disciplina.id,
          videoaula.ano,
          videoaula.bimestre
        );
        ofertasNovas++;
      }
      
      if (!oferta) {
        console.warn(`⚠️  Não foi possível criar oferta para disciplina ${disciplina.codigo}`);
        erros++;
        continue;
      }
      
      // Inserir videoaula (com valores padrão para campos obrigatórios)
      await insertVideoaula({
        ofertaDisciplinaId: oferta.id,
        semana: videoaula.semana || 0,
        numeroAula: videoaula.numero_aula || 0,
        titulo: videoaula.titulo,
        sinopse: videoaula.sinopse,
        idTvCultura: videoaula.id_tv_cultura,
        linkLibras: videoaula.link_libras || null,
        linkAudiodescricao: videoaula.link_audiodescricao || null,
        ccLegenda: videoaula.cc_legenda || false,
      });
      
      inseridas++;
      
      if (inseridas % 100 === 0) {
        console.log(`  Progresso: ${inseridas} videoaulas inseridas...`);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao processar videoaula: ${error}`);
      erros++;
    }
  }
  
  console.log(`\n✅ Seed histórico concluído!`);
  console.log(`  📊 Videoaulas inseridas: ${inseridas}`);
  console.log(`  📚 Novas disciplinas: ${disciplinasNovas}`);
  console.log(`  👨‍🏫 Novos professores: ${professoresNovos}`);
  console.log(`  📅 Novas ofertas: ${ofertasNovas}`);
  console.log(`  ⚠️  Erros: ${erros}`);
}

// Executar seed
seedHistoricalVideoaulas()
  .then(() => {
    console.log('\n🎉 Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
