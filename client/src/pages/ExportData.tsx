import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function ExportData() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const exportMutation = trpc.export.allData.useQuery(undefined, {
    enabled: false,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportMutation.refetch();
      if (data.data) {
        // Convert to JSON and download
        const json = JSON.stringify(data.data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `univesp-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExported(true);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Exportar Dados do Banco</h1>
        <p className="text-muted-foreground mb-6">
          Clique no botão abaixo para exportar todos os dados do banco atual (videoaulas, disciplinas, cursos, professores, designers) em formato JSON.
        </p>
        
        <Button 
          onClick={handleExport} 
          disabled={exporting || exported}
          size="lg"
          className="w-full"
        >
          {exporting ? 'Exportando...' : exported ? '✅ Dados Exportados!' : 'Exportar Dados'}
        </Button>

        {exported && (
          <p className="text-green-600 mt-4 text-center">
            ✅ Arquivo JSON baixado com sucesso!
          </p>
        )}
      </Card>
    </div>
  );
}
