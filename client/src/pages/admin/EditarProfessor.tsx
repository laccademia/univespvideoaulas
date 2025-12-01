import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarProfessor() {
  const [, params] = useRoute("/admin/professores/:id/editar");
  const [, setLocation] = useLocation();
  const professorId = params?.id ? parseInt(params.id) : 0;

  const [nome, setNome] = useState("");

  const { data: professor, isLoading } = trpc.admin.professores.getById.useQuery(
    { id: professorId },
    { enabled: professorId > 0 }
  );

  const updateMutation = trpc.admin.professores.update.useMutation({
    onSuccess: () => {
      toast.success("Professor atualizado com sucesso!");
      setLocation("/admin/professores");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  useEffect(() => {
    if (professor) {
      setNome(professor.nome);
    }
  }, [professor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Preencha o nome do professor");
      return;
    }

    updateMutation.mutate({
      id: professorId,
      nome: nome.trim(),
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }

  if (!professor) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Professor não encontrado</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/professores")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Professor</h1>
            <p className="text-muted-foreground">Atualizar dados do professor</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Professor</CardTitle>
              <CardDescription>Atualize os dados do professor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/professores")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
