import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/store/useStore';

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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 500);
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
    { id: 'home', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg shadow-slate-200/60' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="flex items-center gap-2.5">
            {/* Anchor icon */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl btn-gradient opacity-90" />
              <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="1.8"/>
                  <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 10.5C4 10.5 4 14.5 10 14.5C16 14.5 16 10.5 16 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {/* Wordmark */}
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-heading font-bold text-[1.35rem] tracking-[-0.03em] text-white leading-none">
                Byte<span className="text-gradient">Bay</span>
              </span>
              <span className="text-[9px] text-white/25 font-mono tracking-[0.18em] uppercase leading-none mt-0.5">Digital Market</span>
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
                currentPage === link.id
                  ? 'text-cyber-blue bg-cyber-blue/10'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search bar desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-sm bg-white border border-slate-200 rounded-pill px-4 h-10 gap-2 transition-all duration-300 focus-within:border-cyber-blue/50 focus-within:shadow-[0_0_0_3px_rgba(42,109,244,0.12)] shadow-sm"
        >
          <Icon name="Search" size={16} className="text-slate-400 flex-shrink-0" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Поиск товаров..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-300 outline-none flex-1 min-w-0"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 bg-white border border-slate-200 rounded-pill flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
          >
            <Icon name="Search" size={18} />
          </button>

          {/* Auth button */}
          <button
            onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-pill px-4 h-10 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-cyber-blue/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Icon name="User" size={16} />
            <span>{isLoggedIn ? (userName?.split(' ')[0] || 'Профиль') : 'Войти'}</span>
          </button>

          {/* Mobile profile */}
          <button
            onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="sm:hidden w-10 h-10 bg-white border border-slate-200 rounded-pill flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
          >
            <Icon name="User" size={18} />
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 btn-gradient rounded-pill flex items-center justify-center text-white transition-all duration-200 shadow-md shadow-cyber-blue/25 hover:shadow-lg hover:shadow-cyber-blue/30"
          >
            <Icon name="ShoppingCart" size={18} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white text-cyber-blue text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm ${
                  badgeBounce ? 'animate-badge-bounce' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white border border-slate-200 rounded-pill px-4 h-11 gap-2 shadow-sm"
          >
            <Icon name="Search" size={16} className="text-slate-400 flex-shrink-0" />
            <input
              ref={searchRef}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Поиск товаров..."
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-300 outline-none flex-1"
            />
            <button type="button" onClick={() => setSearchOpen(false)}>
              <Icon name="X" size={16} className="text-slate-400 hover:text-slate-700" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}