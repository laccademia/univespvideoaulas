import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, GraduationCap, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CursoDetalhes() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const cursoId = params.id ? parseInt(params.id) : 0;

  const { data: curso, isLoading: loadingCurso } = trpc.cursos.getById.useQuery({ id: cursoId });
  const { data: disciplinas, isLoading: loadingDisciplinas } = trpc.cursos.getDisciplinas.useQuery({ cursoId });
  const { data: stats } = trpc.stats.overview.useQuery();

  if (loadingCurso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Curso não encontrado</p>
              <div className="flex justify-center mt-4">
                <Button onClick={() => setLocation("/cursos")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Cursos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalVideoaulas = 0; // TODO: calcular total de videoaulas

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Início
          </Link>
          <span>→</span>
          <Link href="/cursos" className="hover:text-foreground transition-colors">
            Cursos
          </Link>
          <span>→</span>
          <span className="text-foreground font-medium">{curso.nome}</span>
        </nav>

        {/* Header do Curso */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <CardTitle className="text-3xl">{curso.nome}</CardTitle>
                </div>
                <CardDescription className="text-lg mt-2">
                  <Badge variant="secondary" className="text-sm">
                    {curso.eixo}
                  </Badge>
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setLocation("/cursos")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{disciplinas?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Disciplinas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
                <Video className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalVideoaulas}</p>
                  <p className="text-sm text-muted-foreground">Videoaulas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg">
                <Clock className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {disciplinas?.reduce((acc, d) => acc + (d.cargaHoraria || 0), 0) || 0}h
                  </p>
                  <p className="text-sm text-muted-foreground">Carga Horária Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Disciplinas */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Disciplinas do Curso
          </h2>

          {loadingDisciplinas ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : disciplinas && disciplinas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disciplinas.map((disciplina) => (
                <Card
                  key={disciplina.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                  onClick={() => setLocation(`/videoaulas?disciplina=${disciplina.codigo}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                      <Badge variant="outline" className="text-xs">
                        {disciplina.codigo}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
                      {disciplina.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{disciplina.cargaHoraria}h</span>
                      </div>


                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhuma disciplina encontrada para este curso</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
