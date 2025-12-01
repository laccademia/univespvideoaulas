import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  Video, 
  Loader2, 
  Search, 
  Volume2, 
  Subtitles, 
  FileText,
  Calendar,
  BookOpen,
  Eye,
  Filter,
  X
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Videoaulas() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const disciplinaParam = urlParams.get('disciplina');

  const [searchTerm, setSearchTerm] = useState("");
  const [anoFiltro, setAnoFiltro] = useState<string>("todos");
  const [bimestreFiltro, setBimestreFiltro] = useState<string>("todos");
  const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>("todos");
  const [codigoFiltro, setCodigoFiltro] = useState("");
  const [idTvFiltro, setIdTvFiltro] = useState("");

  const { data: videoaulas, isLoading } = trpc.videoaulas.list.useQuery({
    limit: 10000, // Limite aumentado para comportar todas as videoaulas
  });

  // Aplicar filtro de disciplina da URL
  useEffect(() => {
    if (disciplinaParam && disciplinaParam !== disciplinaFiltro) {
      setDisciplinaFiltro(disciplinaParam);
    }
  }, [disciplinaParam]);

  // Extrair valores únicos para filtros
  const { anos, bimestres, disciplinas } = useMemo(() => {
    if (!videoaulas?.items) return { anos: [], bimestres: [], disciplinas: [] };
    
    const anosSet = new Set<number>();
    const bimestresSet = new Set<number>();
    const disciplinasSet = new Set<string>();

    videoaulas.items.forEach(item => {
      if (item.oferta?.ano) anosSet.add(item.oferta.ano);
      if (item.oferta?.bimestreOperacional) bimestresSet.add(item.oferta.bimestreOperacional);
      if (item.disciplina?.codigo) disciplinasSet.add(item.disciplina.codigo);
    });

    return {
      anos: Array.from(anosSet).sort((a, b) => b - a),
      bimestres: Array.from(bimestresSet).sort((a, b) => a - b),
      disciplinas: Array.from(disciplinasSet).sort()
    };
  }, [videoaulas?.items]);

  // Filtrar videoaulas
  const filteredVideoaulas = useMemo(() => {
    if (!videoaulas?.items) return [];
    
    return videoaulas.items.filter(item => {
      const matchSearch = !searchTerm || 
        item.videoaula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.videoaula.sinopse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.disciplina?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.professor?.nome.toLowerCase().includes(searchTerm.toLowerCase());

      const matchAno = anoFiltro === "todos" || item.oferta?.ano === parseInt(anoFiltro);
      const matchBimestre = bimestreFiltro === "todos" || item.oferta?.bimestreOperacional === parseInt(bimestreFiltro);
      const matchDisciplina = disciplinaFiltro === "todos" || item.disciplina?.codigo === disciplinaFiltro;
      const matchCodigo = !codigoFiltro || item.disciplina?.codigo.toLowerCase().includes(codigoFiltro.toLowerCase());
      const matchIdTv = !idTvFiltro || item.videoaula.idTvCultura?.toString().includes(idTvFiltro);

      return matchSearch && matchAno && matchBimestre && matchDisciplina && matchCodigo && matchIdTv;
    });
  }, [videoaulas?.items, searchTerm, anoFiltro, bimestreFiltro, disciplinaFiltro, codigoFiltro, idTvFiltro]);

  // Agrupar por ano e bimestre
  const groupedByYearAndBimester = useMemo(() => {
    const grouped: Record<number, Record<number, typeof filteredVideoaulas>> = {};
    
    filteredVideoaulas.forEach(item => {
      const ano = item.oferta?.ano || 0;
      const bimestre = item.oferta?.bimestreOperacional || 0;
      
      if (!grouped[ano]) grouped[ano] = {};
      if (!grouped[ano][bimestre]) grouped[ano][bimestre] = [];
      
      grouped[ano][bimestre].push(item);
    });

    // Ordenar videoaulas dentro de cada grupo por semana e número da aula
    Object.keys(grouped).forEach(ano => {
      Object.keys(grouped[parseInt(ano)]).forEach(bimestre => {
        grouped[parseInt(ano)][parseInt(bimestre)].sort((a, b) => {
          const semanaA = a.videoaula.semana || 0;
          const semanaB = b.videoaula.semana || 0;
          if (semanaA !== semanaB) return semanaA - semanaB;
          return (a.videoaula.numeroAula || 0) - (b.videoaula.numeroAula || 0);
        });
      });
    });

    return grouped;
  }, [filteredVideoaulas]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = filteredVideoaulas.length;
    const comLibras = filteredVideoaulas.filter(v => v.videoaula.linkLibras).length;
    const comAudiodescricao = filteredVideoaulas.filter(v => v.videoaula.linkAudiodescricao).length;
    const comCC = filteredVideoaulas.filter(v => v.videoaula.ccLegenda).length;
    
    const porAno: Record<number, number> = {};
    const porBimestre: Record<number, number> = {};
    
    filteredVideoaulas.forEach(item => {
      const ano = item.oferta?.ano || 0;
      const bimestre = item.oferta?.bimestreOperacional || 0;
      porAno[ano] = (porAno[ano] || 0) + 1;
      porBimestre[bimestre] = (porBimestre[bimestre] || 0) + 1;
    });

    return { total, comLibras, comAudiodescricao, comCC, porAno, porBimestre };
  }, [filteredVideoaulas]);

  const hasActiveFilters = anoFiltro !== "todos" || bimestreFiltro !== "todos" || 
    disciplinaFiltro !== "todos" || codigoFiltro || idTvFiltro || searchTerm;

  const clearFilters = () => {
    setAnoFiltro("todos");
    setBimestreFiltro("todos");
    setDisciplinaFiltro("todos");
    setCodigoFiltro("");
    setIdTvFiltro("");
    setSearchTerm("");
  };

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Videoaulas</h1>
          <p className="text-muted-foreground">
            Visualize e pesquise videoaulas organizadas por ano e bimestre operacional.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Videoaulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Com Libras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold text-foreground">{stats.comLibras}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Com Audiodescrição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                <span className="text-3xl font-bold text-foreground">{stats.comAudiodescricao}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Com Legendas (CC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Subtitles className="h-5 w-5 text-purple-500" />
                <span className="text-3xl font-bold text-foreground">{stats.comCC}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros Avançados */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                  <X className="h-4 w-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Busca por texto */}
              <div className="lg:col-span-3">
                <label className="text-sm font-medium mb-2 block">Busca por Título, Sinopse ou Professor</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro por Ano */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ano
                </label>
                <Select value={anoFiltro} onValueChange={setAnoFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Anos</SelectItem>
                    {anos.map(ano => (
                      <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Bimestre */}
              <div>
                <label className="text-sm font-medium mb-2 block">Bimestre Operacional</label>
                <Select value={bimestreFiltro} onValueChange={setBimestreFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Bimestres</SelectItem>
                    {bimestres.map(bim => (
                      <SelectItem key={bim} value={bim.toString()}>Bimestre {bim}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Disciplina */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Disciplina
                </label>
                <Select value={disciplinaFiltro} onValueChange={setDisciplinaFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Disciplinas</SelectItem>
                    {disciplinas.map(disc => (
                      <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Código */}
              <div>
                <label className="text-sm font-medium mb-2 block">Código da Disciplina</label>
                <Input
                  placeholder="Ex: COM100"
                  value={codigoFiltro}
                  onChange={(e) => setCodigoFiltro(e.target.value)}
                />
              </div>

              {/* Filtro por ID TV Univesp */}
              <div>
                <label className="text-sm font-medium mb-2 block">ID TV Univesp</label>
                <Input
                  placeholder="Ex: 12345"
                  value={idTvFiltro}
                  onChange={(e) => setIdTvFiltro(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVideoaulas.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma videoaula encontrada</p>
              <p className="text-sm text-muted-foreground">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedByYearAndBimester)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map(ano => (
                <div key={ano}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Ano {ano}
                  </h2>
                  
                  {Object.keys(groupedByYearAndBimester[parseInt(ano)])
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map(bimestre => {
                      const videoaulasBimestre = groupedByYearAndBimester[parseInt(ano)][parseInt(bimestre)];
                      
                      return (
                        <Card key={`${ano}-${bimestre}`} className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Bimestre Operacional {bimestre}
                              <Badge variant="secondary" className="ml-3">
                                {videoaulasBimestre.length} {videoaulasBimestre.length === 1 ? 'videoaula' : 'videoaulas'}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-16">Sem.</TableHead>
                                    <TableHead className="w-16">Aula</TableHead>
                                    <TableHead className="w-24">Código</TableHead>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Professor</TableHead>
                                    <TableHead className="w-20">ID TV</TableHead>
                                    <TableHead className="w-32 text-center">Acessibilidade</TableHead>
                                    <TableHead className="w-20"></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {videoaulasBimestre.map(item => (
                                    <TableRow key={item.videoaula.id}>
                                      <TableCell className="font-mono text-xs">{item.videoaula.semana || '-'}</TableCell>
                                      <TableCell className="font-mono text-xs">{item.videoaula.numeroAula || '-'}</TableCell>
                                      <TableCell className="font-mono text-xs">{item.disciplina?.codigo || '-'}</TableCell>
                                      <TableCell className="text-sm max-w-[200px] truncate" title={item.disciplina?.nome}>
                                        {item.disciplina?.nome || '-'}
                                      </TableCell>
                                      <TableCell className="font-medium max-w-[300px] truncate" title={item.videoaula.titulo}>
                                        {item.videoaula.titulo}
                                      </TableCell>
                                      <TableCell className="text-sm">{item.professor?.nome || '-'}</TableCell>
                                      <TableCell className="font-mono text-xs">{item.videoaula.idTvCultura || '-'}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                          {item.videoaula.linkLibras && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0" title="Libras disponível">
                                              <Volume2 className="h-3 w-3 text-blue-500" />
                                            </Badge>
                                          )}
                                          {item.videoaula.linkAudiodescricao && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0" title="Audiodescrição disponível">
                                              <Eye className="h-3 w-3 text-green-500" />
                                            </Badge>
                                          )}
                                          {item.videoaula.ccLegenda && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0" title="Legendas (CC) disponíveis">
                                              <Subtitles className="h-3 w-3 text-purple-500" />
                                            </Badge>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Link href={`/videoaulas/${item.videoaula.id}`}>
                                          <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </Link>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
