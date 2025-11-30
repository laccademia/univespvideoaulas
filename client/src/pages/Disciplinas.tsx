import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Loader2, Clock } from "lucide-react";

export default function Disciplinas() {
  const { data: disciplinas, isLoading } = trpc.disciplinas.listComCurso.useQuery();

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Disciplinas</h1>
          <p className="text-muted-foreground">
            Navegue pelas disciplinas oferecidas nos cursos da Univesp.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplinas?.map((item) => (
              <Card key={item.disciplina.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {item.disciplina.codigo}
                    </span>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{item.disciplina.nome}</CardTitle>
                  <CardDescription className="text-xs">{item.curso?.nome}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.disciplina.cargaHoraria}h</span>
                    </div>
                    <div>
                      Ano {item.disciplina.anoCurso} • Bim. {item.disciplina.bimestrePedagogico}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
