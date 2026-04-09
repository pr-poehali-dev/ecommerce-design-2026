import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User, Product, formatPrice } from '@/store/useStore';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onTopupOpen: () => void;
  onSell: () => void;
  onDeleteProduct?: (id: number) => void;
}

type Tab = 'orders' | 'my_products' | 'settings';

export default function ProfilePage({ user, onLogout, onNavigate, onTopupOpen, onSell, onDeleteProduct }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [notifToggles, setNotifToggles] = useState({ email: true, promos: true, updates: false });

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);
  const totalEarned = user.myProducts.length * 0;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'orders', label: 'Покупки' },
    { id: 'my_products', label: 'Мои товары' },
    { id: 'settings', label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold tracking-tight">ПРОФИЛЬ</h1>
      </div>

      {/* User card */}
      <div className="glass rounded-3xl p-6 mb-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-xl flex-shrink-0"
              style={{ background: 'var(--grad-main)' }}
            >
              {user.avatar}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{user.name}</h2>
              <p className="text-white/40 text-sm">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400/70 text-xs">Аккаунт активен</span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="glass rounded-xl px-4 py-2 text-white/40 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
          >
            <Icon name="LogOut" size={14} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/8">
          {[
            { label: 'Покупок', value: user.orders.reduce((s, o) => s + o.items.length, 0) },
            { label: 'Продаж', value: user.myProducts.length },
            { label: 'Потрачено', value: formatPrice(totalSpent) },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Balance card */}
      <div
        className="rounded-3xl p-6 mb-6 relative overflow-hidden animate-fade-in"
        style={{ background: 'var(--grad-main)', animationDelay: '0.1s' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: 'white', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: 'white' }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Баланс ByteBay</p>
              <p className="font-mono text-4xl font-bold text-white mt-2 leading-none">
                {user.balance.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-white/50 text-xs mt-2">Доступно для покупок и вывода</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <Icon name="Wallet" size={22} className="text-white" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onTopupOpen}
              className="flex-1 bg-white/20 hover:bg-white/30 h-10 rounded-pill text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <Icon name="Plus" size={15} />
              Пополнить
            </button>
            <button
              className="flex-1 bg-white/10 hover:bg-white/20 h-10 rounded-pill text-white/70 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <Icon name="ArrowUpRight" size={15} />
              Вывести
            </button>
          </div>
        </div>
      </div>

      {/* Sell CTA */}
      <button
        onClick={onSell}
        className="w-full glass rounded-2xl p-4 mb-6 flex items-center justify-between hover:bg-white/8 transition-colors group animate-fade-in"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(42,109,244,0.15)', border: '1px solid rgba(42,109,244,0.2)' }}>
            🚀
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Продать товар</p>
            <p className="text-white/35 text-xs">Добавьте свой цифровой продукт в каталог</p>
          </div>
        </div>
        <Icon name="ChevronRight" size={18} className="text-white/25 group-hover:text-white/60 transition-colors" />
      </button>

      {/* Tabs */}
      <div className="flex border-b border-white/8 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 pr-6 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-white border-cyber-blue'
                : 'text-white/35 border-transparent hover:text-white/60'
            }`}
          >
            {tab.label}
            {tab.id === 'my_products' && user.myProducts.length > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ background: 'rgba(42,109,244,0.2)', color: '#7EB5FF' }}>
                {user.myProducts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          {user.orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl opacity-20">📦</div>
              <p className="text-white/30">Покупок пока нет</p>
              <button onClick={() => onNavigate('catalog')} className="btn-gradient px-6 py-2.5 rounded-pill text-white text-sm font-medium">
                В каталог
              </button>
            </div>
          ) : user.orders.map((order, i) => (
            <div key={order.id} className="stagger-item glass rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white/70 text-sm">{order.id}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-pill font-medium ${
                      order.status === 'completed'
                        ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                        : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                    }`}>
                      {order.status === 'completed' ? '✓ Выполнен' : '⏳ В обработке'}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{order.date}</p>
                </div>
                <span className="font-mono text-white font-semibold text-lg">{formatPrice(order.total)}</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <span className="text-white/70 text-sm flex-1">{item.name}</span>
                    <span className="font-mono text-white/50 text-sm">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-white/6 flex gap-3">
                <button className="text-xs text-cyber-blue/70 hover:text-cyber-blue transition-colors flex items-center gap-1">
                  <Icon name="Download" size={12} />
                  Скачать чек
                </button>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                  <Icon name="RefreshCcw" size={12} />
                  Повторить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My products tab */}
      {activeTab === 'my_products' && (
        <div className="animate-fade-in">
          {user.myProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-5xl opacity-20">🏪</div>
              <div>
                <p className="text-white/30 text-lg">Вы ещё не продаёте</p>
                <p className="text-white/20 text-sm mt-1">Добавьте первый цифровой товар</p>
              </div>
              <button
                onClick={onSell}
                className="btn-gradient px-8 py-3 rounded-pill text-white font-semibold inline-flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                Добавить товар
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/40 text-sm">{user.myProducts.length} товар{user.myProducts.length === 1 ? '' : user.myProducts.length < 5 ? 'а' : 'ов'} на продаже</p>
                <button onClick={onSell} className="btn-gradient px-4 h-9 rounded-pill text-white text-sm font-semibold flex items-center gap-1.5">
                  <Icon name="Plus" size={14} />
                  Добавить
                </button>
              </div>
              {user.myProducts.map((product, i) => (
                <div key={product.id} className="stagger-item glass rounded-2xl p-4 flex items-center gap-4" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-white/5">
                    {product.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-white/30 text-xs">{product.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/15" />
                      <span className="text-green-400/70 text-xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                        Активен
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-white font-semibold">{formatPrice(product.price)}</p>
                    <p className="text-white/25 text-xs">{product.reviews} продаж</p>
                  </div>
                  {onDeleteProduct && (
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white/25 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Личные данные</h3>
            <div className="space-y-3">
              <div className="relative">
                <Icon name="User" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input defaultValue={user.name} className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all" />
              </div>
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input defaultValue={user.email} type="email" className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all" />
              </div>
              <button className="w-full btn-gradient h-10 rounded-xl text-white text-sm font-semibold">Сохранить</button>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Смена пароля</h3>
            <div className="space-y-3">
              {['Текущий пароль', 'Новый пароль', 'Повторите пароль'].map(ph => (
                <div key={ph} className="relative">
                  <Icon name="Lock" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input type="password" placeholder={ph} className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all" />
                </div>
              ))}
              <button className="w-full glass rounded-xl h-10 text-white/60 hover:text-white text-sm font-semibold transition-colors">Изменить пароль</button>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Уведомления</h3>
            {[
              { key: 'email' as const, label: 'Email о новых заказах' },
              { key: 'promos' as const, label: 'Акции и скидки' },
              { key: 'updates' as const, label: 'Обновления продуктов' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <span className="text-white/60 text-sm">{item.label}</span>
                <button
                  onClick={() => setNotifToggles(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${notifToggles[item.key] ? 'bg-cyber-blue' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${notifToggles[item.key] ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
