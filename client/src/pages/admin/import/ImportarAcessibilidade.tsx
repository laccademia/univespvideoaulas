import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Upload, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

type PreviewRow = {
  idTvCultura: string;
  linkLibras?: string;
  linkAudiodescricao?: string;
  ccLegenda?: boolean;
};

type ImportResult = {
  idTvCultura: string;
  status: 'success' | 'error';
  message: string;
};

export default function ImportarAcessibilidade() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = trpc.admin.import.linksAcessibilidade.useMutation();
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
          linkLibras: row.linkLibras || row['Link Libras'] || undefined,
          linkAudiodescricao: row.linkAudiodescricao || row['Link Audiodescrição'] || undefined,
          ccLegenda: row.ccLegenda === 'true' || row.ccLegenda === '1' || row['CC Legenda'] === 'true' || row['CC Legenda'] === '1' ? true : undefined,
        }));
        setPreviewData(parsed.filter(row => row.idTvCultura));
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
      await salvarHistoricoMutation.mutateAsync({
        tipo: 'acessibilidade',
        nomeArquivo: file?.name || 'arquivo.csv',
        totalLinhas: previewData.length,
        sucessos: successCount,
        erros: errorCount,
      });
      
      if (errorCount === 0) {
        toast.success(`${successCount} videoaulas atualizadas com sucesso!`);
      } else {
        toast.warning(`${successCount} atualizadas, ${errorCount} com erro`);
      }
    } catch (error) {
      toast.error('Erro ao importar dados');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `idTvCultura,linkLibras,linkAudiodescricao,ccLegenda
VA001,https://exemplo.com/libras1.mp4,https://exemplo.com/audio1.mp4,true
VA002,https://exemplo.com/libras2.mp4,https://exemplo.com/audio2.mp4,false`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_acessibilidade.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen gradient-neon-bg py-8">
      <div className="container max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin')}
            className="neon-border-cyan"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold neon-text-cyan">Importar Links de Acessibilidade</h1>
            <p className="text-muted-foreground">Atualização em lote de links de Libras, Audiodescrição e CC</p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-6 neon-border-cyan bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[var(--neon-cyan)]" />
              Upload de Arquivo CSV
            </CardTitle>
            <CardDescription>
              Selecione um arquivo CSV com as colunas: idTvCultura, linkLibras, linkAudiodescricao, ccLegenda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="neon-border-cyan"
              >
                <Download className="h-4 w-4 mr-2" />
                Template CSV
              </Button>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-[var(--neon-cyan)]">({previewData.length} linhas)</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        {previewData.length > 0 && importResults.length === 0 && (
          <Card className="mb-6 neon-border-purple bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--neon-purple)]" />
                  Preview dos Dados ({previewData.length} linhas)
                </span>
                <Button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="neon-border-cyan"
                >
                  {isProcessing ? 'Importando...' : 'Confirmar Importação'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 text-[var(--neon-cyan)]">ID TV Cultura</th>
                      <th className="text-left p-2 text-[var(--neon-purple)]">Link Libras</th>
                      <th className="text-left p-2 text-[var(--neon-green)]">Link Audiodescrição</th>
                      <th className="text-left p-2 text-[var(--neon-pink)]">CC Legenda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="p-2 font-mono text-xs">{row.idTvCultura}</td>
                        <td className="p-2 text-xs truncate max-w-xs">{row.linkLibras || '-'}</td>
                        <td className="p-2 text-xs truncate max-w-xs">{row.linkAudiodescricao || '-'}</td>
                        <td className="p-2 text-xs">{row.ccLegenda ? 'Sim' : 'Não'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Mostrando 10 de {previewData.length} linhas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {importResults.length > 0 && (
          <Card className="neon-border-green bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--neon-green)]" />
                Resultado da Importação
              </CardTitle>
              <CardDescription>
                {importResults.filter(r => r.status === 'success').length} sucessos, {importResults.filter(r => r.status === 'error').length} erros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {importResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded border ${
                      result.status === 'success'
                        ? 'border-[var(--neon-green)]/30 bg-[var(--neon-green)]/5'
                        : 'border-[var(--neon-pink)]/30 bg-[var(--neon-pink)]/5'
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-[var(--neon-green)]" />
                    ) : (
                      <XCircle className="h-4 w-4 text-[var(--neon-pink)]" />
                    )}
                    <span className="font-mono text-xs">{result.idTvCultura}</span>
                    <span className="text-xs text-muted-foreground">{result.message}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setImportResults([]);
                  }}
                  className="neon-border-cyan"
                >
                  Nova Importação
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/admin')}
                  className="neon-border-purple"
                >
                  Voltar ao Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
