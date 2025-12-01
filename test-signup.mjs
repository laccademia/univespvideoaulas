/**
 * Teste simples de signup no Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODE0NjMsImV4cCI6MjA4MDE1NzQ2M30.RlwNmYFqTVAP6U5dtx0rBaeGdG-JEX3UwxuDuG3QUP8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log('🧪 Testando signup no Supabase...\n');
  
  const email = 'claudia.mori.di@gmail.com';
  const password = 'Univesp@br2025!';
  const name = 'Claudia Mori';

  console.log('📧 Email:', email);
  console.log('🔑 Senha:', password.replace(/./g, '*'));
  console.log('👤 Nome:', name);
  console.log('\n🔄 Criando conta...\n');

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      console.error('❌ Erro:', error.message);
      console.error('📋 Detalhes:', error);
      return;
    }

    if (!data.user) {
      console.error('❌ Nenhum usuário retornado');
      return;
    }

    console.log('✅ Conta criada com sucesso!');
    console.log('🆔 User ID:', data.user.id);
    console.log('📧 Email:', data.user.email);
    console.log('✉️  Email confirmado:', data.user.email_confirmed_at ? 'Sim' : 'Não');
    console.log('📅 Criado em:', data.user.created_at);
    
    if (data.session) {
      console.log('\n🎫 Sessão criada automaticamente!');
      console.log('🔐 Access token:', data.session.access_token.substring(0, 20) + '...');
    } else {
      console.log('\n⚠️  Nenhuma sessão criada (pode precisar confirmar email)');
    }

    console.log('\n✨ Próximo passo: Salvar no banco Manus com este ID:', data.user.id);

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error(error);
  }
}

testSignup();
