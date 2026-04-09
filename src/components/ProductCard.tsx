import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Product, formatPrice } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, index, onAddToCart, onClick }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(product, e);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <div
      onClick={() => onClick(product)}
      className="stagger-item card-hover glass rounded-2xl overflow-hidden cursor-pointer group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Product image / icon area */}
      <div className="relative h-44 flex items-center justify-center bg-grad-card overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: 'radial-gradient(circle at 50% 50%, #2A6DF4 0%, transparent 70%)' }}
        />

        {/* Icon */}
        <span className="text-6xl relative z-10 transition-transform duration-300 group-hover:scale-110 select-none">
          {product.icon}
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="badge-trust text-xs px-2.5 py-1">{product.badge}</span>
          )}
          {product.isNew && (
            <span className="text-xs px-2.5 py-1 rounded-pill font-medium"
              style={{ background: 'rgba(138,43,226,0.2)', border: '1px solid rgba(138,43,226,0.3)', color: '#C084FC' }}>
              Новинка
            </span>
          )}
        </div>

        {/* Discount */}
        {discount && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-pill"
              style={{ background: 'rgba(42,109,244,0.25)', border: '1px solid rgba(42,109,244,0.4)', color: '#7EB5FF' }}>
              −{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-white/35 text-xs font-medium uppercase tracking-wider">{product.category}</p>

        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`text-xs ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-white/15'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-white/40 text-xs">{product.rating}</span>
          <span className="text-white/20 text-xs">({product.reviews.toLocaleString('ru-RU')})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="price-new">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="price-old">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex-shrink-0 h-9 px-4 rounded-pill text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              added
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'btn-gradient text-white'
            }`}
          >
            {added ? (
              <>
                <Icon name="Check" size={14} />
                <span>ОК</span>
              </>
            ) : (
              <>
                <Icon name="Plus" size={14} />
                <span className="hidden sm:inline">В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
