import { drizzle } from 'drizzle-orm/mysql2';
import { 
  cursos, 
  disciplinas, 
  professores, 
  designersInstrucionais, 
  videoaulas,
  cursosDisciplinas,
  ofertasDisciplinas
} from './drizzle/schema.ts';
import fs from 'fs';
import path from 'path';

const db = drizzle(process.env.DATABASE_URL);

async function exportToCSV(tableName, data, columns) {
  const header = columns.join(',');
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      if (value instanceof Date) {
        return `"${value.toISOString()}"`;
      }
      return value;
    }).join(',');
  });
  
  const csv = [header, ...rows].join('\n');
  const filePath = path.join('/home/ubuntu', `${tableName}.csv`);
  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`✅ Exported ${data.length} rows to ${filePath}`);
}

async function main() {
  console.log('🚀 Starting data export...\n');

  try {
    // Export cursos
    console.log('Exporting cursos...');
    const cursosData = await db.select().from(cursos);
    await exportToCSV('cursos', cursosData, ['id', 'nome', 'sigla', 'createdAt', 'updatedAt']);

    // Export disciplinas
    console.log('Exporting disciplinas...');
    const disciplinasData = await db.select().from(disciplinas);
    await exportToCSV('disciplinas', disciplinasData, ['id', 'codigo', 'nome', 'ementa', 'cargaHoraria', 'createdAt', 'updatedAt']);

    // Export professores
    console.log('Exporting professores...');
    const professoresData = await db.select().from(professores);
    await exportToCSV('professores', professoresData, ['id', 'nome', 'email', 'createdAt', 'updatedAt']);

    // Export designers
    console.log('Exporting designers instrucionais...');
    const designersData = await db.select().from(designersInstrucionais);
    await exportToCSV('designers_instrucionais', designersData, ['id', 'nome', 'email', 'createdAt', 'updatedAt']);

    // Export videoaulas
    console.log('Exporting videoaulas...');
    const videoaulasData = await db.select().from(videoaulas);
    await exportToCSV('videoaulas', videoaulasData, [
      'id', 'titulo', 'descricao', 'url', 'duracao', 'ano', 'semestre',
      'disciplinaId', 'professorId', 'designerId', 'acessibilidade',
      'createdAt', 'updatedAt'
    ]);

    // Export cursos_disciplinas
    console.log('Exporting cursos_disciplinas...');
    const cursosDisciplinasData = await db.select().from(cursosDisciplinas);
    await exportToCSV('cursos_disciplinas', cursosDisciplinasData, ['id', 'cursoId', 'disciplinaId', 'createdAt']);

    // Export ofertas_disciplinas
    console.log('Exporting ofertas_disciplinas...');
    const ofertasData = await db.select().from(ofertasDisciplinas);
    await exportToCSV('ofertas_disciplinas', ofertasData, [
      'id', 'disciplinaId', 'ano', 'semestre', 'professorId', 'designerId', 'createdAt'
    ]);

    console.log('\n✅ All data exported successfully!');
    console.log('📁 Files saved to /home/ubuntu/');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  }
}

main();
