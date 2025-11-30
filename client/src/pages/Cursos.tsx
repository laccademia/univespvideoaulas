import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Cursos() {
  const { data: cursos, isLoading } = trpc.cursos.list.useQuery();

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cursos</h1>
          <p className="text-muted-foreground">
            Explore os cursos oferecidos pela Univesp e suas disciplinas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos?.map((curso) => (
              <Link key={curso.id} href={`/cursos/${curso.id}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{curso.nome}</CardTitle>
                        <CardDescription className="text-xs">{curso.eixo}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Ver disciplinas</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && cursos?.length === 0 && (
          <div className="text-center py-20">
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground">
              Não há cursos cadastrados no sistema no momento.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
