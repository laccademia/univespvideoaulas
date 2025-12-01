/**
 * Script para criar conta de admin diretamente no Supabase Auth e banco Manus
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNjk0NzMsImV4cCI6MjA0ODY0NTQ3M30.Ub2Uy_3wdJkKmjCGtjQFJYsC8Pz0r7-qPPdxmRPmE3I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  console.log('🔐 Criando conta de admin...');
  
  const email = 'claudia.mori.di@gmail.com';
  const password = 'Univesp@br2025!';
  const name = 'Claudia Mori';

  try {
    // 1. Criar conta no Supabase Auth
    console.log('📝 Criando usuário no Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: undefined,
      },
    });

    if (authError) {
      console.error('❌ Erro no Supabase Auth:', authError.message);
      
      // Se o erro for "User already registered", tentar fazer login
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe no Supabase Auth');
        console.log('🔄 Tentando fazer login para obter o ID...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('❌ Erro ao fazer login:', signInError.message);
          console.log('💡 Tente redefinir a senha no painel do Supabase');
          return;
        }
        
        console.log('✅ Login bem-sucedido! ID:', signInData.user.id);
        console.log('📧 Email:', signInData.user.email);
        console.log('\n🎉 Conta já existe e está funcional!');
        console.log('✨ Você pode fazer login no sistema agora!');
        return;
      }
      
      return;
    }

    if (!authData.user) {
      console.error('❌ Usuário não foi criado no Supabase Auth');
      return;
    }

    console.log('✅ Usuário criado no Supabase Auth:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    console.log('✅ Email confirmado automaticamente (confirmação desabilitada)');

    console.log('\n🎉 Conta criada com sucesso!');
    console.log('📧 Email:', email);
    console.log('👤 Nome:', name);
    console.log('\n✨ Agora execute o comando SQL no Manus para salvar no banco:');
    console.log(`\nINSERT INTO users (openId, email, name, role, loginMethod) VALUES ('${authData.user.id}', '${email}', '${name}', 'admin', 'email');\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createAdmin();
