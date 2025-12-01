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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export default function DisciplinasAdmin() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState<number | null>(null);

  const { data: disciplinas, isLoading, refetch } = trpc.disciplinas.list.useQuery();

  const deleteMutation = trpc.admin.disciplinas.delete.useMutation({
    onSuccess: () => {
      toast.success("Disciplina excluída com sucesso!");
      refetch();
      setDisciplinaParaExcluir(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const disciplinasFiltradas = disciplinas?.filter((d: any) =>
    d.nome.toLowerCase().includes(busca.toLowerCase()) ||
    d.codigo.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Disciplinas</h1>
            <p className="text-muted-foreground">Gerenciar disciplinas do sistema</p>
          </div>
          <Button onClick={() => setLocation("/admin/disciplinas/nova")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Disciplina
          </Button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {disciplinasFiltradas.length} disciplina(s) encontrada(s)
          </div>
        </div>

        {/* Tabela */}
        {isLoading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhuma disciplina encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  disciplinasFiltradas.map((disciplina: any) => (
                    <TableRow key={disciplina.id}>
                      <TableCell className="font-mono">{disciplina.codigo}</TableCell>
                      <TableCell className="font-medium">{disciplina.nome}</TableCell>
                      <TableCell>{disciplina.cargaHoraria}h</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/admin/disciplinas/${disciplina.id}/editar`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDisciplinaParaExcluir(disciplina.id)}
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
        )}

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={disciplinaParaExcluir !== null} onOpenChange={() => setDisciplinaParaExcluir(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => disciplinaParaExcluir && deleteMutation.mutate({ id: disciplinaParaExcluir })}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
