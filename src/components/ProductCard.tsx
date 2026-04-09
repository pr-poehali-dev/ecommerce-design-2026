import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Product, formatPrice } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onClick: (product: Product) => void;
}

const NEON_COLORS = [
  { r: '255,45,155',  label: 'pink'   },
  { r: '0,212,255',   label: 'cyan'   },
  { r: '157,78,221',  label: 'violet' },
  { r: '0,255,148',   label: 'green'  },
];

export default function ProductCard({ product, index, onAddToCart, onClick }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const c = NEON_COLORS[product.id % NEON_COLORS.length];
  const border  = `rgba(${c.r}, 0.65)`;
  const glow    = `rgba(${c.r}, 0.35)`;
  const soft    = `rgba(${c.r}, 0.08)`;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(product, e);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="stagger-item rounded-2xl overflow-hidden cursor-pointer group relative"
      style={{
        animationDelay: `${index * 0.07}s`,
        background: '#0A0A0F',
        border: `1px solid ${hovered ? border : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? `0 0 0 1px ${border}, 0 0 30px ${glow}, 0 0 80px rgba(${c.r},0.1), 0 24px 60px rgba(0,0,0,0.7)`
          : '0 2px 16px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-10px) scale(1.025)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
      }}
    >
      {/* Scan line */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
          <div
            className="absolute left-0 right-0 h-px animate-scan"
            style={{ background: `linear-gradient(90deg, transparent, ${border}, transparent)` }}
          />
        </div>
      )}

      {/* Icon zone */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 60%, ${soft} 0%, transparent 70%)` }}
      >
        <div className="absolute inset-0 cyber-grid-sm opacity-40" />

        {/* Glow on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at 50% 50%, ${glow} 0%, transparent 65%)`,
          }}
        />

        {/* Icon */}
        <span
          className="text-7xl relative z-10 select-none transition-all duration-500"
          style={{
            transform: hovered ? 'scale(1.25) translateY(-10px)' : 'scale(1)',
            filter: hovered
              ? `drop-shadow(0 0 12px ${border}) drop-shadow(0 0 28px ${glow})`
              : 'none',
          }}
        >
          {product.icon}
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.badge && (
            <span className="text-xs px-2.5 py-1 rounded-pill font-bold"
              style={{ background: soft, border: `1px solid ${border}`, color: `rgba(${c.r},1)`, textShadow: `0 0 8px ${glow}` }}>
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="badge-trust text-xs px-2.5 py-1">✦ Новинка</span>
          )}
        </div>

        {discount && (
          <div className="absolute top-3 right-3 z-20">
            <span className="text-xs font-black px-2.5 py-1 rounded-pill"
              style={{ background: 'rgba(0,255,148,0.12)', border: '1px solid rgba(0,255,148,0.4)', color: '#00FF94', textShadow: '0 0 8px rgba(0,255,148,0.5)' }}>
              −{discount}%
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0A0A0F, transparent)' }} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3" style={{ background: '#0A0A0F' }}>
        {product.sellerName && (
          <p className="text-xs" style={{ color: 'rgba(255,45,155,0.55)' }}>
            ● от {product.sellerName.split(' ')[0]}
          </p>
        )}

        <p className="text-xs font-bold uppercase tracking-widest"
          style={{ color: `rgba(${c.r},0.75)`, textShadow: hovered ? `0 0 6px ${glow}` : 'none' }}>
          {product.category}
        </p>

        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-white/85 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`text-xs ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-white/10'}`}>★</span>
            ))}
          </div>
          <span className="text-white/35 text-xs font-mono">{product.rating}</span>
          <span className="text-white/15 text-xs">({product.reviews.toLocaleString('ru-RU')})</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3"
          style={{ borderTop: `1px solid rgba(${c.r},0.1)` }}>
          <div>
            <div className="font-mono font-black text-lg transition-all duration-300"
              style={{
                color: hovered ? `rgba(${c.r},1)` : '#fff',
                textShadow: hovered ? `0 0 12px ${glow}` : 'none',
              }}>
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && (
              <div className="font-mono text-xs line-through text-white/20">{formatPrice(product.oldPrice)}</div>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="flex-shrink-0 h-9 px-4 rounded-pill text-sm font-bold flex items-center gap-1.5 transition-all duration-300 ripple-btn"
            style={added ? {
              background: 'rgba(0,255,148,0.12)',
              border: '1px solid rgba(0,255,148,0.4)',
              color: '#00FF94',
              boxShadow: '0 0 12px rgba(0,255,148,0.3)',
            } : {
              background: `linear-gradient(135deg, #FF2D9B 0%, #9D4EDD 50%, #00D4FF 100%)`,
              color: 'white',
              boxShadow: hovered ? `0 0 20px ${glow}` : 'none',
            }}
          >
            {added
              ? <><Icon name="Check" size={14} /><span>ОК!</span></>
              : <><Icon name="Plus" size={14} /><span className="hidden sm:inline">В корзину</span></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
