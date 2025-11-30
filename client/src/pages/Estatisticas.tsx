import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Loader2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['oklch(0.65 0.20 150)', 'oklch(0.60 0.18 280)', 'oklch(0.55 0.22 250)', 'oklch(0.60 0.25 25)', 'oklch(0.75 0.18 85)'];

export default function Estatisticas() {
  const { data: overview, isLoading: loadingOverview } = trpc.stats.overview.useQuery();
  const { data: porBimestre, isLoading: loadingBimestre } = trpc.stats.porBimestre.useQuery();
  const { data: porCurso, isLoading: loadingCurso } = trpc.stats.porCurso.useQuery();
  const { data: acessibilidade, isLoading: loadingAcessibilidade } = trpc.stats.acessibilidade.useQuery();

  const isLoading = loadingOverview || loadingBimestre || loadingCurso || loadingAcessibilidade;

  const acessibilidadeData = acessibilidade ? [
    { name: 'Com Libras', value: acessibilidade.comLibras },
    { name: 'Com Audiodescrição', value: acessibilidade.comAudiodescricao },
    { name: 'Com CC', value: acessibilidade.comCC },
    { name: 'Completas (todos)', value: acessibilidade.completas },
  ] : [];

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Estatísticas</h1>
          <p className="text-muted-foreground">
            Análise detalhada da produção de videoaulas e recursos de acessibilidade.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Videoaulas por Bimestre */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Videoaulas por Bimestre Operacional
                </CardTitle>
                <CardDescription>Distribuição de videoaulas ao longo dos bimestres de 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porBimestre}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bimestre" label={{ value: 'Bimestre', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="oklch(0.55 0.22 250)" name="Total" />
                    <Bar dataKey="comLibras" fill="oklch(0.65 0.20 150)" name="Com Libras" />
                    <Bar dataKey="comAudiodescricao" fill="oklch(0.60 0.18 280)" name="Com Audiodescrição" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Videoaulas por Curso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Videoaulas por Curso
                </CardTitle>
                <CardDescription>Quantidade de videoaulas produzidas por curso</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={porCurso} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="curso.nome" type="category" width={200} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="oklch(0.55 0.22 250)" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recursos de Acessibilidade */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos de Acessibilidade</CardTitle>
                <CardDescription>Distribuição de videoaulas com recursos de acessibilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={acessibilidadeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {acessibilidadeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-col justify-center space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Total de Videoaulas</div>
                      <div className="text-3xl font-bold text-primary">{acessibilidade?.total || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Com Libras</div>
                      <div className="text-2xl font-bold text-chart-1">{acessibilidade?.comLibras || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Com Audiodescrição</div>
                      <div className="text-2xl font-bold text-chart-2">{acessibilidade?.comAudiodescricao || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Com Legendas (CC)</div>
                      <div className="text-2xl font-bold text-chart-3">{acessibilidade?.comCC || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Acessibilidade Completa</div>
                      <div className="text-2xl font-bold text-chart-4">{acessibilidade?.completas || 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
