import { useState, useEffect } from 'react';
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

const BENTO = CATEGORIES.slice(1);

export default function HomePage({ onAddToCart, onProductClick, onNavigate, onSearch }: HomePageProps) {
  const [loading, setLoading]         = useState(true);
  const [searchVal, setSearchVal]     = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) { onSearch(searchVal); onNavigate('catalog'); }
  };

  const hits     = PRODUCTS.filter(p => p.isHit).slice(0, 4);
  const newItems = PRODUCTS.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <section className="pt-28 pb-14 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4 animate-fade-in"
          style={{ color: 'var(--ink-4)', letterSpacing: '0.12em' }}>
          Цифровые товары · Мгновенная выдача
        </p>

        <h1 className="font-bold leading-none mb-5 animate-pop-in"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 4.8rem)', color: 'var(--ink)', letterSpacing: '-0.04em', animationDelay: '0.05s' }}>
          Все нужные<br />
          <span style={{ color: 'var(--ink-3)' }}>программы — здесь</span>
        </h1>

        <p className="text-base mb-10 max-w-md mx-auto animate-fade-in"
          style={{ color: 'var(--ink-3)', lineHeight: 1.65, animationDelay: '0.1s' }}>
          Лицензионное ПО, ключи активации и подписки.<br />
          Оплата СБП, МИР и ЮMoney.
        </p>

        {/* Hero search */}
        <form onSubmit={handleSearch} className="animate-pop-in" style={{ animationDelay: '0.15s' }}>
          <div
            className="search-bar flex items-center px-5 gap-3 mx-auto"
            style={{
              height: 52, maxWidth: 520,
              boxShadow: searchFocus
                ? '0 0 0 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)'
                : '0 4px 16px rgba(0,0,0,0.07)',
            }}
          >
            <Icon name="Search" size={17} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Adobe, Windows, Kaspersky..."
              className="bg-transparent flex-1 outline-none text-base min-w-0"
              style={{ color: 'var(--ink)', caretColor: 'var(--ink)' }}
            />
            <button type="submit" className="btn-primary h-9 px-5 text-[13px] flex-shrink-0">
              Найти
            </button>
          </div>
        </form>

        {/* Trust */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {['✓ Мгновенная выдача', '✓ Возврат 14 дней', '✓ Лицензии РФ'].map(t => (
            <span key={t} className="badge-trust">{t}</span>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 sm:px-6 mb-14 max-w-7xl mx-auto">
        <div className="flex justify-center gap-10">
          {[
            { v: '50 000+', l: 'покупателей' },
            { v: '500+',    l: 'товаров'     },
            { v: '4.9 ★',  l: 'рейтинг'     },
          ].map((s, i) => (
            <div key={s.l} className="text-center stagger-item" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
              <div className="font-bold text-2xl" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>{s.v}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-4 sm:px-6 mb-14 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--ink)' }}>Категории</h2>
        <div className="flex flex-wrap gap-2">
          {BENTO.map((cat, i) => (
            <button key={cat.name}
              onClick={() => { onSearch(cat.name); onNavigate('catalog'); }}
              className="cat-chip stagger-item"
              style={{ animationDelay: `${i * 0.04}s` }}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[11px]" style={{ color: 'var(--ink-5)' }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Hits ── */}
      <section className="px-4 sm:px-6 mb-14 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Хиты продаж</h2>
          <button onClick={() => onNavigate('catalog')}
            className="text-sm flex items-center gap-0.5 transition-colors"
            style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : hits.map((p, i) => <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />)
          }
        </div>
      </section>

      {/* ── New ── */}
      <section className="px-4 sm:px-6 mb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Новинки</h2>
          <button onClick={() => onNavigate('catalog')}
            className="text-sm flex items-center gap-0.5 transition-colors"
            style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
            Все <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : newItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />)
          }
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-6 py-8 max-w-7xl mx-auto" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--ink)' }}>
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="5" r="2.5" stroke="white" strokeWidth="2"/>
                <path d="M10 7.5V17M10 17L6 13.5M10 17L14 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10.5C4 14.5 10 14.5 10 14.5C10 14.5 16 14.5 16 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>ByteBay</span>
          </div>
          <div className="flex gap-5 text-xs" style={{ color: 'var(--ink-4)' }}>
            {['Оферта', 'Политика', 'Поддержка'].map(l => (
              <span key={l} className="cursor-pointer transition-colors"
                onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.color = 'var(--ink)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.color = 'var(--ink-4)'; }}>
                {l}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--ink-5)' }}>© 2026 ByteBay</p>
        </div>
      </footer>
    </div>
  );
}
