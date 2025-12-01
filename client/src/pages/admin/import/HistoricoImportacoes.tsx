import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function HistoricoImportacoes() {
  const [, setLocation] = useLocation();
  const { data: historico, isLoading } = trpc.admin.historico.listar.useQuery();

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      acessibilidade: 'Links de Acessibilidade',
      disciplinas: 'Disciplinas',
      videoaulas: 'Videoaulas',
    };
    return labels[tipo] || tipo;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin')}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">Histórico de Importações</h1>
            <p className="text-slate-400 mt-2">Registro de todas as importações realizadas no sistema</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-400 py-12">
            <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-cyan-400" />
            <p>Carregando histórico...</p>
          </div>
        ) : !historico || historico.length === 0 ? (
          <Card className="neon-border-cyan bg-slate-900/50 backdrop-blur border-cyan-500/30">
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Nenhuma importação realizada ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historico.map((item) => {
              const taxaSucesso = item.totalLinhas > 0 
                ? ((item.sucessos / item.totalLinhas) * 100).toFixed(1)
                : '0';
              const temErros = item.erros > 0;

              return (
                <Card 
                  key={item.id} 
                  className={`neon-border-${temErros ? 'purple' : 'cyan'} bg-slate-900/50 backdrop-blur border-${temErros ? 'purple' : 'cyan'}-500/30`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-cyan-400 flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {getTipoLabel(item.tipo)}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {item.nomeArquivo}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Por: {item.usuarioNome || 'Usuário desconhecido'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-300">
                          {item.totalLinhas}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Total de Linhas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-5 w-5" />
                          {item.sucessos}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Sucessos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                          {item.erros > 0 && <XCircle className="h-5 w-5" />}
                          {item.erros}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Erros</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${temErros ? 'text-yellow-400' : 'text-green-400'}`}>
                          {taxaSucesso}%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Taxa de Sucesso</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
