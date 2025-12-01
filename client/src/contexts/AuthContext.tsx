import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string | undefined;
  name: string | null;
  role: "viewer" | "admin";
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

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        // Por enquanto, todos os usuários são viewers
        // Você pode adicionar lógica para verificar role no banco depois
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          role: 'viewer', // TODO: buscar role real do banco
        });
      }
      setIsLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          role: 'viewer', // TODO: buscar role real do banco
        });
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
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
