import { useState } from 'react';
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
  const [ripple, setRipple] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    setRipple(true);
    onAddToCart(product, e);
    setTimeout(() => setAdded(false), 1200);
    setTimeout(() => setRipple(false), 600);
  };

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <div
      onClick={() => onClick(product)}
      className="stagger-item card-hover bg-white rounded-2xl overflow-hidden cursor-pointer group border border-slate-100 shadow-sm"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Icon area */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #F3EEFF 100%)' }}>
        {/* Animated blobs */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
          style={{ background: '#2A6DF4', top: '-10%', right: '10%' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-700"
          style={{ background: '#8A2BE2', bottom: '-5%', left: '5%' }}
        />

        {/* Icon with float animation on hover */}
        <span
          className="text-6xl relative z-10 select-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-lg"
        >
          {product.icon}
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="badge-trust text-xs px-2.5 py-1 animate-pop-in">{product.badge}</span>
          )}
          {product.isNew && !product.badge && (
            <span className="text-xs px-2.5 py-1 rounded-pill font-semibold"
              style={{ background: 'rgba(138,43,226,0.1)', border: '1px solid rgba(138,43,226,0.2)', color: '#8A2BE2' }}>
              Новинка
            </span>
          )}
        </div>

        {/* Discount */}
        {discount && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-pill bg-white shadow-sm text-cyber-blue border border-cyber-blue/20">
              −{discount}%
            </span>
          </div>
        )}

        {/* Hover overlay shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(42,109,244,0.04) 0%, rgba(138,43,226,0.04) 100%)' }} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{product.category}</p>

        <h3 className="text-slate-800 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-cyber-blue transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`text-xs ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
            ))}
          </div>
          <span className="text-slate-500 text-xs font-medium">{product.rating}</span>
          <span className="text-slate-300 text-xs">({product.reviews.toLocaleString('ru-RU')})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="font-mono font-bold text-lg text-slate-800">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="font-mono text-xs text-slate-300 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`relative flex-shrink-0 h-9 px-4 rounded-pill text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 overflow-hidden ripple-btn ${
              added
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'btn-gradient text-white shadow-md shadow-cyber-blue/20'
            }`}
          >
            {added ? (
              <><Icon name="Check" size={14} /><span>ОК</span></>
            ) : (
              <><Icon name="Plus" size={14} /><span className="hidden sm:inline">В корзину</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
