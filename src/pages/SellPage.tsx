import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Product, CATEGORIES, User } from '@/store/useStore';

interface SellPageProps {
  user: User;
  onPublish: (product: Product) => void;
  onNavigate: (page: string) => void;
}

const ICONS = ['🎨', '📊', '🛡️', '💻', '📝', '✏️', '🎵', '🤖', '🎮', '📱', '🔑', '🌐', '📷', '🎬', '📚', '🧩'];

export default function SellPage({ user, onPublish, onNavigate }: SellPageProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎮');
  const [feature, setFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Укажите название';
    if (!category) e.category = 'Выберите категорию';
    if (!price || parseInt(price) < 1) e.price = 'Укажите цену';
    if (!description.trim()) e.description = 'Добавьте описание';
    if (features.length === 0) e.features = 'Добавьте хотя бы одну характеристику';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addFeature = () => {
    if (feature.trim()) {
      setFeatures(prev => [...prev, feature.trim()]);
      setFeature('');
    }
  };

  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));

  const handlePreview = () => {
    if (validate()) setStep('preview');
  };

  const handlePublish = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      category,
      price: parseInt(price),
      oldPrice: oldPrice ? parseInt(oldPrice) : undefined,
      rating: 5.0,
      reviews: 0,
      icon,
      description: description.trim(),
      features,
      isNew: true,
      sellerId: user.id,
      sellerName: user.name,
      badge: 'Новинка',
    };
    onPublish(newProduct);
    setStep('success');
  };

  const previewProduct: Product = {
    id: 0, name, category, price: parseInt(price) || 0,
    oldPrice: oldPrice ? parseInt(oldPrice) : undefined,
    rating: 5.0, reviews: 0, icon, description, features, isNew: true,
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 animate-scale-in max-w-sm">
          <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl" style={{ background: 'var(--grad-main)' }}>
            {icon}
          </div>
          <div>
            <h1 className="font-heading text-4xl text-white font-bold tracking-tight">ОПУБЛИКОВАНО!</h1>
            <p className="text-white/40 text-sm mt-2">Ваш товар добавлен в каталог ByteBay</p>
          </div>
          <div className="glass rounded-2xl p-4 space-y-2">
            <p className="text-white font-medium">{name}</p>
            <div className="flex items-center justify-between">
              <span className="badge-trust">{category}</span>
              <span className="font-mono text-white font-bold">{parseInt(price).toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex-1 btn-gradient h-11 rounded-pill text-white font-semibold text-sm"
            >
              В каталог
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex-1 glass h-11 rounded-pill text-white/70 hover:text-white font-semibold text-sm transition-colors"
            >
              Мой профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => step === 'preview' ? setStep('form') : onNavigate('profile')} className="text-white/40 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div>
          <h1 className="font-heading text-4xl text-white font-bold tracking-tight">
            {step === 'preview' ? 'ПРЕДПРОСМОТР' : 'ПРОДАТЬ ТОВАР'}
          </h1>
          <p className="text-white/30 text-sm mt-0.5">
            {step === 'preview' ? 'Проверьте перед публикацией' : 'Добавьте цифровой товар в каталог'}
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Данные', 'Предпросмотр', 'Готово'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              (step === 'form' && i === 0) || (step === 'preview' && i === 1) || (step === 'success' && i === 2)
                ? 'btn-gradient text-white'
                : i < (['form', 'preview', 'success'].indexOf(step))
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'glass text-white/30'
            }`}>
              {i < (['form', 'preview', 'success'].indexOf(step)) ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === ['form','preview','success'][i] ? 'text-white' : 'text-white/25'}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-px w-6 sm:w-12 ${i < (['form', 'preview', 'success'].indexOf(step)) ? 'bg-cyber-blue/50' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Form */}
      {step === 'form' && (
        <div className="space-y-5 animate-fade-in">
          {/* Icon picker */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Иконка товара</h3>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200 ${
                    icon === ic ? 'btn-gradient scale-110' : 'glass hover:bg-white/10'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Main info */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Основное</h3>

            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Название товара *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Например: Adobe Photoshop 2026"
                className={`w-full glass rounded-xl h-11 px-4 text-white text-sm placeholder:text-white/20 outline-none transition-all ${errors.name ? 'border border-red-500/50' : 'focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)]'}`}
              />
              {errors.name && <p className="text-red-400/70 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Категория *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(1).map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all duration-200 ${
                      category === cat.name ? 'btn-gradient text-white' : 'glass text-white/50 hover:text-white'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400/70 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-white/40 text-xs mb-1.5 block">Цена ₽ *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="1 490"
                    className={`w-full glass rounded-xl h-11 px-4 pr-8 text-white font-mono text-sm placeholder:text-white/20 outline-none transition-all ${errors.price ? 'border border-red-500/50' : 'focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)]'}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">₽</span>
                </div>
                {errors.price && <p className="text-red-400/70 text-xs mt-1">{errors.price}</p>}
              </div>
              <div className="flex-1">
                <label className="text-white/40 text-xs mb-1.5 block">Старая цена ₽</label>
                <div className="relative">
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={e => setOldPrice(e.target.value)}
                    placeholder="2 990"
                    className="w-full glass rounded-xl h-11 px-4 pr-8 text-white font-mono text-sm placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">₽</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Описание</h3>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Расскажите о товаре: что включено, как работает, для кого предназначен..."
              rows={4}
              className={`w-full glass rounded-xl p-4 text-white text-sm placeholder:text-white/20 outline-none resize-none transition-all ${errors.description ? 'border border-red-500/50' : 'focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)]'}`}
            />
            {errors.description && <p className="text-red-400/70 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Features */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Что входит в товар *</h3>
            <div className="flex gap-2">
              <input
                value={feature}
                onChange={e => setFeature(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addFeature()}
                placeholder="Например: 12 месяцев доступа"
                className="flex-1 glass rounded-xl h-10 px-4 text-white text-sm placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
              />
              <button onClick={addFeature} className="btn-gradient w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Icon name="Plus" size={16} />
              </button>
            </div>
            {features.length > 0 && (
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 glass rounded-xl">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(42,109,244,0.2)' }}>
                      <Icon name="Check" size={11} className="text-cyber-blue" />
                    </span>
                    <span className="text-white/70 text-sm flex-1">{f}</span>
                    <button onClick={() => removeFeature(i)} className="text-white/25 hover:text-red-400 transition-colors">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.features && <p className="text-red-400/70 text-xs">{errors.features}</p>}
          </div>

          {/* Commission notice */}
          <div className="glass rounded-xl px-4 py-3 flex items-start gap-3 border border-cyber-blue/20">
            <Icon name="Info" size={16} className="text-cyber-blue mt-0.5 flex-shrink-0" />
            <p className="text-white/50 text-xs leading-relaxed">
              Комиссия ByteBay — <span className="text-white/70">10%</span> от каждой продажи. Средства зачисляются на ваш баланс сразу после покупки.
            </p>
          </div>

          <button onClick={handlePreview} className="w-full btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2">
            <Icon name="Eye" size={16} />
            Предпросмотр
          </button>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Product card preview */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="relative h-52 flex items-center justify-center" style={{ background: 'var(--grad-card)' }}>
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 40%, #2A6DF4 0%, transparent 70%)' }} />
              <span className="text-8xl relative z-10">{previewProduct.icon}</span>
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="badge-trust">Новинка</span>
                {previewProduct.oldPrice && (
                  <span className="text-xs px-2.5 py-1 rounded-pill font-medium" style={{ background: 'rgba(42,109,244,0.25)', border: '1px solid rgba(42,109,244,0.4)', color: '#7EB5FF' }}>
                    −{Math.round((1 - previewProduct.price / previewProduct.oldPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-white/35 text-xs uppercase tracking-wider">{previewProduct.category}</p>
              <h3 className="text-white font-semibold">{previewProduct.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{previewProduct.description}</p>
              <div className="space-y-2 pt-1">
                {previewProduct.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(42,109,244,0.2)' }}>
                      <Icon name="Check" size={10} className="text-cyber-blue" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/6">
                <div>
                  <span className="font-mono text-xl font-bold text-white">{previewProduct.price.toLocaleString('ru-RU')} ₽</span>
                  {previewProduct.oldPrice && <span className="font-mono text-sm text-white/30 line-through ml-2">{previewProduct.oldPrice.toLocaleString('ru-RU')} ₽</span>}
                </div>
                <span className="text-white/20 text-xs font-medium">от {user.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Earnings estimate */}
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Ваш доход с продажи</p>
              <p className="font-mono text-xl text-white font-bold mt-0.5">
                {Math.round(parseInt(price) * 0.9).toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Комиссия ByteBay</p>
              <p className="font-mono text-white/40 mt-0.5">{Math.round(parseInt(price) * 0.1).toLocaleString('ru-RU')} ₽ (10%)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 glass h-12 rounded-pill text-white/60 hover:text-white font-semibold transition-colors text-sm">
              Изменить
            </button>
            <button onClick={handlePublish} className="flex-1 btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2">
              <Icon name="Rocket" size={16} />
              Опубликовать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
