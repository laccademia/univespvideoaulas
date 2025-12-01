import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Video, BarChart3, Users, GraduationCap, BookOpen, Home, PieChart, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Cursos", href: "/cursos", icon: GraduationCap },
    { name: "Disciplinas", href: "/disciplinas", icon: BookOpen },
    { name: "Videoaulas", href: "/videoaulas", icon: Video },
    { name: "Professores", href: "/professores", icon: Users },
    { name: "Designers", href: "/designers-instrucionais", icon: Users },
    { name: "Estatísticas", href: "/estatisticas", icon: BarChart3 },
    { name: "Visualizações", href: "/visualizacoes", icon: PieChart },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background transition-theme">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-theme">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Video className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">Videoaulas</span>
                <span className="text-xs text-muted-foreground">Univesp</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "outline"}
                  size="sm"
                  className="gap-2 ml-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 transition-theme">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 transition-theme">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">Sistema de Videoaulas</h3>
              <p className="text-sm text-muted-foreground">
                Plataforma de gestão e visualização de videoaulas da Univesp.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/videoaulas">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Todas as Videoaulas
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/cursos">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Cursos
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/estatisticas">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Estatísticas
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Sobre</h3>
              <p className="text-sm text-muted-foreground">
                Sistema desenvolvido para facilitar o acesso e gestão das videoaulas produzidas pela Univesp.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Univesp. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
