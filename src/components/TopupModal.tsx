import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/store/useStore';

interface TopupModalProps {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
  onTopup: (amount: number, method: 'sbp' | 'card') => void;
}

const PRESETS = [500, 1000, 2000, 5000];

const CARD_ICONS: Record<string, string> = {
  '2': '🟠', // Мир
  '4': '💙', // Visa
  '5': '🔴', // MC
};

export default function TopupModal({ open, onClose, currentBalance, onTopup }: TopupModalProps) {
  const [method, setMethod] = useState<'sbp' | 'card'>('sbp');
  const [amount, setAmount] = useState('1000');
  const [step, setStep] = useState<'form' | 'sbp_qr' | 'card_form' | 'success'>('form');
  const [cardNum, setCardNum] = useState('');
  const [cardDate, setCardDate] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const amountNum = parseInt(amount) || 0;

  const formatCard = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatDate = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  };

  const handleProceed = async () => {
    if (amountNum < 100) return;
    if (method === 'sbp') {
      setStep('sbp_qr');
    } else {
      setStep('card_form');
    }
  };

  const handleCardPay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep('success');
    setTimeout(() => {
      onTopup(amountNum, 'card');
      onClose();
      setStep('form');
      setCardNum(''); setCardDate(''); setCardCvc('');
    }, 1800);
  };

  const handleSbpPaid = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('success');
    setTimeout(() => {
      onTopup(amountNum, 'sbp');
      onClose();
      setStep('form');
    }, 1800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep('form'); setLoading(false); }, 300);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={handleClose} />

      <div className="relative w-full max-w-md glass rounded-3xl p-7 animate-scale-in shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <button onClick={handleClose} className="absolute top-5 right-5 w-8 h-8 glass rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={16} />
        </button>

        {/* Success state */}
        {step === 'success' && (
          <div className="text-center py-8 space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
              <Icon name="Check" size={32} className="text-green-400" />
            </div>
            <h2 className="font-heading text-2xl text-white font-bold">ПОПОЛНЕНО!</h2>
            <p className="text-white/50 text-sm">
              {formatPrice(amountNum)} зачислено на ваш баланс
            </p>
          </div>
        )}

        {/* Main form */}
        {step === 'form' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl text-white font-bold tracking-tight">ПОПОЛНЕНИЕ</h2>
              <p className="text-white/40 text-sm mt-1">Текущий баланс: <span className="text-white font-mono">{formatPrice(currentBalance)}</span></p>
            </div>

            {/* Method toggle */}
            <div className="flex glass rounded-pill p-1 gap-1">
              <button
                onClick={() => setMethod('sbp')}
                className={`flex-1 h-10 rounded-pill text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${method === 'sbp' ? 'btn-gradient text-white' : 'text-white/40 hover:text-white'}`}
              >
                <span className="text-base">⚡</span> СБП
              </button>
              <button
                onClick={() => setMethod('card')}
                className={`flex-1 h-10 rounded-pill text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${method === 'card' ? 'btn-gradient text-white' : 'text-white/40 hover:text-white'}`}
              >
                <Icon name="CreditCard" size={15} /> Карта
              </button>
            </div>

            {/* Method description */}
            <div className="glass rounded-xl px-4 py-3 flex items-start gap-3">
              {method === 'sbp' ? (
                <>
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-white text-sm font-medium">Система быстрых платежей</p>
                    <p className="text-white/40 text-xs mt-0.5">Мгновенный перевод с любой карты МИР, СберПэй, ВТБ и других банков. Без комиссии.</p>
                  </div>
                </>
              ) : (
                <>
                  <Icon name="CreditCard" size={22} className="text-cyber-blue mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Банковская карта</p>
                    <p className="text-white/40 text-xs mt-0.5">Visa, Mastercard, МИР. Данные защищены шифрованием. Комиссия 0%.</p>
                  </div>
                </>
              )}
            </div>

            {/* Amount input */}
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest block mb-2">Сумма пополнения</label>
              <div className="relative flex items-center glass rounded-xl h-14">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white text-2xl font-mono font-bold pl-5 pr-2 outline-none"
                  min={100}
                  max={100000}
                />
                <span className="pr-5 text-white/40 text-xl font-mono">₽</span>
              </div>
              {amountNum < 100 && amountNum > 0 && (
                <p className="text-red-400/70 text-xs mt-1">Минимальная сумма — 100 ₽</p>
              )}
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className={`flex-1 h-9 rounded-xl text-sm font-mono font-medium transition-all duration-200 ${
                    amount === String(p) ? 'btn-gradient text-white' : 'glass text-white/50 hover:text-white'
                  }`}
                >
                  {p.toLocaleString('ru-RU')}
                </button>
              ))}
            </div>

            <button
              onClick={handleProceed}
              disabled={amountNum < 100}
              className="w-full btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Icon name="Zap" size={16} />
              Пополнить {amountNum >= 100 ? formatPrice(amountNum) : ''}
            </button>

            <p className="text-center text-white/15 text-xs">Данные защищены SSL · ФЗ-161 · PCI DSS</p>
          </div>
        )}

        {/* SBP QR */}
        {step === 'sbp_qr' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('form')} className="text-white/40 hover:text-white transition-colors">
                <Icon name="ArrowLeft" size={18} />
              </button>
              <div>
                <h2 className="font-heading text-xl text-white font-bold">ОПЛАТА СБП</h2>
                <p className="text-white/40 text-xs">Отсканируйте QR или откройте в приложении банка</p>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center mx-auto">
                <div className="w-full h-full rounded-lg relative overflow-hidden">
                  {/* Fake QR pattern */}
                  <div className="grid grid-cols-7 gap-0.5 p-1 w-full h-full">
                    {Array.from({length: 49}).map((_, i) => (
                      <div key={i} className={`rounded-sm ${
                        [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,8,15,22,9,16,23,30,37,11,18,25,32,39,24,31,38].includes(i)
                          ? 'bg-[#0B0E14]' : 'bg-transparent'
                      }`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white font-mono font-bold text-2xl">{formatPrice(amountNum)}</p>
                <p className="text-white/30 text-xs mt-1">Получатель: ByteBay · ИНН 7701234567</p>
              </div>

              <div className="w-full glass rounded-xl p-4 space-y-2">
                {['Сбербанк', 'ВТБ', 'Тинькофф', 'Альфа-Банк'].map(bank => (
                  <button key={bank} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/60 hover:text-white">
                    <span>{bank}</span>
                    <Icon name="ExternalLink" size={14} />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSbpPaid}
              disabled={loading}
              className="w-full btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2"
            >
              {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <><Icon name="Check" size={16} /> Я оплатил</>}
            </button>
          </div>
        )}

        {/* Card form */}
        {step === 'card_form' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('form')} className="text-white/40 hover:text-white transition-colors">
                <Icon name="ArrowLeft" size={18} />
              </button>
              <div>
                <h2 className="font-heading text-xl text-white font-bold">ДАННЫЕ КАРТЫ</h2>
                <p className="text-white/40 text-xs">Оплата {formatPrice(amountNum)}</p>
              </div>
            </div>

            {/* Card preview */}
            <div className="rounded-2xl p-5 relative overflow-hidden h-36" style={{ background: 'var(--grad-main)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">ByteBay Pay</span>
                  <span className="text-2xl">{CARD_ICONS[cardNum.replace(/\s/g, '')[0]] || '💳'}</span>
                </div>
                <div>
                  <p className="font-mono text-white text-lg tracking-[0.15em]">
                    {cardNum || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/50 text-xs font-mono">{cardDate || 'MM/YY'}</span>
                    <span className="text-white/50 text-xs font-mono">{cardCvc ? '•••' : 'CVC'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-white/35 text-xs mb-1.5 block">Номер карты</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full glass rounded-xl h-11 px-4 text-white font-mono text-sm placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                  inputMode="numeric"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-white/35 text-xs mb-1.5 block">Срок</label>
                  <input
                    value={cardDate}
                    onChange={e => setCardDate(formatDate(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full glass rounded-xl h-11 px-4 text-white font-mono text-sm placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white/35 text-xs mb-1.5 block">CVC / CVV</label>
                  <input
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    type="password"
                    className="w-full glass rounded-xl h-11 px-4 text-white font-mono text-sm placeholder:text-white/20 outline-none focus:shadow-[0_0_0_2px_rgba(42,109,244,0.3)] transition-all"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCardPay}
              disabled={loading || cardNum.replace(/\s/g, '').length < 16 || cardDate.length < 5 || cardCvc.length < 3}
              className="w-full btn-gradient h-12 rounded-pill text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading
                ? <Icon name="Loader2" size={18} className="animate-spin" />
                : <><Icon name="Lock" size={16} /> Оплатить {formatPrice(amountNum)}</>
              }
            </button>

            <div className="flex items-center justify-center gap-3 text-white/15 text-xs">
              <Icon name="Lock" size={12} />
              <span>SSL 256-bit · PCI DSS Level 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
