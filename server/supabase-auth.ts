/**
 * Helpers de autenticação usando Supabase Auth
 */

import { supabase } from './supabase';

export interface SupabaseUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

/**
 * Fazer login com email e senha
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Buscar role do usuário na tabela users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, name')
    .eq('openId', data.user.id)
    .single();

  if (userError) {
    // Se usuário não existe na tabela, criar com role 'user'
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        openId: data.user.id,
        email: data.user.email,
        name: data.user.email?.split('@')[0],
        role: 'user',
        loginMethod: 'email',
      })
      .select()
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: 'user' as const,
        name: newUser?.name,
      },
      session: data.session,
    };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      role: userData.role as 'admin' | 'user',
      name: userData.name,
    },
    session: data.session,
  };
}

/**
 * Criar nova conta
 */
export async function signUp(email: string, password: string, name?: string) {
  // Importar getDb aqui para evitar circular dependency
  const { getDb } = await import('./db');
  const { users } = await import('../drizzle/schema');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
      emailRedirectTo: undefined, // Desabilitar redirect de confirmação
    },
  });

  // Se o erro for "Database error saving new user", ignorar e continuar
  // Isso acontece porque o Supabase tem um trigger que tenta salvar na tabela users
  // Mas nós vamos salvar no banco Manus mesmo assim
  if (error) {
    if (error.message.includes('Database error')) {
      console.warn('[SIGNUP] Ignorando erro do Supabase:', error.message);
      console.log('[SIGNUP] Tentando fazer login para obter o user ID...');

      // Fazer login para obter o user ID
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.user) {
        console.error('[SIGNUP] Não foi possível fazer login após cadastro:', signInError?.message);
        throw new Error('Conta criada mas não foi possível fazer login automaticamente');
      }

      console.log('[SIGNUP] Login bem-sucedido! User ID:', signInData.user.id);

      // Substituir data com os dados do login
      (data as any).user = signInData.user;
      (data as any).session = signInData.session;
    } else {
      throw error;
    }
  }

  // Criar registro na tabela users do banco Manus
  if (data.user) {
    try {
      console.log('[SIGNUP] Tentando salvar usuário no banco Manus...');
      console.log('[SIGNUP] User ID:', data.user.id);
      console.log('[SIGNUP] Email:', data.user.email);

      const db = await getDb();
      if (!db) {
        console.error('[SIGNUP] Database não disponível!');
        throw new Error('Database not available');
      }

      console.log('[SIGNUP] Database conectado, inserindo...');

      const userData = {
        openId: data.user.id,
        email: data.user.email || email,
        name: name || email.split('@')[0],
        role: 'viewer' as const,
        loginMethod: 'email' as const,
      };

      console.log('[SIGNUP] Dados a inserir:', JSON.stringify(userData, null, 2));

      await db.insert(users).values(userData);

      console.log('[SIGNUP] Usuário salvo com sucesso no banco Manus!');
    } catch (dbError: any) {
      console.error('[SIGNUP] Erro ao salvar no banco:', dbError);
      console.error('[SIGNUP] Stack:', dbError.stack);
      console.error('[SIGNUP] Message:', dbError.message);
      throw new Error(`Database error: ${dbError.message}`);
    }
  }

  return data;
}

/**
 * Fazer logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obter usuário atual da sessão
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  // Buscar role do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('role, name')
    .eq('openId', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email!,
    role: userData?.role || 'user',
    name: userData?.name,
  };
}

/**
 * Verificar se usuário é admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('openId', userId)
    .single();

  return data?.role === 'admin';
}

/**
 * Promover usuário para admin
 */
export async function promoteToAdmin(email: string) {
  const { error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', email);

  if (error) throw error;
}
