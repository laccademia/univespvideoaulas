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

export default function ProfessoresAdmin() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [professorParaExcluir, setProfessorParaExcluir] = useState<number | null>(null);

  const { data: professores, isLoading, refetch } = trpc.professores.list.useQuery();

  const deleteMutation = trpc.admin.professores.delete.useMutation({
    onSuccess: () => {
      toast.success("Professor excluído com sucesso!");
      refetch();
      setProfessorParaExcluir(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const professoresFiltrados = professores?.filter((p: any) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Professores</h1>
            <p className="text-muted-foreground">Gerenciar professores do sistema</p>
          </div>
          <Button onClick={() => setLocation("/admin/professores/novo")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Professor
          </Button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {professoresFiltrados.length} professor(es) encontrado(s)
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum professor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  professoresFiltrados.map((professor: any) => (
                    <TableRow key={professor.id}>
                      <TableCell className="font-mono">{professor.id}</TableCell>
                      <TableCell className="font-medium">{professor.nome}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/admin/professores/${professor.id}/editar`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProfessorParaExcluir(professor.id)}
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
        <AlertDialog open={professorParaExcluir !== null} onOpenChange={() => setProfessorParaExcluir(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => professorParaExcluir && deleteMutation.mutate({ id: professorParaExcluir })}
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
