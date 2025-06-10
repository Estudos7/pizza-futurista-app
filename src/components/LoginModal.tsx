
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
  onRecover?: (recoveryKey: string) => Promise<string | null>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRecover }) => {
  const [password, setPassword] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword('');
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onRecover) {
      const password = await onRecover(recoveryKey);
      if (password) {
        setRecoveredPassword(password);
      } else {
        alert('Chave de recuperação inválida!');
      }
    }
    setRecoveryKey('');
  };

  const resetModal = () => {
    setIsRecoveryMode(false);
    setRecoveredPassword('');
    setPassword('');
    setRecoveryKey('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-sm w-full rounded-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat text-2xl font-bold text-white">Área Administrativa</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-neon-cyan transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isRecoveryMode ? (
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

            <button
              type="button"
              onClick={() => setIsRecoveryMode(true)}
              className="w-full text-neon-cyan text-sm hover:underline transition-colors"
            >
              Esqueci minha senha
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!recoveredPassword ? (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Chave de Recuperação</label>
                  <input
                    type="text"
                    required
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    className="w-full p-3 rounded-lg glass text-white placeholder-white/50 border border-white/20 focus:border-neon-cyan focus:outline-none transition-colors"
                    placeholder="Digite a chave de recuperação"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gradient-secondary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Recuperar Senha
                </button>

                <button
                  type="button"
                  onClick={() => setIsRecoveryMode(false)}
                  className="w-full text-white/70 text-sm hover:text-white transition-colors"
                >
                  Voltar ao login
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="glass p-4 rounded-lg">
                  <p className="text-white font-medium mb-2">Sua senha é:</p>
                  <p className="text-neon-cyan text-lg font-bold">{recoveredPassword}</p>
                </div>

                <button
                  onClick={resetModal}
                  className="w-full gradient-secondary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Fazer Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
