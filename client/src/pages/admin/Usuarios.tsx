import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Shield, User, Loader2, CheckCircle, XCircle } from "lucide-react";


export default function Usuarios() {

  const [promotingId, setPromotingId] = useState<string | null>(null);
  
  const { data: usuarios, isLoading, refetch } = trpc.admin.usuarios.list.useQuery();
  const promoverMutation = trpc.admin.usuarios.promoverParaAdmin.useMutation({
    onSuccess: () => {
      alert('Usuário promovido para admin!');
      refetch();
      setPromotingId(null);
    },
    onError: (error: any) => {
      alert('Erro ao promover usuário: ' + error.message);
      setPromotingId(null);
    },
  });

  const rebaixarMutation = trpc.admin.usuarios.rebaixarParaUser.useMutation({
    onSuccess: () => {
      alert('Usuário rebaixado para viewer!');
      refetch();
      setPromotingId(null);
    },
    onError: (error: any) => {
      alert('Erro ao rebaixar usuário: ' + error.message);
      setPromotingId(null);
    },
  });

  const handlePromover = (userId: string) => {
    setPromotingId(userId);
    promoverMutation.mutate({ userId });
  };

  const handleRebaixar = (userId: string) => {
    setPromotingId(userId);
    rebaixarMutation.mutate({ userId });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#00C2FF' }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-400">
            Promova usuários para administrador ou remova permissões de admin
          </p>
        </div>

        <Card style={{ backgroundColor: '#141C2F', borderColor: 'rgba(0,194,255,0.3)' }}>
          <CardHeader>
            <CardTitle className="text-white">Usuários Cadastrados</CardTitle>
            <CardDescription className="text-gray-400">
              Total de {usuarios?.length || 0} usuários no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios?.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: '#0A101F', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: usuario.role === 'admin' ? 'rgba(0,194,255,0.2)' : 'rgba(255,255,255,0.1)',
                        border: `2px solid ${usuario.role === 'admin' ? '#00C2FF' : 'rgba(255,255,255,0.2)'}`,
                      }}
                    >
                      {usuario.role === 'admin' ? (
                        <Shield className="h-6 w-6" style={{ color: '#00C2FF' }} />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{usuario.name || 'Sem nome'}</p>
                      <p className="text-sm text-gray-400">{usuario.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={usuario.role === 'admin' ? 'default' : 'secondary'}
                      style={{
                        backgroundColor: usuario.role === 'admin' ? 'rgba(0,194,255,0.2)' : 'rgba(255,255,255,0.1)',
                        color: usuario.role === 'admin' ? '#00C2FF' : '#9CA3AF',
                        border: `1px solid ${usuario.role === 'admin' ? '#00C2FF' : 'rgba(255,255,255,0.2)'}`,
                      }}
                    >
                      {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>

                    {usuario.role === 'admin' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRebaixar(usuario.openId)}
                        disabled={promotingId === usuario.openId}
                        style={{ borderColor: '#FF3333', color: '#FF3333' }}
                      >
                        {promotingId === usuario.openId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Remover Admin
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromover(usuario.openId)}
                        disabled={promotingId === usuario.openId}
                        style={{ borderColor: '#00C2FF', color: '#00C2FF' }}
                      >
                        {promotingId === usuario.openId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Promover para Admin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {(!usuarios || usuarios.length === 0) && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Nenhum usuário cadastrado ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
