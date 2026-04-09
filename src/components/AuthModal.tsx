import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_USER, User } from '@/store/useStore';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onLogin({
      ...MOCK_USER,
      name: mode === 'register' ? name : MOCK_USER.name,
      email: email || MOCK_USER.email,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-3xl p-8 animate-scale-in shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 glass rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <Icon name="X" size={16} />
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center text-2xl mx-auto mb-4">
            ⚡
          </div>
          <h2 className="font-heading text-2xl text-white font-bold tracking-tight">
            {mode === 'login' ? 'С ВОЗВРАЩЕНИЕМ' : 'РЕГИСТРАЦИЯ'}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт бесплатно'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex glass rounded-pill p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
              mode === 'login' ? 'btn-gradient text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
              mode === 'register' ? 'btn-gradient text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <Icon name="User" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Имя и фамилия"
                className="w-full glass rounded-xl h-12 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyber-blue/50 focus:shadow-[0_0_0_2px_rgba(42,109,244,0.2)] transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Icon name="Mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full glass rounded-xl h-12 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyber-blue/50 focus:shadow-[0_0_0_2px_rgba(42,109,244,0.2)] transition-all"
            />
          </div>

          <div className="relative">
            <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              required
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full glass rounded-xl h-12 pl-10 pr-12 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyber-blue/50 focus:shadow-[0_0_0_2px_rgba(42,109,244,0.2)] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <button type="button" className="text-xs text-cyber-blue/70 hover:text-cyber-blue transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {loading ? (
              <Icon name="Loader2" size={18} className="animate-spin" />
            ) : (
              <>
                <Icon name="Zap" size={16} />
                {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </>
            )}
          </button>
        </form>

        {/* Trust */}
        <p className="text-center text-white/20 text-xs mt-6">
          Нажимая «Войти», вы принимаете{' '}
          <span className="text-white/40 underline cursor-pointer">оферту</span> и{' '}
          <span className="text-white/40 underline cursor-pointer">политику конфиденциальности</span>
        </p>
      </div>
    </div>
  );
}
