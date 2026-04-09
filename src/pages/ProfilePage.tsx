import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User, formatPrice } from '@/store/useStore';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ user, onLogout, onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold tracking-tight">ПРОФИЛЬ</h1>
      </div>

      {/* User card */}
      <div className="glass rounded-3xl p-6 mb-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
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
            { label: 'Заказов', value: user.orders.length },
            { label: 'Потрачено', value: formatPrice(totalSpent) },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 mb-6">
        {(['orders', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 pr-8 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-white border-cyber-blue'
                : 'text-white/35 border-transparent hover:text-white/60'
            }`}
          >
            {tab === 'orders' ? 'История покупок' : 'Настройки'}
          </button>
        ))}
      </div>

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          {user.orders.map((order, i) => (
            <div
              key={order.id}
              className="stagger-item glass rounded-2xl overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Order header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white/70 text-sm">{order.id}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-pill font-medium ${
                        order.status === 'completed'
                          ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                          : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                      }`}
                    >
                      {order.status === 'completed' ? '✓ Выполнен' : '⏳ В обработке'}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{order.date}</p>
                </div>
                <span className="font-mono text-white font-semibold text-lg">{formatPrice(order.total)}</span>
              </div>

              {/* Order items */}
              <div className="px-5 py-4 space-y-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <span className="text-white/70 text-sm flex-1">{item.name}</span>
                    <span className="font-mono text-white/50 text-sm">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-white/6 flex gap-3">
                <button className="text-xs text-cyber-blue/70 hover:text-cyber-blue transition-colors flex items-center gap-1">
                  <Icon name="Download" size={12} />
                  Скачать чек
                </button>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                  <Icon name="RefreshCcw" size={12} />
                  Повторить заказ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Profile settings */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Личные данные</h3>
            <div className="space-y-3">
              <div className="relative">
                <Icon name="User" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  defaultValue={user.name}
                  className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                />
              </div>
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  defaultValue={user.email}
                  type="email"
                  className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                />
              </div>
              <button className="w-full btn-gradient h-10 rounded-xl text-white text-sm font-semibold">
                Сохранить
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Смена пароля</h3>
            <div className="space-y-3">
              {['Текущий пароль', 'Новый пароль', 'Повторите пароль'].map(ph => (
                <div key={ph} className="relative">
                  <Icon name="Lock" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="password"
                    placeholder={ph}
                    className="w-full glass rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                  />
                </div>
              ))}
              <button className="w-full glass rounded-xl h-10 text-white/60 hover:text-white text-sm font-semibold transition-colors">
                Изменить пароль
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Уведомления</h3>
            {[
              { label: 'Email о новых заказах', enabled: true },
              { label: 'Акции и скидки', enabled: true },
              { label: 'Обновления продуктов', enabled: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-white/60 text-sm">{item.label}</span>
                <div
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                    item.enabled ? 'bg-cyber-blue' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'left-5' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
