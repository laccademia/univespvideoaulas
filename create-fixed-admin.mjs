/**
 * Script para criar usuário admin fixo
 * Email: admin@univesp.br
 * Senha: 123456
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpbjgpdiboolqmlbhves.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODE0NjMsImV4cCI6MjA4MDE1NzQ2M30.RlwNmYFqTVAP6U5dtx0rBaeGdG-JEX3UwxuDuG3QUP8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log('🔐 Criando usuário admin fixo...\n');
  
  const email = 'admin@univesp.br';
  const password = '123456';
  const name = 'Administrador';

  try {
    // 1. Criar conta no Supabase Auth
    console.log('📝 Criando usuário no Supabase Auth...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      // Se o erro for "Database error", ignorar e fazer login
      if (error.message.includes('Database error') || error.message.includes('already registered')) {
        console.warn('⚠️  Erro ao criar (esperado):', error.message);
        console.log('🔄 Fazendo login para obter User ID...\n');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('❌ Erro ao fazer login:', signInError.message);
          return;
        }
        
        console.log('✅ Login bem-sucedido!');
        console.log('🆔 User ID:', signInData.user.id);
        console.log('📧 Email:', signInData.user.email);
        
        console.log('\n📋 Agora execute este SQL no Manus para salvar o usuário:\n');
        console.log(`INSERT INTO users (openId, email, name, role, loginMethod) VALUES ('${signInData.user.id}', '${email}', '${name}', 'admin', 'email');\n`);
        
        return;
      }
      
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!data.user) {
      console.error('❌ Nenhum usuário retornado');
      return;
    }

    console.log('✅ Usuário criado no Supabase Auth!');
    console.log('🆔 User ID:', data.user.id);
    console.log('📧 Email:', data.user.email);
    
    console.log('\n📋 Agora execute este SQL no Manus para salvar o usuário:\n');
    console.log(`INSERT INTO users (openId, email, name, role, loginMethod) VALUES ('${data.user.id}', '${email}', '${name}', 'admin', 'email');\n`);

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

createAdmin();
