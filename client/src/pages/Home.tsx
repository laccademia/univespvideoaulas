import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, Eye, Volume2, Subtitles, TrendingUp, Calendar, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery();
  const { data: acessibilidade } = trpc.stats.acessibilidade.useQuery();
  const { data: porBimestre } = trpc.stats.porBimestre.useQuery();
  const { data: porCurso } = trpc.stats.porCurso.useQuery();
  const { data: porAno } = trpc.stats.porAno.useQuery();

  return (
    <Layout>
      <div className="min-h-screen gradient-neon-bg py-8">
        <div className="container">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold neon-text-cyan mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do sistema de videoaulas</p>
          </div>

          {/* Main Metrics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Videoaulas
                  </CardTitle>
                  <Video className="h-5 w-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-cyan">{stats?.totalVideoaulas || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Disciplinas
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-[var(--neon-purple)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-purple">{stats?.totalDisciplinas || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-green hover:neon-glow-green transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cursos
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 text-[var(--neon-green)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-green">{stats?.totalCursos || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Professores
                  </CardTitle>
                  <Users className="h-5 w-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-cyan">{stats?.totalProfessores || 0}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts and Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Pizza - Distribuição por Curso */}
            <Card className="bg-card/50 backdrop-blur-sm neon-border-purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChartIcon className="h-5 w-5 text-[var(--neon-purple)]" />
                  Distribuição por Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porCurso && porCurso.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={porCurso.map(c => ({ name: c.curso.nome, value: c.total }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {porCurso.map((entry, index) => {
                          const colors = [
                            'var(--neon-cyan)',
                            'var(--neon-purple)',
                            'var(--neon-green)',
                            'var(--neon-pink)',
                            'var(--neon-blue)',
                            '#00D9FF',
                            '#B026FF',
                            '#00FF94',
                            '#FF2E97',
                          ];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid var(--neon-cyan)',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Linhas - Evolução Temporal */}
            <Card className="bg-card/50 backdrop-blur-sm neon-border-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-[var(--neon-green)]" />
                  Evolução Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porAno && porAno.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={porAno}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="ano"
                        stroke="var(--neon-green)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="var(--neon-green)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid var(--neon-green)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--neon-green)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--neon-green)', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Videoaulas por Bimestre */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-[var(--neon-cyan)]" />
                  Videoaulas por Bimestre
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porBimestre && porBimestre.length > 0 ? (
                  <div className="flex items-end justify-between gap-2 h-48">
                    {porBimestre.map((item) => {
                      const maxTotal = Math.max(...porBimestre.map((b) => b.total));
                      const heightPercent = (item.total / maxTotal) * 100;
                      return (
                        <div key={item.bimestre} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-xs font-bold neon-text-cyan">{item.total}</div>
                          <div
                            className="w-full bg-gradient-to-t from-[var(--neon-cyan)] to-[var(--neon-blue)] rounded-t-md transition-all duration-500 hover:opacity-80"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <div className="text-xs text-muted-foreground font-medium">
                            {item.bimestre === 0 ? 'N/A' : `Bim ${item.bimestre}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Accessibility Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Libras
                </CardTitle>
                <Eye className="h-5 w-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold neon-text-cyan mb-1">
                  {acessibilidade?.comLibras || 0}
                </div>
                <p className="text-xs text-muted-foreground">videoaulas</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Audiodescrição
                </CardTitle>
                <Volume2 className="h-5 w-5 text-[var(--neon-purple)] group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold neon-text-purple mb-1">
                  {acessibilidade?.comAudiodescricao || 0}
                </div>
                <p className="text-xs text-muted-foreground">videoaulas</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm neon-border-green hover:neon-glow-green transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Legendas (CC)
                </CardTitle>
                <Subtitles className="h-5 w-5 text-[var(--neon-green)] group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold neon-text-green mb-1">
                  {acessibilidade?.comCC || 0}
                </div>
                <p className="text-xs text-muted-foreground">videoaulas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
