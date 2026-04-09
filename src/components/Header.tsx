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
  const [scrolled, setScrolled]       = useState(false);
  const [searchVal, setSearchVal]     = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [badgeBounce, setBadgeBounce]   = useState(false);
  const prevCount   = useRef(cartCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 500);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) { onSearch(searchVal); onNavigate('catalog'); }
  };

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(245,245,247,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

        {/* ── Logo ── */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--ink)' }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="2"/>
              <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 10.5C4 14.5 10 14.5 10 14.5C10 14.5 16 14.5 16 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="hidden sm:block font-bold text-[15px]"
            style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            ByteBay
          </span>
        </button>

        {/* ── Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 ml-1">
          {[{ id: 'home', label: 'Главная' }, { id: 'catalog', label: 'Каталог' }].map(l => (
            <button key={l.id} onClick={() => onNavigate(l.id)}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-150"
              style={{
                color: currentPage === l.id ? 'var(--ink)' : 'var(--ink-3)',
                background: currentPage === l.id ? 'rgba(0,0,0,0.05)' : 'transparent',
              }}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* ── Search ── */}
        <form onSubmit={handleSearch}
          className="search-bar flex items-center px-4 gap-2.5 flex-1 min-w-0 transition-all duration-300"
          style={{ maxWidth: searchFocus ? '520px' : '360px' }}>
          <Icon name="Search" size={15} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Поиск товаров..."
            className="bg-transparent text-sm flex-1 outline-none min-w-0"
            style={{ color: 'var(--ink-2)', caretColor: 'var(--ink)' }}
          />
          {searchVal && (
            <button type="button" onClick={() => setSearchVal('')}
              style={{ color: 'var(--ink-4)', flexShrink: 0 }}>
              <Icon name="X" size={13} />
            </button>
          )}
        </form>

        {/* ── Actions ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Cart */}
          <button onClick={onCartOpen}
            className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150"
            style={{ color: 'var(--ink-3)', border: '1px solid var(--border-med)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-white)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
            <Icon name="ShoppingCart" size={16} />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-black flex items-center justify-center px-1 ${badgeBounce ? 'animate-badge-bounce' : ''}`}
                style={{ background: 'var(--ink)', color: '#fff' }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Avatar / Login */}
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <button onClick={() => setDropdownOpen(o => !o)}
                  className="avatar-btn"
                  style={dropdownOpen ? { background: 'var(--bg-white)', borderColor: 'var(--border-str)', color: 'var(--ink)' } : {}}>
                  {initials || <Icon name="User" size={15} />}
                </button>

                {dropdownOpen && (
                  <div className="dropdown absolute right-0 top-[calc(100%+8px)] w-[220px] animate-scale-in z-50">
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{userName}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>Личный кабинет</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { onNavigate('profile'); setDropdownOpen(false); }} className="dropdown-item w-full text-left">
                        <Icon name="User" size={14} /> Профиль
                      </button>
                      <button onClick={() => { onNavigate('profile'); setDropdownOpen(false); }} className="dropdown-item w-full text-left">
                        <Icon name="Package" size={14} /> Мои покупки
                      </button>
                      <button onClick={() => { onNavigate('sell'); setDropdownOpen(false); }} className="dropdown-item w-full text-left">
                        <Icon name="PlusCircle" size={14} /> Продать товар
                      </button>
                    </div>
                    <div className="py-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <button onClick={() => { onNavigate('profile'); setDropdownOpen(false); }} className="dropdown-item w-full text-left">
                        <Icon name="Settings" size={14} /> Настройки
                      </button>
                      <button className="dropdown-item danger w-full text-left">
                        <Icon name="LogOut" size={14} /> Выйти
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button onClick={onAuthOpen} className="btn-primary h-8 px-4 text-[13px]">
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
