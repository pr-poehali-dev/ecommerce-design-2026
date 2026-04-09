import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { PRODUCTS, CATEGORIES, Product } from '@/store/useStore';

interface HomePageProps {
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  onNavigate: (page: string, data?: unknown) => void;
  onSearch: (query: string) => void;
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 10,
  color: ['255,45,155', '0,212,255', '157,78,221', '0,255,148'][Math.floor(Math.random() * 4)],
}));

const BENTO_CATEGORIES = CATEGORIES.slice(1);

const CAT_COLORS = [
  'rgba(255,45,155,',
  'rgba(0,212,255,',
  'rgba(157,78,221,',
  'rgba(0,255,148,',
  'rgba(255,230,0,',
  'rgba(255,100,50,',
  'rgba(100,200,255,',
];

export default function HomePage({ onAddToCart, onProductClick, onNavigate, onSearch }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) { onSearch(searchVal); onNavigate('catalog'); }
  };

  const hits = PRODUCTS.filter(p => p.isHit);
  const newItems = PRODUCTS.filter(p => p.isNew);

  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Cyber grid */}
        <div className="absolute inset-0 cyber-grid opacity-80 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }} />

        {/* Particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              background: `rgba(${p.color},0.8)`,
              boxShadow: `0 0 ${p.size * 3}px rgba(${p.color},0.6)`,
            }}
          />
        ))}

        {/* Floating orbs */}
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '10%' }}>
          <div className="w-80 h-80 rounded-full blur-[120px] animate-orb1"
            style={{ background: 'rgba(255,45,155,0.18)' }} />
        </div>
        <div className="absolute pointer-events-none" style={{ bottom: '20%', right: '8%' }}>
          <div className="w-96 h-96 rounded-full blur-[140px] animate-orb2"
            style={{ background: 'rgba(0,212,255,0.14)' }} />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '40%', right: '25%' }}>
          <div className="w-64 h-64 rounded-full blur-[100px] animate-orb3"
            style={{ background: 'rgba(157,78,221,0.2)' }} />
        </div>

        {/* Parallax floating icons */}
        {['🎨','💻','🤖','🛡️','🎵','📊'].map((icon, i) => (
          <div
            key={icon}
            className="absolute text-3xl opacity-15 pointer-events-none select-none animate-float"
            style={{
              top: `${15 + i * 13}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : `${75 + i * 2}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
              transform: `translateY(${scrollY * (0.05 + i * 0.02)}px)`,
              filter: 'blur(0.5px)',
            }}
          >
            {icon}
          </div>
        ))}

        {/* Hero content */}
        <div
          className="relative z-10 text-center max-w-4xl mx-auto space-y-8"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 animate-pop-in"
            style={{ background: 'rgba(255,45,155,0.1)', border: '1px solid rgba(255,45,155,0.25)', borderRadius: '40px', padding: '6px 16px' }}>
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: 'rgba(255,45,155,0.6)' }} />
              <span className="relative w-2 h-2 rounded-full" style={{ background: '#FF2D9B', boxShadow: '0 0 6px rgba(255,45,155,1)' }} />
            </span>
            <span className="text-xs font-semibold" style={{ color: '#FF6EC7' }}>LIVE · Мгновенная выдача · 500+ товаров</span>
          </div>

          {/* Main title with glitch */}
          <h1
            className="font-heading font-bold leading-none tracking-tight animate-fade-in"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)', animationDelay: '0.1s' }}
          >
            <span className="block text-white animate-glitch">BYTE</span>
            <span className="block text-gradient" style={{ filter: 'drop-shadow(0 0 30px rgba(255,45,155,0.5))' }}>BAY</span>
          </h1>

          {/* Holographic subtitle */}
          <div className="inline-block animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <p className="text-sm font-mono font-bold uppercase tracking-[0.3em]"
              style={{ background: 'linear-gradient(90deg, #FF2D9B, #9D4EDD, #00D4FF, #FF2D9B)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradShift 3s linear infinite' }}>
              ЦИФРОВОЙ МАРКЕТПЛЕЙС 2026
            </p>
          </div>

          <p className="text-white/40 text-lg max-w-md mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Лицензионное ПО, игры, ключи и подписки.<br />
            СБП, МИР, ЮMoney — без комиссии.
          </p>

          {/* Search pill */}
          <form onSubmit={handleSearch} className="animate-pop-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex items-center w-full max-w-xl mx-auto">
              <Icon name="Search" size={18} className="absolute left-5 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Поиск: Adobe, Windows, ChatGPT..."
                className="w-full rounded-pill h-14 pl-12 pr-40 text-base text-white placeholder:text-white/20 outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(255,45,155,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255,45,155,0.08), 0 0 30px rgba(255,45,155,0.1)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button type="submit"
                className="absolute right-2 h-10 px-6 rounded-pill text-white text-sm font-bold btn-gradient ripple-btn">
                Найти
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 animate-pop-in" style={{ animationDelay: '0.45s' }}>
            {[
              { v: '50K+', l: 'покупателей', c: '#FF2D9B' },
              { v: '500+', l: 'товаров',     c: '#9D4EDD' },
              { v: '4.9★', l: 'рейтинг',    c: '#00D4FF' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-mono text-2xl sm:text-3xl font-black" style={{ color: s.c, textShadow: `0 0 20px ${s.c}` }}>{s.v}</div>
                <div className="text-white/30 text-xs mt-0.5 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: 'rgba(255,45,155,0.5)' }}>
          <Icon name="ChevronDown" size={24} />
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest mb-2" style={{ color: '#9D4EDD' }}>[ РАЗДЕЛЫ ]</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">КАТЕГОРИИ</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {BENTO_CATEGORIES.map((cat, i) => {
            const col = CAT_COLORS[i % CAT_COLORS.length];
            return (
              <button
                key={cat.name}
                onClick={() => { onSearch(cat.name); onNavigate('catalog'); }}
                className="stagger-item rounded-2xl p-5 flex flex-col items-start gap-4 text-left group transition-all duration-300 relative overflow-hidden"
                style={{
                  animationDelay: `${i * 0.07}s`,
                  background: '#0A0A0F',
                  border: `1px solid ${col}0.1)`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${col}0.4)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${col}0.2), 0 8px 30px rgba(0,0,0,0.5)`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${col}0.1)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                {/* bg glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 30% 50%, ${col}0.08), transparent 70%)` }} />

                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ background: `${col}0.1)`, border: `1px solid ${col}0.2)` }}>
                  {cat.icon}
                </div>
                <div className="relative">
                  <p className="font-bold text-sm text-white group-hover:text-white transition-colors">{cat.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: `${col}0.6)` }}>
                    {cat.count} товар{cat.count === 1 ? '' : cat.count < 5 ? 'а' : 'ов'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== HITS ===== */}
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest mb-2" style={{ color: '#FF2D9B' }}>[ ТОПЫ ]</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">
              🔥 ХИТЫ
            </h2>
          </div>
          <button onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-pill"
            style={{ color: '#FF2D9B', border: '1px solid rgba(255,45,155,0.2)', background: 'rgba(255,45,155,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px rgba(255,45,155,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : hits.map((p, i) => <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />)
          }
        </div>
      </section>

      {/* ===== NEW ===== */}
      <section className="px-4 sm:px-6 py-8 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest mb-2" style={{ color: '#00D4FF' }}>[ СВЕЖЕЕ ]</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">
              ✨ НОВИНКИ
            </h2>
          </div>
          <button onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-pill"
            style={{ color: '#00D4FF', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px rgba(0,212,255,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : newItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />)
          }
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#050508' }}
        className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF2D9B, #9D4EDD)' }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="2"/>
                <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10.5C4 10.5 4 14.5 10 14.5C16 14.5 16 10.5 16 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-white/70">
              Byte<span className="text-gradient">Bay</span>
            </span>
          </div>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {['Публичная оферта', 'Политика конфиденциальности', 'Поддержка'].map(l => (
              <span key={l} className="cursor-pointer hover:text-white/50 transition-colors">{l}</span>
            ))}
          </div>
          <p className="text-xs font-mono" style={{ color: 'rgba(255,45,155,0.3)' }}>© 2026 ByteBay</p>
        </div>
      </footer>
    </div>
  );
}
