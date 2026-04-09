import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import { Product, PRODUCTS, formatPrice } from '@/store/useStore';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onBuyNow: (product: Product) => void;
  onBack: () => void;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function ProductPage({ product, onAddToCart, onBuyNow, onBack, onNavigate }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');
  const [showSticky, setShowSticky] = useState(false);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    Array.from({ length: quantity }).forEach(() => onAddToCart(product, e));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badges = ['Мгновенная выдача', 'Возврат 14 дней', 'Лицензия РФ', 'Поддержка 24/7'];

  return (
    <div className="min-h-screen pt-20 pb-32 md:pb-16">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto py-6">
        <div className="flex items-center gap-2 text-sm text-white/30">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">Каталог</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-white/60 truncate">{product.name}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Visual */}
          <div className="space-y-6">
            {/* Main icon display */}
            <div className="glass rounded-3xl aspect-square max-w-sm mx-auto lg:max-w-none relative overflow-hidden flex items-center justify-center">
              {/* Animated background */}
              <div className="absolute inset-0" style={{ background: 'var(--grad-card)' }} />
              <div
                className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(circle at 50% 40%, #2A6DF4 0%, transparent 60%)' }}
              />

              {/* Rotating badges */}
              <div className="relative z-10 flex flex-col items-center gap-6">
                <span className="text-8xl sm:text-9xl select-none">{product.icon}</span>

                {/* Orbiting badges */}
                <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                  {badges.map((badge, i) => (
                    <span
                      key={badge}
                      className="badge-trust text-xs animate-fade-in"
                      style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && <span className="badge-trust">{product.badge}</span>}
                {discount && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-pill"
                    style={{ background: 'rgba(42,109,244,0.25)', border: '1px solid rgba(42,109,244,0.4)', color: '#7EB5FF' }}>
                    −{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Rating + reviews */}
            <div className="glass rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-white/10'}`}>★</span>
                  ))}
                </div>
                <span className="text-white font-semibold font-mono">{product.rating}</span>
              </div>
              <span className="text-white/40 text-sm">{product.reviews.toLocaleString('ru-RU')} отзывов</span>
            </div>
          </div>

          {/* Right: Info + buy */}
          <div className="space-y-6">
            {/* Category + name */}
            <div>
              <p className="text-white/35 text-sm font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price block */}
            <div className="glass rounded-2xl p-5 space-y-5">
              <div className="flex items-end gap-4">
                <div>
                  <span className="font-mono text-4xl font-bold text-white">{formatPrice(product.price * quantity)}</span>
                  {product.oldPrice && (
                    <span className="price-old text-lg ml-2">{formatPrice(product.oldPrice * quantity)}</span>
                  )}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-sm">Количество:</span>
                <div className="flex items-center gap-1 glass rounded-pill px-1 py-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-white font-mono font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onBuyNow(product)}
                  className="flex-1 btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2 animate-pulse-glow"
                >
                  <Icon name="Zap" size={18} />
                  Купить сейчас
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-pill font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    added
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {added ? (
                    <><Icon name="Check" size={18} /> Добавлено</>
                  ) : (
                    <><Icon name="ShoppingCart" size={18} /> В корзину</>
                  )}
                </button>
              </div>

              {/* Payment methods */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-white/20 text-xs mr-1">Оплата:</span>
                {['СБП', 'МИР', 'ЮMoney', 'SberPay'].map(m => (
                  <span key={m} className="text-[10px] font-mono text-white/25 hover:text-white/60 transition-colors cursor-default px-1.5 py-0.5 border border-white/10 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-white/8">
                {(['description', 'features', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pr-6 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'text-white border-cyber-blue'
                        : 'text-white/35 border-transparent hover:text-white/60'
                    }`}
                  >
                    {tab === 'description' ? 'Описание' : tab === 'features' ? 'Что включено' : 'Отзывы'}
                  </button>
                ))}
              </div>

              <div className="animate-fade-in min-h-[100px]">
                {activeTab === 'description' && (
                  <p className="text-white/60 text-sm leading-relaxed">{product.description}</p>
                )}
                {activeTab === 'features' && (
                  <ul className="space-y-2">
                    {product.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(42,109,244,0.2)', border: '1px solid rgba(42,109,244,0.3)' }}>
                          <Icon name="Check" size={12} className="text-cyber-blue" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    {[
                      { name: 'Сергей К.', text: 'Отличный товар, мгновенная активация. Рекомендую!', rating: 5 },
                      { name: 'Анна М.', text: 'Всё пришло быстро, работает отлично.', rating: 5 },
                      { name: 'Дмитрий П.', text: 'Хорошее соотношение цены и качества.', rating: 4 },
                    ].map((r, i) => (
                      <div key={i} className="glass rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{r.name}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-white/10'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-white/45 text-sm">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-3xl text-white font-bold tracking-tight mb-6">ПОХОЖИЕ ТОВАРЫ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={onAddToCart} onClick={(prod: Product) => onNavigate('product', prod)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom panel */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden glass-dark border-t border-white/8 px-4 py-3 z-40 flex items-center gap-3">
        <div className="flex-1">
          <span className="font-mono text-xl font-bold text-white">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="price-old ml-2 text-sm">{formatPrice(product.oldPrice)}</span>}
        </div>
        <button
          onClick={e => onAddToCart(product, e)}
          className="glass h-11 px-4 rounded-pill text-white text-sm font-semibold flex items-center gap-2"
        >
          <Icon name="ShoppingCart" size={16} />
          В корзину
        </button>
        <button
          onClick={() => onBuyNow(product)}
          className="btn-gradient h-11 px-5 rounded-pill text-white text-sm font-semibold flex items-center gap-2"
        >
          <Icon name="Zap" size={16} />
          Купить
        </button>
      </div>
    </div>
  );
}