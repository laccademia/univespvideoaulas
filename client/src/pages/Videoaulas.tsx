import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Video, Loader2, Search, Eye, Volume2, Subtitles, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export default function Videoaulas() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: videoaulas, isLoading } = trpc.videoaulas.list.useQuery({
    limit: 500,
  });

  const filteredVideoaulas = useMemo(() => {
    if (!searchTerm || !videoaulas?.items) return videoaulas?.items || [];
    
    const search = searchTerm.toLowerCase();
    return videoaulas.items.filter(item => 
      item.videoaula.titulo.toLowerCase().includes(search) ||
      item.videoaula.sinopse?.toLowerCase().includes(search) ||
      item.disciplina?.nome.toLowerCase().includes(search) ||
      item.curso?.nome.toLowerCase().includes(search) ||
      item.professor?.nome.toLowerCase().includes(search)
    );
  }, [videoaulas?.items, searchTerm]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Videoaulas</h1>
          <p className="text-muted-foreground mb-6">
            Explore nosso catálogo completo de videoaulas com recursos de acessibilidade.
          </p>

          {/* Busca */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, disciplina, curso ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Exibindo {filteredVideoaulas.length} de {videoaulas?.total || 0} videoaulas
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVideoaulas.map((item) => (
                <Link key={item.videoaula.id} href={`/videoaulas/${item.videoaula.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base line-clamp-2 mb-1">
                            {item.videoaula.titulo}
                          </CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {item.disciplina?.nome} • {item.curso?.nome}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.videoaula.sinopse && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.videoaula.sinopse}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.videoaula.linkLibras && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Eye className="h-3 w-3" />
                            Libras
                          </Badge>
                        )}
                        {item.videoaula.linkAudiodescricao && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Volume2 className="h-3 w-3" />
                            Audiodescrição
                          </Badge>
                        )}
                        {item.videoaula.ccLegenda && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Subtitles className="h-3 w-3" />
                            CC
                          </Badge>
                        )}
                        {item.videoaula.slidesDisponivel && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <FileText className="h-3 w-3" />
                            Slides
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Semana {item.videoaula.semana} • Aula {item.videoaula.numeroAula}</span>
                        {item.professor && (
                          <span className="truncate ml-2">{item.professor.nome}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredVideoaulas.length === 0 && (
              <div className="text-center py-20">
                <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma videoaula encontrada</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os termos de busca.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
