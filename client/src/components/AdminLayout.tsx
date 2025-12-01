import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Palette,
  Home,
  Shield,
  History
} from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirecionar se não for admin (exceto em desenvolvimento)
  useEffect(() => {
    if (!isLoading && !import.meta.env.DEV && (!user || user.role !== 'admin')) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Permitir acesso em desenvolvimento
  if (!import.meta.env.DEV && (!user || user.role !== 'admin')) {
    return null;
  }

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", color: "#00C2FF" },
    { href: "/admin/videoaulas", icon: Video, label: "Videoaulas", color: "#00C2FF" },
    { href: "/admin/disciplinas", icon: BookOpen, label: "Disciplinas", color: "#9D00FF" },
    { href: "/admin/cursos", icon: GraduationCap, label: "Cursos", color: "#00FF55" },
    { href: "/admin/professores", icon: Users, label: "Professores", color: "#FF6A00" },
    { href: "/admin/designers", icon: Palette, label: "Designers", color: "#FFE600" },
    { href: "/admin/importacoes/historico", icon: History, label: "Histórico", color: "#BFFF00" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários", color: "#FFE600" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A101F' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{ backgroundColor: '#141C2F', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link href="/admin">
            <div className="flex items-center gap-2 cursor-pointer">
              <Shield className="h-6 w-6" style={{ color: '#00C2FF' }} />
              <div>
                <h2 className="font-bold text-lg text-white">Painel Admin</h2>
                <p className="text-xs text-gray-400">Sistema Videoaulas</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Botão Voltar para Home */}
        <div className="px-4 pt-4 pb-2">
          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              style={{ borderColor: '#00C2FF', color: '#00C2FF' }}
            >
              <Home className="h-4 w-4" />
              Voltar para Home
            </Button>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
                           (item.href !== "/admin" && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'rgba(0, 194, 255, 0.1)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                    color: isActive ? item.color : '#9CA3AF'
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'admin@univesp.br'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
