import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, TooltipProps } from 'recharts';

// Componente de Tooltip Customizado para Gráfico de Barras
const CustomBarTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-lg p-3 shadow-lg border transition-all"
        style={{ 
          backgroundColor: '#141C2F',
          borderColor: '#00C2FF',
          borderWidth: '2px'
        }}
      >
        <p className="text-white font-semibold mb-1">{payload[0].payload.nome}</p>
        <p className="text-sm" style={{ color: '#00C2FF' }}>
          <span className="font-bold text-lg">{payload[0].value}</span> videoaulas
        </p>
      </div>
    );
  }
  return null;
};

// Componente de Tooltip Customizado para Gráfico de Área
const CustomAreaTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-lg p-3 shadow-lg border transition-all"
        style={{ 
          backgroundColor: '#141C2F',
          borderColor: '#9D00FF',
          borderWidth: '2px'
        }}
      >
        <p className="text-white font-semibold mb-1">Ano {payload[0].payload.ano}</p>
        <p className="text-sm" style={{ color: '#9D00FF' }}>
          <span className="font-bold text-lg">{payload[0].value}</span> videoaulas
        </p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery();
  const { data: porCurso } = trpc.stats.porCurso.useQuery();
  const { data: porAno } = trpc.stats.porAno.useQuery();

  // Array de cores HEX sequencial para o gráfico de barras
  const barColors = [
    '#00C2FF', // 1. Administração (Ciano)
    '#9D00FF', // 2. Ciência de Dados (Roxo)
    '#00FF55', // 3. Eng. Computação (Verde)
    '#FF00C7', // 4. Tec. Informação (Magenta)
    '#FF6A00', // 5. Eng. Produção (Laranja)
    '#FFE600', // 6. Letras (Amarelo)
    '#BFFF00', // 7. Matemática (Verde Limão)
    '#3399FF', // 8. Pedagogia (Azul Celeste)
    '#FF3333'  // 9. Processos Gerenciais (Vermelho)
  ];

  return (
    <Layout>
      <div className="min-h-screen py-8" style={{ backgroundColor: '#0A101F' }}>
        <div className="container">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Visão geral do sistema de videoaulas</p>
          </div>

          {/* Main Metrics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} style={{ backgroundColor: '#141C2F' }}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,194,255,0.5)]" 
                style={{ 
                  backgroundColor: '#141C2F',
                  border: '2px solid #00C2FF'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Videoaulas
                  </CardTitle>
                  <Video className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: '#00C2FF' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: '#00C2FF' }}>{stats?.totalVideoaulas || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(157,0,255,0.5)]" 
                style={{ 
                  backgroundColor: '#141C2F',
                  border: '2px solid #9D00FF'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Disciplinas
                  </CardTitle>
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: '#9D00FF' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: '#9D00FF' }}>{stats?.totalDisciplinas || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,85,0.5)]" 
                style={{ 
                  backgroundColor: '#141C2F',
                  border: '2px solid #00FF55'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Cursos
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: '#00FF55' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: '#00FF55' }}>{stats?.totalCursos || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,0,199,0.5)]" 
                style={{ 
                  backgroundColor: '#141C2F',
                  border: '2px solid #FF00C7'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Professores
                  </CardTitle>
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: '#FF00C7' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: '#FF00C7' }}>{stats?.totalProfessores || 0}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras Horizontais - Distribuição por Curso */}
            <Card style={{ backgroundColor: '#141C2F', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <PieChartIcon className="h-5 w-5" style={{ color: '#00C2FF' }} />
                  Distribuição de Videoaulas por Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porCurso && porCurso.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                      data={porCurso.map(c => ({ 
                        nome: c.curso.nome.replace('Bacharelado em ', '').replace('Tecnologia em ', 'Tec. '),
                        total: c.total 
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        type="number"
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="nome"
                        stroke="#E0E0E0"
                        style={{ fontSize: '11px' }}
                        tick={{ fill: '#E0E0E0' }}
                        width={110}
                      />
                      <Tooltip 
                        content={<CustomBarTooltip />}
                        cursor={{ fill: 'rgba(0,194,255,0.1)' }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                      >
                        {porCurso.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={barColors[index]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Área com Gradiente - Evolução Temporal */}
            <Card style={{ backgroundColor: '#141C2F', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <TrendingUp className="h-5 w-5" style={{ color: '#00C2FF' }} />
                  Evolução Temporal de Videoaulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porAno && porAno.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart 
                      data={porAno}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.8}/>
                          <stop offset="50%" stopColor="#9D00FF" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#FF00C7" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="ano"
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <YAxis
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <Tooltip 
                        content={<CustomAreaTooltip />}
                        cursor={{ stroke: '#00C2FF', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#00C2FF"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                        activeDot={{ r: 8, fill: '#00C2FF', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
