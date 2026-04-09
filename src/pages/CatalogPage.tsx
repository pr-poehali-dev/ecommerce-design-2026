import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { PRODUCTS, CATEGORIES, Product, formatPrice } from '@/store/useStore';

interface CatalogPageProps {
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  initialSearch?: string;
  extraProducts?: Product[];
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Дешевле' },
  { value: 'price_desc', label: 'Дороже' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'new', label: 'Новинки' },
];

const MAX_PRICE = 6000;

export default function CatalogPage({ onAddToCart, onProductClick, initialSearch = '', extraProducts = [] }: CatalogPageProps) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(0);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const allProducts = [...PRODUCTS, ...extraProducts];

  const filtered = allProducts
    .filter(p => {
      const matchCat = category === 'Все' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isHit ? 1 : 0) - (a.isHit ? 1 : 0);
    });

  const handlePriceMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 100);
    setPriceRange([val, priceRange[1]]);
  };
  const handlePriceMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 100);
    setPriceRange([priceRange[0], val]);
  };

  const pct = (v: number) => (v / MAX_PRICE) * 100;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--ink-4)' }}>Категории</h3>
        <div className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150"
              style={category === cat.name ? {
                background: 'var(--ink)',
                color: '#fff',
              } : {
                color: 'var(--ink-3)',
                background: 'transparent',
              }}
              onMouseEnter={e => { if (category !== cat.name) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={e => { if (category !== cat.name) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              <span className={`text-xs font-mono ${category === cat.name ? 'text-white/70' : 'text-white/20'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--ink-4)' }}>Цена ₽</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl px-3 h-9 flex items-center gap-1"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-soft)' }}>
              <span className="text-xs" style={{ color: 'var(--ink-4)' }}>от</span>
              <input type="number" value={priceRange[0]} onChange={handlePriceMin}
                className="flex-1 bg-transparent text-sm outline-none min-w-0" style={{ color: 'var(--ink)' }} />
            </div>
            <div className="flex-1 rounded-xl px-3 h-9 flex items-center gap-1"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-soft)' }}>
              <span className="text-xs" style={{ color: 'var(--ink-4)' }}>до</span>
              <input type="number" value={priceRange[1]} onChange={handlePriceMax}
                className="flex-1 bg-transparent text-sm outline-none min-w-0" style={{ color: 'var(--ink)' }} />
            </div>
          </div>

          {/* Dual range slider */}
          <div className="relative h-1.5 mx-1">
            <div className="absolute inset-0 rounded-full" style={{ background: 'var(--border-soft)' }} />
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${pct(priceRange[0])}%`,
                right: `${100 - pct(priceRange[1])}%`,
                background: 'var(--ink)',
              }}
            />
            <input
              type="range" min={0} max={MAX_PRICE} value={priceRange[0]} onChange={handlePriceMin}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              style={{ zIndex: priceRange[0] > MAX_PRICE * 0.8 ? 5 : 3 }}
            />
            <input
              type="range" min={0} max={MAX_PRICE} value={priceRange[1]} onChange={handlePriceMax}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              style={{ zIndex: 4 }}
            />
            {/* Thumbs */}
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -translate-x-1/2 pointer-events-none"
              style={{ left: `${pct(priceRange[0])}%`, background: 'var(--bg-white)', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-sm)' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -translate-x-1/2 pointer-events-none"
              style={{ left: `${pct(priceRange[1])}%`, background: 'var(--bg-white)', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-sm)' }} />
          </div>

          <div className="flex justify-between text-xs" style={{ color: 'var(--ink-4)' }}>
            <span>0 ₽</span>
            <span>{MAX_PRICE.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setCategory('Все'); setPriceRange([0, MAX_PRICE]); setSearch(''); }}
        className="btn-ghost w-full h-9 text-sm"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 max-w-7xl mx-auto" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl sm:text-4xl" style={{ color: 'var(--ink)', letterSpacing: '-0.04em' }}>Каталог</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ink-4)' }}>{filtered.length} товар{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}</p>
      </div>

      {/* Search row */}
      <div className="flex gap-3 mb-6">
        <div className="search-bar flex-1 flex items-center px-4 gap-2">
          <Icon name="Search" size={15} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--ink-2)', caretColor: 'var(--ink)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'var(--ink-4)', flexShrink: 0 }}>
              <Icon name="X" size={13} />
            </button>
          )}
        </div>
        <button onClick={() => setFiltersOpen(true)}
          className="md:hidden btn-ghost h-12 px-4 gap-2 text-sm">
          <Icon name="SlidersHorizontal" size={15} />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Sort tabs */}
      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-light">
        {SORT_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => setSort(opt.value)}
            className={`cat-chip flex-shrink-0 ${sort === opt.value ? 'active' : ''}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-[260px] flex-shrink-0">
          <div className="rounded-2xl p-5 sticky top-20" style={{ background: 'var(--bg-white)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
            <FilterPanel />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 animate-float">🔍</div>
              <p className="text-lg font-semibold" style={{ color: 'var(--ink-3)' }}>Ничего не найдено</p>
              <p className="text-sm mt-2" style={{ color: 'var(--ink-4)' }}>Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={onProductClick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}
            onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto scrollbar-light"
            style={{ background: 'var(--bg-white)', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border-soft)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>Фильтры</h3>
              <button onClick={() => setFiltersOpen(false)} style={{ color: 'var(--ink-4)' }}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setFiltersOpen(false)}
              className="w-full btn-primary h-11 mt-6">
              Показать {filtered.length} товар{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}