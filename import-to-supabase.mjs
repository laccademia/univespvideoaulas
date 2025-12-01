import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODE0NjMsImV4cCI6MjA4MDE1NzQ2M30.RlwNmYFqTVAP6U5dtx0rBaeGdG-JEX3UwxuDuG3QUP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importData() {
  console.log('📦 Lendo arquivo de exportação...');
  const data = JSON.parse(fs.readFileSync('./data-export.json', 'utf-8'));

  console.log('\n📊 Dados encontrados:');
  console.log(`  - Cursos: ${data.cursos?.length || 0}`);
  console.log(`  - Disciplinas: ${data.disciplinas?.length || 0}`);
  console.log(`  - Professores: ${data.professores?.length || 0}`);
  console.log(`  - Designers: ${data.designers?.length || 0}`);
  console.log(`  - Videoaulas: ${data.videoaulas?.length || 0}`);
  console.log(`  - Cursos-Disciplinas: ${data.cursosDisciplinas?.length || 0}`);
  console.log(`  - Ofertas: ${data.ofertasDisciplinas?.length || 0}`);

  try {
    // 1. Importar Cursos
    if (data.cursos && data.cursos.length > 0) {
      console.log('\n🔄 Importando cursos...');
      const { error } = await supabase.from('cursos').insert(data.cursos);
      if (error) {
        console.error('❌ Erro ao importar cursos:', error);
      } else {
        console.log(`✅ ${data.cursos.length} cursos importados`);
      }
    }

    // 2. Importar Disciplinas
    if (data.disciplinas && data.disciplinas.length > 0) {
      console.log('\n🔄 Importando disciplinas...');
      const { error } = await supabase.from('disciplinas').insert(data.disciplinas);
      if (error) {
        console.error('❌ Erro ao importar disciplinas:', error);
      } else {
        console.log(`✅ ${data.disciplinas.length} disciplinas importadas`);
      }
    }

    // 3. Importar Professores
    if (data.professores && data.professores.length > 0) {
      console.log('\n🔄 Importando professores...');
      const { error } = await supabase.from('professores').insert(data.professores);
      if (error) {
        console.error('❌ Erro ao importar professores:', error);
      } else {
        console.log(`✅ ${data.professores.length} professores importados`);
      }
    }

    // 4. Importar Designers
    if (data.designers && data.designers.length > 0) {
      console.log('\n🔄 Importando designers instrucionais...');
      const { error } = await supabase.from('designersInstrucionais').insert(data.designers);
      if (error) {
        console.error('❌ Erro ao importar designers:', error);
      } else {
        console.log(`✅ ${data.designers.length} designers importados`);
      }
    }

    // 5. Importar Cursos-Disciplinas
    if (data.cursosDisciplinas && data.cursosDisciplinas.length > 0) {
      console.log('\n🔄 Importando relacionamentos cursos-disciplinas...');
      const { error } = await supabase.from('cursosDisciplinas').insert(data.cursosDisciplinas);
      if (error) {
        console.error('❌ Erro ao importar cursos-disciplinas:', error);
      } else {
        console.log(`✅ ${data.cursosDisciplinas.length} relacionamentos importados`);
      }
    }

    // 6. Importar Ofertas de Disciplinas
    if (data.ofertasDisciplinas && data.ofertasDisciplinas.length > 0) {
      console.log('\n🔄 Importando ofertas de disciplinas...');
      const { error } = await supabase.from('ofertasDisciplinas').insert(data.ofertasDisciplinas);
      if (error) {
        console.error('❌ Erro ao importar ofertas:', error);
      } else {
        console.log(`✅ ${data.ofertasDisciplinas.length} ofertas importadas`);
      }
    }

    // 7. Importar Videoaulas (em lotes de 100 para evitar timeout)
    if (data.videoaulas && data.videoaulas.length > 0) {
      console.log('\n🔄 Importando videoaulas...');
      const batchSize = 100;
      let imported = 0;
      
      // Extrair apenas o objeto videoaula de cada item
      const videoaulasClean = data.videoaulas.map(item => item.videoaula || item);
      
      for (let i = 0; i < videoaulasClean.length; i += batchSize) {
        const batch = videoaulasClean.slice(i, i + batchSize);
        const { error } = await supabase.from('videoaulas').insert(batch);
        
        if (error) {
          console.error(`❌ Erro no lote ${Math.floor(i / batchSize) + 1}:`, error);
        } else {
          imported += batch.length;
          console.log(`  ✅ ${imported}/${videoaulasClean.length} videoaulas importadas`);
        }
      }
    }

    console.log('\n🎉 Importação concluída com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante importação:', error);
  }
}

importData();
