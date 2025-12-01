import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Upload, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";

type PreviewRow = {
  idTvCultura: string;
  titulo: string;
  codigoDisciplina: string;
  ano: number;
  bimestreOperacional: number;
  semana: number;
  numeroAula: number;
  sinopse?: string;
  linkYoutubeOriginal?: string;
  duracaoMinutos?: number;
};

type ImportResult = {
  idTvCultura: string;
  status: 'success' | 'error';
  message: string;
};

export default function ImportarVideoaulas() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = trpc.admin.import.videoaulas.useMutation();
  const salvarHistoricoMutation = trpc.admin.historico.salvar.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setFile(selectedFile);
    setPreviewData([]);
    setImportResults([]);

    // Parse CSV para preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row: any) => ({
          idTvCultura: row.idTvCultura || row['ID TV Cultura'] || '',
          titulo: row.titulo || row['Título'] || '',
          codigoDisciplina: row.codigoDisciplina || row['Código Disciplina'] || '',
          ano: parseInt(row.ano || row['Ano'] || '0'),
          bimestreOperacional: parseInt(row.bimestreOperacional || row['Bimestre'] || '0'),
          semana: parseInt(row.semana || row['Semana'] || '0'),
          numeroAula: parseInt(row.numeroAula || row['Número Aula'] || '0'),
          sinopse: row.sinopse || row['Sinopse'] || undefined,
          linkYoutubeOriginal: row.linkYoutubeOriginal || row['Link YouTube'] || undefined,
          duracaoMinutos: row.duracaoMinutos ? parseInt(row.duracaoMinutos) : undefined,
        }));
        setPreviewData(parsed.filter(row => row.idTvCultura && row.titulo && row.codigoDisciplina));
      },
      error: (error) => {
        toast.error(`Erro ao ler CSV: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('Nenhum dado para importar');
      return;
    }

    setIsProcessing(true);
    try {
      const results = await importMutation.mutateAsync(previewData);
      setImportResults(results as ImportResult[]);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      // Salvar no histórico
      if (file) {
        await salvarHistoricoMutation.mutateAsync({
          tipo: 'videoaulas',
          nomeArquivo: file.name,
          totalLinhas: results.length,
          sucessos: successCount,
          erros: errorCount,
        });
      }
      
      if (errorCount === 0) {
        toast.success(`${successCount} videoaulas importadas com sucesso!`);
      } else {
        toast.warning(`${successCount} sucessos, ${errorCount} erros`);
      }
    } catch (error) {
      toast.error('Erro ao importar videoaulas');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `idTvCultura,titulo,codigoDisciplina,ano,bimestreOperacional,semana,numeroAula,sinopse,linkYoutubeOriginal,duracaoMinutos
VA001,Introdução à Matemática,MAT001,2025,1,1,1,Conceitos básicos de matemática,https://youtube.com/watch?v=example,45
VA002,Álgebra Linear,MAT002,2025,1,1,2,Vetores e matrizes,https://youtube.com/watch?v=example2,50
VA003,Cálculo I,MAT003,2025,2,2,1,Limites e derivadas,https://youtube.com/watch?v=example3,60`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_videoaulas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-cyan">Importar Videoaulas</h1>
            <p className="text-muted-foreground mt-2">
              Importação em lote de novas videoaulas via CSV
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Upload de Arquivo */}
        <Card className="border-neon-cyan">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Arquivo CSV
            </CardTitle>
            <CardDescription>
              Colunas: idTvCultura, titulo, codigoDisciplina, ano, bimestreOperacional, semana, numeroAula, sinopse, linkYoutubeOriginal, duracaoMinutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Template CSV
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Preview dos Dados */}
        {previewData.length > 0 && importResults.length === 0 && (
          <Card className="border-neon-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Preview dos Dados ({previewData.length} videoaulas)
              </CardTitle>
              <CardDescription>
                Revise os dados antes de importar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">ID TV</th>
                      <th className="text-left p-2">Título</th>
                      <th className="text-left p-2">Disciplina</th>
                      <th className="text-left p-2">Ano</th>
                      <th className="text-left p-2">Bim</th>
                      <th className="text-left p-2">Sem</th>
                      <th className="text-left p-2">Aula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{row.idTvCultura}</td>
                        <td className="p-2">{row.titulo}</td>
                        <td className="p-2">{row.codigoDisciplina}</td>
                        <td className="p-2">{row.ano}</td>
                        <td className="p-2">{row.bimestreOperacional}</td>
                        <td className="p-2">{row.semana}</td>
                        <td className="p-2">{row.numeroAula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    ... e mais {previewData.length - 10} videoaulas
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Importando...' : 'Importar Videoaulas'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados da Importação */}
        {importResults.length > 0 && (
          <Card className="border-neon-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Resultados da Importação
              </CardTitle>
              <CardDescription>
                {importResults.filter(r => r.status === 'success').length} sucessos, {importResults.filter(r => r.status === 'error').length} erros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto space-y-2">
                {importResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded ${
                      result.status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="flex-1 text-sm">
                      <strong>{result.idTvCultura}</strong>: {result.message}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setImportResults([]);
                  }}
                  className="flex-1"
                >
                  Nova Importação
                </Button>
                <Button
                  onClick={() => setLocation('/admin/importacoes/historico')}
                  className="flex-1"
                >
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
