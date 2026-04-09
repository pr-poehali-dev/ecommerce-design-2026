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

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleTouchStart = (id: number, e: React.TouchEvent) => {
    setTouchStart(prev => ({ ...prev, [id]: e.touches[0].clientX }));
  };

  const handleTouchMove = (id: number, e: React.TouchEvent) => {
    const start = touchStart[id] ?? e.touches[0].clientX;
    const diff = Math.min(0, e.touches[0].clientX - start);
    setSwipeMap(prev => ({ ...prev, [id]: Math.max(-80, diff) }));
  };

  const handleTouchEnd = (id: number) => {
    const swipe = swipeMap[id] ?? 0;
    if (swipe < -50) {
      onRemove(id);
    }
    setSwipeMap(prev => ({ ...prev, [id]: 0 }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-[420px] bg-white flex flex-col animate-slide-in-right shadow-[-8px_0_40px_rgba(15,23,42,0.12)] border-l border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-heading text-xl text-slate-800 font-bold tracking-tight">КОРЗИНА</h2>
            <p className="text-slate-400 text-sm mt-0.5">{totalItems} товар{totalItems === 1 ? '' : totalItems < 5 ? 'а' : 'ов'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-4 px-4 space-y-3 bg-slate-50/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="text-5xl">🛒</div>
              <p className="text-slate-400 text-sm">Корзина пуста</p>
              <button
                onClick={onClose}
                className="btn-gradient px-6 py-2.5 rounded-pill text-white text-sm font-medium shadow-md"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  transform: `translateX(${swipeMap[item.id] ?? 0}px)`,
                  transition: (swipeMap[item.id] ?? 0) !== 0 ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.2,0.64,1)',
                }}
                className="stagger-item bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-slate-100"
                onTouchStart={e => handleTouchStart(item.id, e)}
                onTouchMove={e => handleTouchMove(item.id, e)}
                onTouchEnd={() => handleTouchEnd(item.id)}
              >
                {/* Swipe delete hint */}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-red-500 flex items-center justify-center rounded-r-2xl">
                  <Icon name="Trash2" size={18} className="text-white" />
                </div>

                <div className="flex gap-3 relative">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl rounded-xl" style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #F3EEFF 100%)' }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="text-slate-700 text-sm w-4 text-center font-mono font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 transition-colors ml-1"
                        >
                          <Icon name="Trash2" size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 space-y-4 bg-white">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-trust">✓ Мгновенная выдача</span>
              <span className="badge-trust">✓ Возврат 14 дней</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Итого</span>
              <span className="font-mono font-bold text-xl text-slate-800">{formatPrice(total)}</span>
            </div>

            {/* CTA */}
            <button
              onClick={onCheckout}
              className="w-full btn-gradient h-12 rounded-pill text-white font-semibold text-base flex items-center justify-center gap-2 animate-pulse-glow shadow-lg shadow-cyber-blue/25 ripple-btn"
            >
              <Icon name="Zap" size={18} />
              Оплатить
            </button>

            {/* Payment icons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {['СБП', 'МИР', 'ЮMoney', 'SberPay'].map(method => (
                <span
                  key={method}
                  className="text-[10px] font-mono text-slate-400 hover:text-slate-600 transition-colors cursor-default px-1.5 py-0.5 border border-slate-200 rounded bg-slate-50"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}