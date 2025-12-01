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
  LogOut,
  Home,
  Shield
} from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirecionar se não for admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/videoaulas", icon: Video, label: "Videoaulas" },
    { href: "/admin/disciplinas", icon: BookOpen, label: "Disciplinas" },
    { href: "/admin/cursos", icon: GraduationCap, label: "Cursos" },
    { href: "/admin/professores", icon: Users, label: "Professores" },
    { href: "/admin/designers", icon: Palette, label: "Designers" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link href="/admin">
            <div className="flex items-center gap-2 cursor-pointer">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
                           (item.href !== "/admin" && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Home className="h-4 w-4" />
              Voltar ao Site
            </Button>
          </Link>
          
          <div className="pt-2 border-t">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
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
