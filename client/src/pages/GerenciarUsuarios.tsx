import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowUp, ArrowDown, Users as UsersIcon, Mail, Calendar, Shield, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

export default function GerenciarUsuarios() {
  const { user: currentUser } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: allUsers, isLoading: loadingAll } = trpc.users.list.useQuery();
  
  const promoteMutation = trpc.users.promote.useMutation({
    onSuccess: () => {
      alert("✅ Usuário promovido para Admin!");
      utils.users.list.invalidate();
    },
    onError: (error) => {
      alert(`❌ Erro ao promover: ${error.message}`);
    },
  });

  const demoteMutation = trpc.users.demote.useMutation({
    onSuccess: () => {
      alert("⬇️ Usuário rebaixado para Viewer.");
      utils.users.list.invalidate();
    },
    onError: (error) => {
      alert(`❌ Erro ao rebaixar: ${error.message}`);
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string, userId: number) => {
    // Verifica se é o primeiro usuário (owner)
    const isOwner = userId === 1;
    
    if (isOwner) {
      return (
        <Badge variant="outline" style={{ borderColor: '#FFD700', color: '#FFD700' }}>
          <Crown className="h-3 w-3 mr-1" />
          Owner
        </Badge>
      );
    }
    
    return role === 'admin' ? (
      <Badge variant="outline" style={{ borderColor: '#9D00FF', color: '#9D00FF' }}>
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline" style={{ borderColor: '#00C2FF', color: '#00C2FF' }}>
        Viewer
      </Badge>
    );
  };

  const isOwner = (userId: number) => {
    // Owner é sempre o primeiro usuário (ID = 1)
    return userId === 1;
  };

  return (
    <Layout>
      <div className="min-h-screen py-8" style={{ backgroundColor: '#0A101F' }}>
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
            <p className="text-gray-400">Promover ou rebaixar usuários no sistema</p>
          </div>

          {/* Hierarquia de Permissões */}
          <Card className="mb-8 neon-card-cyan rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">📊 Hierarquia de Permissões</CardTitle>
              <CardDescription className="text-gray-400">
                3 níveis de acesso no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    borderColor: '#FFD700'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5" style={{ color: '#FFD700' }} />
                    <h3 className="font-semibold text-white">Owner</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Acesso total ao sistema e banco de dados. Não pode ser modificado.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: 'rgba(157, 0, 255, 0.05)',
                    borderColor: '#9D00FF'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5" style={{ color: '#9D00FF' }} />
                    <h3 className="font-semibold text-white">Admin</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Acesso ao painel administrativo. Pode gerenciar conteúdo e promover usuários.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: 'rgba(0, 194, 255, 0.05)',
                    borderColor: '#00C2FF'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <UsersIcon className="h-5 w-5" style={{ color: '#00C2FF' }} />
                    <h3 className="font-semibold text-white">Viewer</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Apenas visualização. Acesso às páginas públicas do sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Todos os Usuários */}
          <Card className="neon-card-magenta rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UsersIcon className="h-5 w-5" style={{ color: '#00C2FF' }} />
                Todos os Usuários
                {allUsers && (
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: '#00C2FF', 
                      color: '#00C2FF',
                      marginLeft: '8px'
                    }}
                  >
                    {allUsers.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Lista completa de usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAll ? (
                <div className="text-center text-gray-400 py-8">Carregando...</div>
              ) : allUsers && allUsers.length > 0 ? (
                <div className="rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <TableHead className="text-gray-400">Nome</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Permissão</TableHead>
                        <TableHead className="text-gray-400">Cadastro</TableHead>
                        <TableHead className="text-gray-400">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <TableCell className="text-white font-medium">
                            {user.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {user.email || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(user.role, user.id)}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell>
                            {isOwner(user.id) ? (
                              <span className="text-xs text-gray-500">Protegido</span>
                            ) : (
                              <div className="flex gap-2">
                                {user.role === 'viewer' && (
                                  <Button
                                    onClick={() => promoteMutation.mutate({
                                      userId: user.id,
                                      targetOpenId: user.openId
                                    })}
                                    disabled={promoteMutation.isPending}
                                    variant="outline"
                                    size="sm"
                                    style={{ 
                                      borderColor: '#9D00FF',
                                      color: '#9D00FF'
                                    }}
                                  >
                                    <ArrowUp className="h-4 w-4 mr-1" />
                                    Promover
                                  </Button>
                                )}
                                {user.role === 'admin' && (
                                  <Button
                                    onClick={() => demoteMutation.mutate({
                                      userId: user.id,
                                      targetOpenId: user.openId
                                    })}
                                    disabled={demoteMutation.isPending}
                                    variant="outline"
                                    size="sm"
                                    style={{ 
                                      borderColor: '#00C2FF',
                                      color: '#00C2FF'
                                    }}
                                  >
                                    <ArrowDown className="h-4 w-4 mr-1" />
                                    Rebaixar
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Nenhum usuário encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
