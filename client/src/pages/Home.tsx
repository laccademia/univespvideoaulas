import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, TrendingUp, Eye, Subtitles, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery();
  const { data: acessibilidade } = trpc.stats.acessibilidade.useQuery();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sistema de Videoaulas Univesp
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Plataforma completa para gestão, visualização e análise das videoaulas produzidas pela Univesp. 
              Explore nosso acervo de conteúdos educacionais de qualidade.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/videoaulas">
                <Button size="lg" className="gap-2">
                  <Video className="h-5 w-5" />
                  Explorar Videoaulas
                </Button>
              </Link>
              <Link href="/estatisticas">
                <Button size="lg" variant="outline" className="gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ver Estatísticas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Visão Geral do Sistema</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Videoaulas
                  </CardTitle>
                  <Video className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats?.totalVideoaulas || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conteúdos disponíveis
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Disciplinas
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{stats?.totalDisciplinas || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Áreas de conhecimento
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cursos
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{stats?.totalCursos || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Graduações oferecidas
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Professores
                  </CardTitle>
                  <Users className="h-5 w-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-4">{stats?.totalProfessores || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Educadores envolvidos
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Acessibilidade Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-center">Recursos de Acessibilidade</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nosso compromisso com a inclusão: videoaulas com recursos de acessibilidade para todos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Libras</CardTitle>
                <CardDescription>Tradução em Língua de Sinais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">
                  {acessibilidade?.comLibras || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                  <Volume2 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Audiodescrição</CardTitle>
                <CardDescription>Narração descritiva</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary mb-1">
                  {acessibilidade?.comAudiodescricao || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                  <Subtitles className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Legendas (CC)</CardTitle>
                <CardDescription>Closed Captions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-1">
                  {acessibilidade?.comCC || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para explorar?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Navegue por nosso extenso catálogo de videoaulas, filtre por curso, disciplina ou professor, 
            e aproveite conteúdos de qualidade com recursos de acessibilidade.
          </p>
          <Link href="/videoaulas">
            <Button size="lg" variant="secondary" className="gap-2">
              <Video className="h-5 w-5" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
