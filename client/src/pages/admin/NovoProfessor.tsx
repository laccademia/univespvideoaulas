import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function NovoProfessor() {
  const [, setLocation] = useLocation();
  const [nome, setNome] = useState("");

  const createMutation = trpc.admin.professores.create.useMutation({
    onSuccess: () => {
      toast.success("Professor criado com sucesso!");
      setLocation("/admin/professores");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Preencha o nome do professor");
      return;
    }

    createMutation.mutate({ nome: nome.trim() });
  };

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
            <h1 className="text-3xl font-bold">Novo Professor</h1>
            <p className="text-muted-foreground">Cadastrar novo professor no sistema</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Professor</CardTitle>
              <CardDescription>Preencha os dados do professor</CardDescription>
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
                <Button type="submit" disabled={createMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? "Salvando..." : "Salvar Professor"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
