import React, { useState } from 'react';
import api from '../lib/api';
import { useStore } from '../store/useStore';
import { Building2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setToken = useStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.role !== 'GOV_ADMIN') {
          setError('Acesso restrito: Apenas Administradores do Governo.');
        } else {
          setToken(data.access_token);
          window.location.href = '/';
        }
      } else {
        await api.post('/auth/register', { name, email, password });
        setIsLogin(true);
        setError('Cadastro realizado. Faça o login no formato B2G.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-teal-600/20 text-teal-500 rounded-2xl flex items-center justify-center mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Ficaqui B2G</h1>
          <p className="text-zinc-500 text-sm mt-1">Urban Intelligence Command Center</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-900/50 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-teal-600 transition-colors"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-zinc-400 text-sm mb-1">E-mail Corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-teal-600 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-teal-600 transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Acessar Command Center' : 'Registrar Credencial')}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          {isLogin ? 'Nova Gestão Municipal?' : 'Já possui credencial?'}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="ml-2 text-teal-500 hover:text-teal-400 underline"
          >
            {isLogin ? 'Solicitar Acesso' : 'Fazer Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
