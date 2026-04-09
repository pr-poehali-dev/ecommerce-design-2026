import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { PRODUCTS, CATEGORIES, Product, formatPrice } from '@/store/useStore';

interface HomePageProps {
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  onNavigate: (page: string, data?: unknown) => void;
  onSearch: (query: string) => void;
}

const BENTO_CATEGORIES = CATEGORIES.slice(1);

export default function HomePage({ onAddToCart, onProductClick, onNavigate, onSearch }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal);
      onNavigate('catalog');
    }
  };

  const hits = PRODUCTS.filter(p => p.isHit);
  const newItems = PRODUCTS.filter(p => p.isNew);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic gradient */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 60% 50% at ${mousePos.x}% ${mousePos.y}%, rgba(42,109,244,0.35) 0%, transparent 70%)`,
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-[80px] pointer-events-none"
          style={{ background: '#2A6DF4' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-[100px] pointer-events-none"
          style={{ background: '#8A2BE2' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge-trust px-4 py-1.5 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Мгновенная выдача · Более 500 товаров</span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold leading-none tracking-tight animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            BYTE<span className="text-gradient">BAY</span><br />
            <span className="text-white/50 text-3xl sm:text-4xl font-medium tracking-normal" style={{ fontFamily: 'Golos Text' }}>цифровой маркетплейс</span>
          </h1>

          <p
            className="text-white/45 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Лицензионное ПО, ключи активации и подписки. <br className="hidden sm:block" />
            Оплата картой МИР, СБП и ЮMoney
          </p>

          {/* Search pill */}
          <form
            onSubmit={handleSearch}
            className="animate-fade-in flex"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative flex items-center w-full max-w-xl mx-auto">
              <Icon name="Search" size={20} className="absolute left-5 text-white/30 pointer-events-none" />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Поиск: Adobe, Windows, Kaspersky..."
                className="w-full glass rounded-pill h-14 pl-14 pr-36 text-base text-white placeholder:text-white/25 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.4)] transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 btn-gradient h-10 px-6 rounded-pill text-white text-sm font-semibold"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-8 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '50 000+', label: 'покупателей' },
              { value: '500+', label: 'товаров' },
              { value: '4.9', label: 'рейтинг' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/35 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* Bento categories */}
      <section className="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold tracking-tight mb-8">
          КАТЕГОРИИ
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {BENTO_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => { onSearch(cat.name === 'Все' ? '' : cat.name); onNavigate('catalog'); }}
              className="stagger-item glass rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/8 transition-all duration-200 hover:scale-[1.02] text-left group"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <p className="text-white font-medium text-sm">{cat.name}</p>
                <p className="text-white/30 text-xs">{cat.count} товар{cat.count === 1 ? '' : cat.count < 5 ? 'а' : 'ов'}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Hits */}
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold tracking-tight">
            🔥 ХИТЫ ПРОДАЖ
          </h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-sm text-cyber-blue/70 hover:text-cyber-blue flex items-center gap-1 transition-colors"
          >
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : hits.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />
              ))
          }
        </div>
      </section>

      {/* New items */}
      <section className="px-4 sm:px-6 py-8 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold tracking-tight">
            ✨ НОВИНКИ
          </h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-sm text-cyber-blue/70 hover:text-cyber-blue flex items-center gap-1 transition-colors"
          >
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : newItems.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />
              ))
          }
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="1.8"/>
                <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10.5C4 10.5 4 14.5 10 14.5C16 14.5 16 10.5 16 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-heading text-white/60 font-bold text-sm tracking-tight">
              Byte<span className="text-gradient">Bay</span>
            </span>
          </div>
          <div className="flex gap-4 text-xs text-white/25">
            <span className="hover:text-white/50 cursor-pointer transition-colors">Публичная оферта</span>
            <span className="hover:text-white/50 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/50 cursor-pointer transition-colors">Поддержка</span>
          </div>
          <p className="text-white/20 text-xs">© 2026 ByteBay</p>
        </div>
      </footer>
    </div>
  );
}