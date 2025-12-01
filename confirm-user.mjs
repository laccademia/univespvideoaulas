/**
 * Script para confirmar usuário no Supabase Auth
 * Isso é necessário porque o Supabase exige confirmação de email por padrão
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNjk0NzMsImV4cCI6MjA0ODY0NTQ3M30.Ub2Uy_3wdJkKmjCGtjQFJYsC8Pz0r7-qPPdxmRPmE3I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function confirmUser() {
  console.log('🔍 Verificando usuários no Supabase Auth...');
  
  const email = 'claudia.mori.di@gmail.com';

  try {
    // Listar usuários (requer permissões de admin, pode não funcionar com anon key)
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Erro ao listar usuários:', error.message);
      console.log('\n⚠️  A chave anônima não tem permissões de admin.');
      console.log('📝 Você precisa confirmar o email manualmente no painel do Supabase:');
      console.log('   1. Acesse: https://supabase.com/dashboard/project/kpbjgpdiboolqmlbhves/auth/users');
      console.log('   2. Encontre o usuário:', email);
      console.log('   3. Clique nos 3 pontos (...) → "Confirm email"');
      return;
    }

    const user = users?.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return;
    }

    console.log('✅ Usuário encontrado:', user.id);
    console.log('📧 Email confirmado:', user.email_confirmed_at ? 'Sim' : 'Não');

    if (!user.email_confirmed_at) {
      console.log('🔄 Tentando confirmar email...');
      
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error('❌ Erro ao confirmar:', confirmError.message);
      } else {
        console.log('✅ Email confirmado com sucesso!');
      }
    } else {
      console.log('✅ Email já estava confirmado!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

confirmUser();
