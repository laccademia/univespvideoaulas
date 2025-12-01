import { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LogIn, Video, UserPlus } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Login realizado com sucesso!');
          setTimeout(() => setLocation('/'), 1000);
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Cadastro realizado! Verifique seu email para confirmar.');
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0A101F' }}
    >
      <Card 
        className="w-full max-w-md neon-card-cyan rounded-xl"
        style={{ backgroundColor: '#141C2F' }}
      >
        <CardHeader className="text-center space-y-6 pt-8">
          {/* Logo Univesp */}
          <div className="flex justify-center">
            <img 
              src="/univesp-logo.png" 
              alt="Univesp Logo" 
              className="h-24 w-auto"
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Video className="h-8 w-8" style={{ color: '#00C2FF' }} />
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Sistema de Videoaulas Univesp
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Nome
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Seu nome completo"
                  className="w-full"
                  style={{
                    background: '#0A101F',
                    border: '1px solid #00C2FF',
                    color: '#E0E0E0',
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full"
                style={{
                  background: '#0A101F',
                  border: '1px solid #00C2FF',
                  color: '#E0E0E0',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full"
                style={{
                  background: '#0A101F',
                  border: '1px solid #00C2FF',
                  color: '#E0E0E0',
                }}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              )}
            </div>

            {message && (
              <div 
                className="p-3 rounded text-sm text-center"
                style={{
                  background: message.includes('sucesso') || message.includes('Cadastro') 
                    ? 'rgba(0, 255, 85, 0.1)' 
                    : 'rgba(255, 51, 51, 0.1)',
                  border: `1px solid ${message.includes('sucesso') || message.includes('Cadastro') ? '#00FF55' : '#FF3333'}`,
                  color: message.includes('sucesso') || message.includes('Cadastro') ? '#00FF55' : '#FF3333',
                }}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-semibold"
              style={{
                backgroundColor: '#00C2FF',
                color: '#0A101F',
                border: '2px solid #00C2FF',
                boxShadow: '0 0 20px rgba(0, 194, 255, 0.4)',
              }}
            >
              {loading ? (
                'Processando...'
              ) : isLogin ? (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Cadastrar
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
              className="text-sm hover:underline"
              style={{ color: '#00C2FF' }}
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Novos usuários terão acesso de visualização.</p>
            <p>Administradores podem promover usuários.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
