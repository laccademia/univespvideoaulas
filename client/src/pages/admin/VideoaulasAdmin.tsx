import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Pencil, Trash2, Video } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function VideoaulasAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAno, setFilterAno] = useState<string>("all");
  const [filterBimestre, setFilterBimestre] = useState<string>("all");
  const [filterCurso, setFilterCurso] = useState<string>("all");
  const [filterDisciplina, setFilterDisciplina] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: response, isLoading, refetch } = trpc.videoaulas.list.useQuery({ limit: 10000 });
  const videoaulas = response?.items || [];
  
  const { data: cursos } = trpc.cursos.list.useQuery();
  const { data: disciplinas } = trpc.disciplinas.listComCurso.useQuery();
  const deleteMutation = trpc.admin.videoaulas.delete.useMutation({
    onSuccess: () => {
      toast.success("Videoaula excluída com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  // Disciplinas filtradas por curso (se curso selecionado)
  const disciplinasDoCurso = useMemo(() => {
    if (filterCurso === "all" || !disciplinas) return null;
    return disciplinas
      .filter((item: any) => 
        item.cursos?.some((c: any) => c.id.toString() === filterCurso)
      )
      .map((item: any) => item.disciplina.id);
  }, [filterCurso, disciplinas]);

  const filtered = useMemo(() => {
    if (!videoaulas || videoaulas.length === 0) return [];
    
    return videoaulas.filter((item) => {
      const matchesSearch = 
        item.videoaula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.disciplina?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.videoaula.idTvCultura?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAno = filterAno === "all" || item.oferta?.ano.toString() === filterAno;
      const matchesBimestre = filterBimestre === "all" || item.oferta?.bimestreOperacional.toString() === filterBimestre;
      
      // Filtro por curso: verifica se a disciplina da videoaula está no curso selecionado
      const matchesCurso = filterCurso === "all" || 
        (disciplinasDoCurso && disciplinasDoCurso.includes(item.disciplina?.id));
      
      const matchesDisciplina = filterDisciplina === "all" || item.disciplina?.id.toString() === filterDisciplina;
      
      return matchesSearch && matchesAno && matchesBimestre && matchesCurso && matchesDisciplina;
    });
  }, [videoaulas, searchTerm, filterAno, filterBimestre, filterCurso, filterDisciplina, disciplinasDoCurso]);

  const anos = useMemo(() => {
    if (!videoaulas || videoaulas.length === 0) return [];
    const anosSet = new Set(videoaulas.map((v: any) => v.oferta?.ano).filter(Boolean));
    return Array.from(anosSet).sort((a, b) => (b as number) - (a as number));
  }, [videoaulas]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Videoaulas</h1>
            <p className="text-muted-foreground">
              {filtered.length} de {videoaulas.length} videoaulas
            </p>
          </div>
          <Link href="/admin/videoaulas/nova">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Videoaula
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, código ou ID TV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterAno} onValueChange={setFilterAno}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              {anos.map((ano: any) => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterBimestre} onValueChange={setFilterBimestre}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Bimestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="1">Bimestre 1</SelectItem>
              <SelectItem value="2">Bimestre 2</SelectItem>
              <SelectItem value="3">Bimestre 3</SelectItem>
              <SelectItem value="4">Bimestre 4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCurso} onValueChange={setFilterCurso}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {cursos?.map((curso: any) => (
                <SelectItem key={curso.id} value={curso.id.toString()}>
                  {curso.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDisciplina} onValueChange={setFilterDisciplina}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {disciplinas?.map((item: any) => (
                <SelectItem key={item.disciplina.id} value={item.disciplina.id.toString()}>
                  {item.disciplina.codigo} - {item.disciplina.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filterAno !== "all" || filterBimestre !== "all" || filterCurso !== "all" || filterDisciplina !== "all" || searchTerm) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterAno("all");
                setFilterBimestre("all");
                setFilterCurso("all");
                setFilterDisciplina("all");
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Tabela */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Bim.</TableHead>
                <TableHead>Sem.</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead>ID TV</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma videoaula encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item: any) => (
                  <TableRow key={item.videoaula.id}>
                    <TableCell className="font-mono text-sm">
                      {item.disciplina?.codigo || "-"}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {item.videoaula.titulo}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.disciplina?.nome || "-"}
                    </TableCell>
                    <TableCell>{item.oferta?.ano || "-"}</TableCell>
                    <TableCell>{item.oferta?.bimestreOperacional || "-"}</TableCell>
                    <TableCell>{item.videoaula.semana}</TableCell>
                    <TableCell>{item.videoaula.numeroAula}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.videoaula.idTvCultura || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/videoaulas/${item.videoaula.id}/editar`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(item.videoaula.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta videoaula? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
