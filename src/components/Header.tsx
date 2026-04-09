import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  onAuthOpen: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearch: (query: string) => void;
}

export default function Header({ cartCount, onCartOpen, onAuthOpen, isLoggedIn, userName, onNavigate, currentPage, onSearch }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [badgeBounce, setBadgeBounce] = useState(false);
  const prevCount = useRef(cartCount);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 600);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigate('catalog');
    setSearchOpen(false);
  };

  const navLinks = [
    { id: 'home',    label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'glass-dark border-b border-white/5' : 'bg-transparent'
      }`}
      style={scrolled ? { boxShadow: '0 0 40px rgba(255,45,155,0.07), 0 4px 30px rgba(0,0,0,0.5)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 flex-shrink-0 group">
          {/* Animated logo mark */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #FF2D9B, #9D4EDD)' }}
            />
            <div className="absolute inset-0 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF2D9B 0%, #9D4EDD 100%)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="1.8"/>
                <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10.5C4 10.5 4 14.5 10 14.5C16 14.5 16 10.5 16 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-heading font-bold text-[1.35rem] tracking-[-0.03em] leading-none"
              style={{ color: '#fff' }}>
              Byte<span className="text-gradient">Bay</span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase leading-none mt-0.5"
              style={{ color: 'rgba(255,45,155,0.5)' }}>Digital Market</span>
          </div>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 relative group"
              style={{
                color: currentPage === link.id ? '#FF2D9B' : 'rgba(255,255,255,0.5)',
                background: currentPage === link.id ? 'rgba(255,45,155,0.1)' : 'transparent',
                border: currentPage === link.id ? '1px solid rgba(255,45,155,0.2)' : '1px solid transparent',
              }}
            >
              {link.label}
              {currentPage === link.id && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#FF2D9B', boxShadow: '0 0 6px rgba(255,45,155,0.8)' }} />
              )}
            </button>
          ))}
        </nav>

        {/* Search desktop */}
        <form onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-sm rounded-pill px-4 h-10 gap-2 transition-all duration-300 group"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
          onFocus={e => { (e.currentTarget as HTMLFormElement).style.border = '1px solid rgba(255,45,155,0.3)'; (e.currentTarget as HTMLFormElement).style.boxShadow = '0 0 0 3px rgba(255,45,155,0.1)'; }}
          onBlur={e => { (e.currentTarget as HTMLFormElement).style.border = '1px solid rgba(255,255,255,0.08)'; (e.currentTarget as HTMLFormElement).style.boxShadow = 'none'; }}
        >
          <Icon name="Search" size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Поиск товаров..."
            className="bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none flex-1 min-w-0"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search mobile */}
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 rounded-pill flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            <Icon name="Search" size={18} />
          </button>

          {/* Auth */}
          <button
            onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="hidden sm:flex items-center gap-2 rounded-pill px-4 h-10 text-sm font-medium transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0,212,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#00D4FF'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <Icon name="User" size={15} />
            <span>{isLoggedIn ? (userName?.split(' ')[0] || 'Профиль') : 'Войти'}</span>
          </button>

          {/* Mobile profile */}
          <button onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="sm:hidden w-10 h-10 rounded-pill flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            <Icon name="User" size={18} />
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 rounded-pill flex items-center justify-center text-white transition-all duration-300 ripple-btn"
            style={{ background: 'linear-gradient(135deg, #FF2D9B, #9D4EDD)', boxShadow: '0 0 20px rgba(255,45,155,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,45,155,0.7), 0 0 60px rgba(157,78,221,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(255,45,155,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            <Icon name="ShoppingCart" size={18} />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-black flex items-center justify-center px-1 ${badgeBounce ? 'animate-badge-bounce' : ''}`}
                style={{ background: '#00D4FF', color: '#000', boxShadow: '0 0 8px rgba(0,212,255,0.8)' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <form onSubmit={handleSearch}
            className="flex items-center rounded-pill px-4 h-11 gap-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,45,155,0.25)' }}>
            <Icon name="Search" size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              ref={searchRef}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Поиск товаров..."
              className="bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none flex-1"
            />
            <button type="button" onClick={() => setSearchOpen(false)}>
              <Icon name="X" size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
