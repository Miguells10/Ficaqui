import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import api from './lib/api';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { token, setUser, logout } = useStore();

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data.role !== 'GOV_ADMIN') {
            alert('Acesso negado. Apenas GOV_ADMIN permitidos no Command Center B2G.');
            logout();
          } else {
            setUser(res.data);
          }
        })
        .catch(() => logout());
    }
  }, [token, setUser, logout]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-teal-600/30">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <Auth />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
