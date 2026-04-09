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
  const [swipeMap, setSwipeMap]   = useState<Record<number, number>>({});
  const [touchStart, setTouchStart] = useState<Record<number, number>>({});

  const total      = items.reduce((s, i) => s + i.price * i.quantity, 0);
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
      <div ref={overlayRef} className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />

      {/* Panel */}
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-[400px] flex flex-col animate-slide-in-right"
        style={{ background: 'var(--bg-white)', borderLeft: '1px solid var(--border-soft)', boxShadow: '-8px 0 40px rgba(0,0,0,0.08)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-soft)' }}>
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>Корзина</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
              {totalItems} товар{totalItems === 1 ? '' : totalItems < 5 ? 'а' : 'ов'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-subtle)', color: 'var(--ink-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
            <Icon name="X" size={15} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-light py-3 px-4 space-y-2"
          style={{ background: 'var(--bg)' }}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="text-4xl animate-float">🛒</div>
              <p className="text-sm" style={{ color: 'var(--ink-4)' }}>Корзина пуста</p>
              <button onClick={onClose} className="btn-primary h-9 px-5 text-[13px]">
                Перейти в каталог
              </button>
            </div>
          ) : items.map((item, idx) => (
            <div key={item.id}
              style={{
                animationDelay: `${idx * 0.05}s`,
                transform: `translateX(${swipeMap[item.id] ?? 0}px)`,
                transition: (swipeMap[item.id] ?? 0) !== 0 ? 'none' : 'transform 0.28s cubic-bezier(0.34,1.2,0.64,1)',
                background: 'var(--bg-white)',
                borderRadius: 16,
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-xs)',
                overflow: 'hidden', position: 'relative',
              }}
              className="stagger-item p-4"
              onTouchStart={e => handleTouchStart(item.id, e)}
              onTouchMove={e => handleTouchMove(item.id, e)}
              onTouchEnd={() => handleTouchEnd(item.id)}
            >
              <div className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center"
                style={{ background: '#FEF2F2' }}>
                <Icon name="Trash2" size={16} style={{ color: '#DC2626' }} />
              </div>

              <div className="flex gap-3 relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--bg-subtle)' }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{item.category}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-bold text-sm" style={{ color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* minus */}
                      <button onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{ background: 'var(--bg-subtle)', color: 'var(--ink-3)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-semibold" style={{ color: 'var(--ink)' }}>{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{ background: 'var(--bg-subtle)', color: 'var(--ink-3)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}>
                        +
                      </button>
                      <button onClick={() => onRemove(item.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center ml-1 transition-all"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        <Icon name="Trash2" size={11} />
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
            style={{ borderTop: '1px solid var(--border-soft)', background: 'var(--bg-white)' }}>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge-trust">✓ Мгновенная выдача</span>
              <span className="badge-trust">✓ Возврат 14 дней</span>
            </div>

            <div className="flex items-center justify-between py-3"
              style={{ borderTop: '1px solid var(--border-soft)' }}>
              <span className="text-sm" style={{ color: 'var(--ink-3)' }}>Итого</span>
              <span className="font-bold text-xl" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
                {formatPrice(total)}
              </span>
            </div>

            <button onClick={onCheckout}
              className="btn-primary w-full h-11 text-sm animate-pulse-glow">
              <Icon name="Zap" size={15} />
              Оформить заказ
            </button>

            <div className="flex justify-center gap-2">
              {['СБП', 'МИР', 'ЮMoney', 'SberPay'].map(m => (
                <span key={m} className="text-[10px] px-2 py-0.5 rounded"
                  style={{ border: '1px solid var(--border-soft)', color: 'var(--ink-5)' }}>
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
