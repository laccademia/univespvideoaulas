import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarDisciplina() {
  const [, params] = useRoute("/admin/disciplinas/:id/editar");
  const [, setLocation] = useLocation();
  const disciplinaId = params?.id ? parseInt(params.id) : 0;

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("80");
  const [cursosSelecionados, setCursosSelecionados] = useState<number[]>([]);

  const { data: disciplina, isLoading } = trpc.admin.disciplinas.getById.useQuery(
    { id: disciplinaId },
    { enabled: disciplinaId > 0 }
  );

  const { data: cursos } = trpc.cursos.list.useQuery();

  const updateMutation = trpc.admin.disciplinas.update.useMutation({
    onSuccess: () => {
      toast.success("Disciplina atualizada com sucesso!");
      setLocation("/admin/disciplinas");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  useEffect(() => {
    if (disciplina) {
      setCodigo(disciplina.codigo);
      setNome(disciplina.nome);
      setCargaHoraria(disciplina.cargaHoraria.toString());
      setCursosSelecionados(disciplina.cursoIds || []);
    }
  }, [disciplina]);

  const handleCursoToggle = (cursoId: number) => {
    setCursosSelecionados(prev =>
      prev.includes(cursoId)
        ? prev.filter(id => id !== cursoId)
        : [...prev, cursoId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim() || !nome.trim()) {
      toast.error("Preencha código e nome da disciplina");
      return;
    }

    if (cursosSelecionados.length === 0) {
      toast.error("Selecione pelo menos um curso");
      return;
    }

    updateMutation.mutate({
      id: disciplinaId,
      codigo: codigo.trim(),
      nome: nome.trim(),
      cargaHoraria: parseInt(cargaHoraria),
      cursoIds: cursosSelecionados,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }

  if (!disciplina) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Disciplina não encontrada</div>
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
            onClick={() => setLocation("/admin/disciplinas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Disciplina</h1>
            <p className="text-muted-foreground">Atualizar dados da disciplina</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Disciplina</CardTitle>
              <CardDescription>Atualize os dados da disciplina</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: COM100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargaHoraria">Carga Horária (h) *</Label>
                  <Input
                    id="cargaHoraria"
                    type="number"
                    value={cargaHoraria}
                    onChange={(e) => setCargaHoraria(e.target.value)}
                    placeholder="Ex: 80"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Disciplina *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Pensamento Computacional"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cursos Associados</CardTitle>
              <CardDescription>Selecione os cursos que utilizam esta disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {cursos?.map((curso: any) => (
                  <div key={curso.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`curso-${curso.id}`}
                      checked={cursosSelecionados.includes(curso.id)}
                      onCheckedChange={() => handleCursoToggle(curso.id)}
                    />
                    <label
                      htmlFor={`curso-${curso.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {curso.nome} <span className="text-muted-foreground">({curso.eixo})</span>
                    </label>
                  </div>
                ))}
              </div>
              {cursosSelecionados.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {cursosSelecionados.length} curso(s) selecionado(s)
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/disciplinas")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
