import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Product, formatPrice } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onClick: (product: Product) => void;
}

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  'Дизайн':        { bg: '#F5F0FF', color: '#7C3AED' },
  'Офис':          { bg: '#EFF6FF', color: '#2563EB' },
  'Безопасность':  { bg: '#F0FDF4', color: '#16A34A' },
  'Системы':       { bg: '#FFF7ED', color: '#EA580C' },
  'Продуктивность':{ bg: '#FEFCE8', color: '#CA8A04' },
  'Медиа':         { bg: '#FDF2F8', color: '#DB2777' },
  'ИИ':            { bg: '#F0F9FF', color: '#0284C7' },
};

export default function ProductCard({ product, index, onAddToCart, onClick }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const colors = ICON_COLORS[product.category] ?? { bg: '#F5F5F7', color: '#6E6E73' };
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(product, e);
    setTimeout(() => setAdded(false), 1300);
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="product-card stagger-item"
      style={{ animationDelay: `${index * 0.045}s` }}
    >
      {/* Icon area */}
      <div className="relative px-5 pt-5 pb-3">
        <div className="card-icon-wrap w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
          style={{ background: colors.bg }}>
          {product.icon}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.badge && (
            <span className="badge badge-dark text-[11px]">{product.badge}</span>
          )}
          {product.isNew && !product.badge && (
            <span className="badge text-[11px]">Новинка</span>
          )}
          {discount && (
            <span className="badge text-[11px]" style={{ background: '#F0FDF4', color: '#16A34A', borderColor: '#BBF7D0' }}>
              −{discount}%
            </span>
          )}
        </div>

        {/* Category */}
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--ink-4)' }}>
          {product.category}
        </p>

        {/* Title */}
        <h3 className="card-title font-semibold text-sm leading-snug mb-2 line-clamp-2 transition-colors duration-200"
          style={{ color: 'var(--ink-2)' }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill={s <= Math.round(product.rating) ? '#FBBF24' : '#E5E7EB'}>
                <path d="M5 0.5l1.18 2.39 2.64.38-1.91 1.86.45 2.63L5 6.6 2.64 7.76l.45-2.63L1.18 3.27l2.64-.38L5 0.5z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--ink-4)' }}>
            {product.rating} <span style={{ color: 'var(--ink-5)' }}>({product.reviews.toLocaleString('ru-RU')})</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-end justify-between gap-3">
        <div>
          <div className="price-main">{formatPrice(product.price)}</div>
          {product.oldPrice && (
            <div className="price-old">{formatPrice(product.oldPrice)}</div>
          )}
        </div>

        {/* Buy button — appears on hover */}
        <button
          onClick={handleAdd}
          className="card-buy-btn btn-primary h-8 px-4 text-xs"
          style={added ? {
            opacity: 1, transform: 'none',
            background: '#16A34A',
            boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
          } : {}}
        >
          {added ? (
            <><Icon name="Check" size={12} /> Добавлено</>
          ) : (
            <>Купить</>
          )}
        </button>
      </div>

      {/* Seller tag */}
      {product.sellerName && (
        <div className="absolute top-4 right-4">
          <span className="badge text-[10px]" style={{ color: 'var(--ink-4)' }}>
            {product.sellerName.split(' ')[0]}
          </span>
        </div>
      )}
    </div>
  );
}
