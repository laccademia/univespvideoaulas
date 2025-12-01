import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function NovaVideoaula() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    disciplinaId: "",
    ano: new Date().getFullYear().toString(),
    bimestreOperacional: "1",
    professorId: "",
    diId: "",
    semana: "1",
    numeroAula: "1",
    titulo: "",
    sinopse: "",
    linkYoutubeOriginal: "",
    slidesDisponivel: false,
    status: "",
    idTvCultura: "",
    duracaoMinutos: "",
    linkLibras: "",
    linkAudiodescricao: "",
    ccLegenda: false,
    linkDownload: "",
  });

  const { data: disciplinas } = trpc.disciplinas.list.useQuery();
  const { data: professores } = trpc.professores.list.useQuery();
  const { data: designers } = trpc.dis.list.useQuery();

  const createMutation = trpc.admin.videoaulas.create.useMutation({
    onSuccess: () => {
      toast.success("Videoaula criada com sucesso!");
      setLocation("/admin/videoaulas");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.disciplinaId || !formData.titulo) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      disciplinaId: parseInt(formData.disciplinaId),
      ano: parseInt(formData.ano),
      bimestreOperacional: parseInt(formData.bimestreOperacional),
      professorId: formData.professorId ? parseInt(formData.professorId) : undefined,
      diId: formData.diId ? parseInt(formData.diId) : undefined,
      semana: parseInt(formData.semana),
      numeroAula: parseInt(formData.numeroAula),
      titulo: formData.titulo,
      sinopse: formData.sinopse || undefined,
      linkYoutubeOriginal: formData.linkYoutubeOriginal || undefined,
      slidesDisponivel: formData.slidesDisponivel,
      status: formData.status || undefined,
      idTvCultura: formData.idTvCultura || undefined,
      duracaoMinutos: formData.duracaoMinutos ? parseInt(formData.duracaoMinutos) : undefined,
      linkLibras: formData.linkLibras || undefined,
      linkAudiodescricao: formData.linkAudiodescricao || undefined,
      ccLegenda: formData.ccLegenda,
      linkDownload: formData.linkDownload || undefined,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/videoaulas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nova Videoaula</h1>
            <p className="text-muted-foreground">
              Preencha os dados para criar uma nova videoaula
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais da videoaula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="disciplina">Disciplina *</Label>
                  <Select
                    value={formData.disciplinaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, disciplinaId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas?.map((d: any) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.codigo} - {d.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano *</Label>
                  <Select
                    value={formData.ano}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ano: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2023, 2024, 2025, 2026, 2027].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bimestre">Bimestre *</Label>
                  <Select
                    value={formData.bimestreOperacional}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bimestreOperacional: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Bimestre 1</SelectItem>
                      <SelectItem value="2">Bimestre 2</SelectItem>
                      <SelectItem value="3">Bimestre 3</SelectItem>
                      <SelectItem value="4">Bimestre 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semana">Semana *</Label>
                  <Input
                    id="semana"
                    type="number"
                    min="1"
                    value={formData.semana}
                    onChange={(e) =>
                      setFormData({ ...formData, semana: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroAula">Número da Aula *</Label>
                  <Input
                    id="numeroAula"
                    type="number"
                    min="1"
                    value={formData.numeroAula}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroAula: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Digite o título da videoaula"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sinopse">Sinopse</Label>
                <Textarea
                  id="sinopse"
                  value={formData.sinopse}
                  onChange={(e) =>
                    setFormData({ ...formData, sinopse: e.target.value })
                  }
                  placeholder="Descrição breve do conteúdo da videoaula"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipe */}
          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>Professor e designer instrucional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professor">Professor</Label>
                  <Select
                    value={formData.professorId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, professorId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {professores?.map((p: any) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designer">Designer Instrucional</Label>
                  <Select
                    value={formData.diId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, diId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o designer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {designers?.map((d: any) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links e Recursos */}
          <Card>
            <CardHeader>
              <CardTitle>Links e Recursos</CardTitle>
              <CardDescription>URLs e identificadores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idTvCultura">ID TV Cultura</Label>
                  <Input
                    id="idTvCultura"
                    value={formData.idTvCultura}
                    onChange={(e) =>
                      setFormData({ ...formData, idTvCultura: e.target.value })
                    }
                    placeholder="Ex: 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    value={formData.duracaoMinutos}
                    onChange={(e) =>
                      setFormData({ ...formData, duracaoMinutos: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">Link YouTube Original</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={formData.linkYoutubeOriginal}
                  onChange={(e) =>
                    setFormData({ ...formData, linkYoutubeOriginal: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="download">Link Download</Label>
                <Input
                  id="download"
                  type="url"
                  value={formData.linkDownload}
                  onChange={(e) =>
                    setFormData({ ...formData, linkDownload: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Acessibilidade */}
          <Card>
            <CardHeader>
              <CardTitle>Acessibilidade</CardTitle>
              <CardDescription>Recursos de acessibilidade disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="libras">Link Libras</Label>
                <Input
                  id="libras"
                  type="url"
                  value={formData.linkLibras}
                  onChange={(e) =>
                    setFormData({ ...formData, linkLibras: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audiodescricao">Link Audiodescrição</Label>
                <Input
                  id="audiodescricao"
                  type="url"
                  value={formData.linkAudiodescricao}
                  onChange={(e) =>
                    setFormData({ ...formData, linkAudiodescricao: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ccLegenda"
                  checked={formData.ccLegenda}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ccLegenda: checked as boolean })
                  }
                />
                <Label htmlFor="ccLegenda" className="cursor-pointer">
                  Closed Caption (CC) disponível
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slides"
                  checked={formData.slidesDisponivel}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, slidesDisponivel: checked as boolean })
                  }
                />
                <Label htmlFor="slides" className="cursor-pointer">
                  Slides disponíveis
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/videoaulas")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {createMutation.isPending ? "Salvando..." : "Criar Videoaula"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
