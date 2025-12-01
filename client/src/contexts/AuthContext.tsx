import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { trpc } from "../lib/trpc";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string | undefined;
  name: string | null;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  supabaseUser: SupabaseUser | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getUserQuery = trpc.auth.supabase.getUser.useQuery(undefined, {
    enabled: false, // Não executar automaticamente
  });

  useEffect(() => {
    // Verificar sessão atual
    const checkAuth = async () => {
      console.log('[AUTH] Verificando autenticação...');
      
      // Primeiro, verificar localStorage (para login com credenciais do banco)
      const storedUser = localStorage.getItem('supabase_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('[AUTH] Usuário encontrado no localStorage:', userData);
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          });
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('[AUTH] Erro ao parsear usuário do localStorage:', error);
        }
      }
      
      // Se não encontrou no localStorage, tentar Supabase Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('[AUTH] Sessão encontrada no Supabase Auth');
        setSupabaseUser(session.user);
        
        // Buscar role real do banco via tRPC
        try {
          const userData = await getUserQuery.refetch();
          if (userData.data) {
            setUser({
              id: userData.data.id,
              email: userData.data.email,
              name: userData.data.name || session.user.email?.split('@')[0] || 'Usuário',
              role: userData.data.role,
            });
          } else {
            // Fallback se não conseguir buscar do banco
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              role: 'user',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Fallback
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            role: 'user',
          });
        }
      } else {
        console.log('[AUTH] Nenhuma sessão encontrada');
      }
      setIsLoading(false);
    };
    
    checkAuth();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        
        // Buscar role real do banco
        try {
          const userData = await getUserQuery.refetch();
          if (userData.data) {
            setUser({
              id: userData.data.id,
              email: userData.data.email,
              name: userData.data.name || session.user.email?.split('@')[0] || 'Usuário',
              role: userData.data.role,
            });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              role: 'user',
            });
          }
        } catch (error) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            role: 'user',
          });
        }
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase_user');
    localStorage.removeItem('supabase_session');
    setUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, supabaseUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
