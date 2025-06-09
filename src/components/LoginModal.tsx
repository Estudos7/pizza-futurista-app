
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-sm w-full rounded-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat text-2xl font-bold text-white">Área Administrativa</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-neon-cyan transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg glass text-white placeholder-white/50 border border-white/20 focus:border-neon-cyan focus:outline-none transition-colors"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-secondary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Senha padrão: <span className="text-neon-cyan">gcipione</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
