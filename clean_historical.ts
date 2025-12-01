import { db } from './server/db';
import { videoaulas, ofertasDisciplinas } from './drizzle/schema';
import { sql } from 'drizzle-orm';

async function cleanHistoricalData() {
  console.log('🧹 Limpando videoaulas históricas antigas (2023 e 2024)...');
  
  // Deletar videoaulas de ofertas de 2023 e 2024
  const result = await db.delete(videoaulas).where(
    sql`${videoaulas.ofertaDisciplinaId} IN (
      SELECT id FROM ${ofertasDisciplinas} 
      WHERE ano IN (2023, 2024)
    )`
  );
  
  console.log(`✅ ${result.rowsAffected} videoaulas removidas`);
  
  // Deletar ofertas de 2023 e 2024
  const ofertasResult = await db.delete(ofertasDisciplinas).where(
    sql`ano IN (2023, 2024)`
  );
  
  console.log(`✅ ${ofertasResult.rowsAffected} ofertas removidas`);
  
  console.log('\n✨ Banco limpo! Pronto para reinserir dados corretos.');
  process.exit(0);
}

cleanHistoricalData().catch(console.error);
