import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { PRODUCTS, CATEGORIES, Product, formatPrice } from '@/store/useStore';

interface CatalogPageProps {
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  initialSearch?: string;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Дешевле' },
  { value: 'price_desc', label: 'Дороже' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'new', label: 'Новинки' },
];

const MAX_PRICE = 6000;

export default function CatalogPage({ onAddToCart, onProductClick, initialSearch = '' }: CatalogPageProps) {
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

  const filtered = PRODUCTS
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
        <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Категории</h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                category === cat.name
                  ? 'btn-gradient text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
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
        <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Цена</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 glass rounded-xl px-3 h-10 flex items-center gap-1">
              <span className="text-white/25 text-xs">от</span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={handlePriceMin}
                className="flex-1 bg-transparent text-white text-sm outline-none font-mono min-w-0"
              />
            </div>
            <div className="flex-1 glass rounded-xl px-3 h-10 flex items-center gap-1">
              <span className="text-white/25 text-xs">до</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={handlePriceMax}
                className="flex-1 bg-transparent text-white text-sm outline-none font-mono min-w-0"
              />
            </div>
          </div>

          {/* Dual range slider */}
          <div className="relative h-1.5 mx-1">
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${pct(priceRange[0])}%`,
                right: `${100 - pct(priceRange[1])}%`,
                background: 'var(--grad-main)',
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
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-cyber-blue bg-[#0B0E14] -translate-x-1/2 pointer-events-none"
              style={{ left: `${pct(priceRange[0])}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-cyber-purple bg-[#0B0E14] -translate-x-1/2 pointer-events-none"
              style={{ left: `${pct(priceRange[1])}%` }} />
          </div>

          <div className="flex justify-between text-xs text-white/20 font-mono">
            <span>0 ₽</span>
            <span>{MAX_PRICE.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setCategory('Все'); setPriceRange([0, MAX_PRICE]); setSearch(''); }}
        className="w-full h-9 glass rounded-xl text-white/40 hover:text-white text-sm transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold tracking-tight mb-2">КАТАЛОГ</h1>
        <p className="text-white/35 text-sm">{filtered.length} товар{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}</p>
      </div>

      {/* Search row */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 flex items-center glass rounded-pill px-4 h-12 gap-2 focus-within:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all">
          <Icon name="Search" size={16} className="text-white/30 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <Icon name="X" size={14} className="text-white/30 hover:text-white" />
            </button>
          )}
        </div>

        {/* Mobile filters toggle */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="md:hidden glass rounded-pill px-4 h-12 flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <Icon name="SlidersHorizontal" size={16} />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Sort tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-thin">
        {SORT_OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => { setSort(opt.value); setActiveSort(i); }}
            className={`flex-shrink-0 px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 relative ${
              sort === opt.value ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {sort === opt.value && (
              <div className="absolute inset-0 btn-gradient rounded-pill opacity-20" />
            )}
            {sort === opt.value && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyber-blue" />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden md:block w-[280px] flex-shrink-0">
          <div className="glass rounded-2xl p-5 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 opacity-20">🔍</div>
              <p className="text-white/30 text-lg">Ничего не найдено</p>
              <p className="text-white/20 text-sm mt-2">Попробуйте изменить фильтры</p>
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

      {/* Mobile bottom sheet filters */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 glass-dark rounded-t-3xl p-6 animate-slide-in-up max-h-[80vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl text-white font-bold">ФИЛЬТРЫ</h3>
              <button onClick={() => setFiltersOpen(false)}>
                <Icon name="X" size={20} className="text-white/40" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full btn-gradient h-12 rounded-pill text-white font-semibold mt-6"
            >
              Показать {filtered.length} товар{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
