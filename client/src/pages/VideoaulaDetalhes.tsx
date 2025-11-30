import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Video, Loader2, Eye, Volume2, Subtitles, FileText, Clock, User, Palette, ArrowLeft } from "lucide-react";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function VideoaulaDetalhes() {
  const [, params] = useRoute("/videoaulas/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: videoaula, isLoading } = trpc.videoaulas.getById.useQuery({ id });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!videoaula) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="text-center py-20">
            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Videoaula não encontrada</h3>
            <Link href="/videoaulas">
              <Button variant="outline">Voltar para videoaulas</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { videoaula: v, disciplina, curso, professor, di } = videoaula;

  return (
    <Layout>
      <div className="container py-12">
        <Link href="/videoaulas">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{v.titulo}</h1>
              <p className="text-muted-foreground">
                {disciplina?.nome} • {curso?.nome}
              </p>
            </div>

            {/* Player de Vídeo */}
            {v.linkYoutubeOriginal && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={v.linkYoutubeOriginal.replace('watch?v=', 'embed/')}
                      title={v.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sinopse */}
            {v.sinopse && (
              <Card>
                <CardHeader>
                  <CardTitle>Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{v.sinopse}</p>
                </CardContent>
              </Card>
            )}

            {/* Versões Acessíveis */}
            {(v.linkLibras || v.linkAudiodescricao) && (
              <Card>
                <CardHeader>
                  <CardTitle>Versões Acessíveis</CardTitle>
                  <CardDescription>Acesse as versões com recursos de acessibilidade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {v.linkLibras && (
                    <a href={v.linkLibras} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Eye className="h-4 w-4" />
                        Versão com Libras
                      </Button>
                    </a>
                  )}
                  {v.linkAudiodescricao && (
                    <a href={v.linkAudiodescricao} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Volume2 className="h-4 w-4" />
                        Versão com Audiodescrição
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Lateral - Informações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Semana</div>
                  <div className="text-muted-foreground">Semana {v.semana} • Aula {v.numeroAula}</div>
                </div>

                {professor && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Professor
                    </div>
                    <div className="text-muted-foreground">{professor.nome}</div>
                  </div>
                )}

                {di && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Designer Instrucional
                    </div>
                    <div className="text-muted-foreground">{di.nome}</div>
                  </div>
                )}

                {v.duracaoMinutos && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duração
                    </div>
                    <div className="text-muted-foreground">{v.duracaoMinutos} minutos</div>
                  </div>
                )}

                {v.status && (
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge variant="secondary">{v.status}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {v.ccLegenda && (
                  <div className="flex items-center gap-2 text-sm">
                    <Subtitles className="h-4 w-4 text-primary" />
                    <span>Legendas (CC)</span>
                  </div>
                )}
                {v.slidesDisponivel && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Slides disponíveis</span>
                  </div>
                )}
                {!v.ccLegenda && !v.slidesDisponivel && (
                  <p className="text-sm text-muted-foreground">Nenhum recurso adicional disponível</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
