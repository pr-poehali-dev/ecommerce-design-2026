import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { CartItem, formatPrice } from '@/store/useStore';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, items, onRemove, onUpdateQty, onCheckout }: CartDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [swipeMap, setSwipeMap] = useState<Record<number, number>>({});
  const [touchStart, setTouchStart] = useState<Record<number, number>>({});

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleTouchStart = (id: number, e: React.TouchEvent) =>
    setTouchStart(p => ({ ...p, [id]: e.touches[0].clientX }));

  const handleTouchMove = (id: number, e: React.TouchEvent) => {
    const diff = Math.min(0, e.touches[0].clientX - (touchStart[id] ?? e.touches[0].clientX));
    setSwipeMap(p => ({ ...p, [id]: Math.max(-80, diff) }));
  };

  const handleTouchEnd = (id: number) => {
    if ((swipeMap[id] ?? 0) < -50) onRemove(id);
    setSwipeMap(p => ({ ...p, [id]: 0 }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="absolute top-0 right-0 bottom-0 w-full max-w-[420px] flex flex-col animate-slide-in-right scrollbar-neon"
        style={{
          background: '#0A0A0F',
          borderLeft: '1px solid rgba(255,45,155,0.15)',
          boxShadow: '-8px 0 60px rgba(255,45,155,0.1), -4px 0 30px rgba(0,0,0,0.8)',
        }}
      >
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px animate-scan"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,45,155,0.4), transparent)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-white">КОРЗИНА</h2>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,45,155,0.7)' }}>
              {totalItems} товар{totalItems === 1 ? '' : totalItems < 5 ? 'а' : 'ов'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,45,155,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#FF2D9B'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}>
            <Icon name="X" size={17} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-neon py-4 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-5">
              <div className="text-6xl animate-float">🛒</div>
              <p className="text-white/25 text-sm font-medium">Корзина пуста</p>
              <button onClick={onClose}
                className="btn-gradient px-6 py-2.5 rounded-pill text-white text-sm font-bold ripple-btn"
                style={{ boxShadow: '0 0 20px rgba(255,45,155,0.3)' }}>
                В каталог
              </button>
            </div>
          ) : items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                animationDelay: `${idx * 0.06}s`,
                transform: `translateX(${swipeMap[item.id] ?? 0}px)`,
                transition: (swipeMap[item.id] ?? 0) !== 0 ? 'none' : 'transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
                background: '#0F0F18',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="stagger-item p-4"
              onTouchStart={e => handleTouchStart(item.id, e)}
              onTouchMove={e => handleTouchMove(item.id, e)}
              onTouchEnd={() => handleTouchEnd(item.id)}
            >
              {/* Swipe hint */}
              <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center rounded-r-2xl"
                style={{ background: 'rgba(255,50,50,0.8)' }}>
                <Icon name="Trash2" size={18} className="text-white" />
              </div>

              <div className="flex gap-3 relative">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl rounded-xl"
                  style={{ background: 'rgba(255,45,155,0.08)', border: '1px solid rgba(255,45,155,0.15)' }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono font-black text-base" style={{ color: '#FF2D9B', textShadow: '0 0 10px rgba(255,45,155,0.4)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { action: () => onUpdateQty(item.id, item.quantity - 1), label: '−' },
                      ].map(btn => (
                        <button key="minus" onClick={btn.action}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,45,155,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#FF2D9B'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}>
                          {btn.label}
                        </button>
                      ))}
                      <span className="text-white text-sm w-5 text-center font-mono font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#00D4FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}>
                        +
                      </button>
                      <button onClick={() => onRemove(item.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center ml-1 transition-all"
                        style={{ background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.15)', color: 'rgba(255,80,80,0.5)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ff5555'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 8px rgba(255,50,50,0.3)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,0.5)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
                        <Icon name="Trash2" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 flex-shrink-0 space-y-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Trust */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-trust">✓ Мгновенная выдача</span>
              <span className="badge-trust">✓ Возврат 14 дней</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-white/40 text-sm font-medium">Итого</span>
              <span className="font-mono font-black text-2xl text-white"
                style={{ textShadow: '0 0 20px rgba(255,45,155,0.4)' }}>
                {formatPrice(total)}
              </span>
            </div>

            {/* CTA */}
            <button onClick={onCheckout}
              className="w-full btn-gradient h-13 rounded-pill text-white font-black text-base flex items-center justify-center gap-2 ripple-btn"
              style={{ height: '52px', boxShadow: '0 0 30px rgba(255,45,155,0.4), 0 8px 30px rgba(0,0,0,0.4)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(255,45,155,0.6), 0 0 80px rgba(157,78,221,0.3), 0 12px 40px rgba(0,0,0,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,45,155,0.4), 0 8px 30px rgba(0,0,0,0.4)'; }}>
              <Icon name="Zap" size={18} />
              ОПЛАТИТЬ
            </button>

            {/* Payment icons */}
            <div className="flex items-center justify-center gap-2">
              {['СБП', 'МИР', 'ЮMoney', 'SberPay'].map(m => (
                <span key={m}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded cursor-default transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.color = '#FF2D9B'; (e.currentTarget as HTMLSpanElement).style.borderColor = 'rgba(255,45,155,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLSpanElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
