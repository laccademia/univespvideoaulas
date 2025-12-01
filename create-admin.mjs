/**
 * Script para criar conta de admin no Supabase
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
        data: {
          name,
        },
      },
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message);
      return;
    }

    if (!authData.user) {
      console.error('❌ Usuário não foi criado');
      return;
    }

    console.log('✅ Usuário criado:', authData.user.id);

    // 2. Inserir na tabela users com role admin
    console.log('👤 Criando registro na tabela users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        openId: authData.user.id,
        email: email,
        name: name,
        role: 'admin',
        loginMethod: 'email',
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Erro ao criar registro na tabela users:', userError.message);
      return;
    }

    console.log('✅ Usuário promovido para admin!');
    console.log('\n🎉 Conta criada com sucesso!');
    console.log('📧 Email:', email);
    console.log('👤 Nome:', name);
    console.log('🔑 Role: admin');
    console.log('\n✨ Você já pode fazer login no sistema!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createAdmin();
