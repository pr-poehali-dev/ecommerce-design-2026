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
        scrolled ? 'glass-dark shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center text-base">
            ⚡
          </div>
          <span className="font-heading text-white font-bold text-lg tracking-tight hidden sm:block">
            DIGITAL<span className="text-gradient">STORE</span>
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
                currentPage === link.id
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search bar desktop */}
        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center flex-1 max-w-sm glass rounded-pill px-4 h-10 gap-2 transition-all duration-300 focus-within:border-cyber-blue/40 focus-within:shadow-[0_0_0_2px_rgba(42,109,244,0.2)]`}
        >
          <Icon name="Search" size={16} className="text-white/40 flex-shrink-0" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Поиск товаров..."
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1 min-w-0"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 glass rounded-pill flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Icon name="Search" size={18} />
          </button>

          {/* Auth button */}
          <button
            onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="hidden sm:flex items-center gap-2 glass rounded-pill px-4 h-10 text-sm font-medium text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
          >
            <Icon name="User" size={16} />
            <span>{isLoggedIn ? (userName?.split(' ')[0] || 'Профиль') : 'Войти'}</span>
          </button>

          {/* Mobile profile */}
          <button
            onClick={isLoggedIn ? () => onNavigate('profile') : onAuthOpen}
            className="sm:hidden w-10 h-10 glass rounded-pill flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Icon name="User" size={18} />
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 btn-gradient rounded-pill flex items-center justify-center text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(42,109,244,0.5)]"
          >
            <Icon name="ShoppingCart" size={18} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white text-cyber-dark text-[10px] font-bold rounded-full flex items-center justify-center px-1 ${
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
            className="flex items-center glass rounded-pill px-4 h-11 gap-2"
          >
            <Icon name="Search" size={16} className="text-white/40 flex-shrink-0" />
            <input
              ref={searchRef}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Поиск товаров..."
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1"
            />
            <button type="button" onClick={() => setSearchOpen(false)}>
              <Icon name="X" size={16} className="text-white/40 hover:text-white" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
