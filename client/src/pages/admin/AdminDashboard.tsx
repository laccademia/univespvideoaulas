import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, Palette, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats } = trpc.stats.overview.useQuery();

  const quickActions = [
    {
      title: "Nova Videoaula",
      description: "Adicionar nova videoaula ao sistema",
      href: "/admin/videoaulas/nova",
      icon: Video,
      color: "text-blue-500"
    },
    {
      title: "Nova Disciplina",
      description: "Cadastrar nova disciplina",
      href: "/admin/disciplinas/nova",
      icon: BookOpen,
      color: "text-green-500"
    },
    {
      title: "Novo Curso",
      description: "Adicionar novo curso",
      href: "/admin/cursos/novo",
      icon: GraduationCap,
      color: "text-purple-500"
    },
    {
      title: "Novo Professor",
      description: "Cadastrar novo professor",
      href: "/admin/professores/novo",
      icon: Users,
      color: "text-orange-500"
    },
  ];

  const statsCards = [
    {
      title: "Total de Videoaulas",
      value: stats?.totalVideoaulas || 0,
      icon: Video,
      description: "Videoaulas cadastradas"
    },
    {
      title: "Disciplinas",
      value: stats?.totalDisciplinas || 0,
      icon: BookOpen,
      description: "Disciplinas ativas"
    },
    {
      title: "Cursos",
      value: stats?.totalCursos || 0,
      icon: GraduationCap,
      description: "Cursos oferecidos"
    },
    {
      title: "Professores",
      value: stats?.totalProfessores || 0,
      icon: Users,
      description: "Professores cadastrados"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie videoaulas, disciplinas, cursos e equipe do sistema.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Gestão de Conteúdo */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Gestão de Conteúdo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/videoaulas">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Gerenciar Videoaulas
                  </CardTitle>
                  <CardDescription>
                    Visualizar, editar e excluir videoaulas existentes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/disciplinas">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Gerenciar Disciplinas
                  </CardTitle>
                  <CardDescription>
                    Visualizar, editar e excluir disciplinas
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/cursos">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Gerenciar Cursos
                  </CardTitle>
                  <CardDescription>
                    Visualizar, editar e excluir cursos
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/professores">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gerenciar Professores
                  </CardTitle>
                  <CardDescription>
                    Visualizar, editar e excluir professores
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/designers">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Gerenciar Designers
                  </CardTitle>
                  <CardDescription>
                    Visualizar, editar e excluir designers instrucionais
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
