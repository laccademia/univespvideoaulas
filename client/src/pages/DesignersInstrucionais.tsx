import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Palette, Loader2 } from "lucide-react";

export default function DesignersInstrucionais() {
  const { data: dis, isLoading } = trpc.dis.list.useQuery();

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Designers Instrucionais</h1>
          <p className="text-muted-foreground">
            Conheça os designers instrucionais que contribuem com as videoaulas da Univesp.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dis?.map((di) => (
              <Card key={di.id} className="neon-card-yellow rounded-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Palette className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-base">{di.nome}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
