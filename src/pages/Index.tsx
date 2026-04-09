import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import TopupModal from '@/components/TopupModal';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import ProfilePage from '@/pages/ProfilePage';
import SellPage from '@/pages/SellPage';
import Icon from '@/components/ui/icon';
import { Product, CartItem, User, PRODUCTS } from '@/store/useStore';

type Page = 'home' | 'catalog' | 'product' | 'profile' | 'sell';

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [extraProducts, setExtraProducts] = useState<Product[]>([]);

  const allProducts = [...PRODUCTS, ...extraProducts];

  const navigate = useCallback((target: string, data?: unknown) => {
    if (target === 'product' && data) {
      setSelectedProduct(data as Product);
      setPage('product');
    } else if (target === 'profile' || target === 'sell') {
      if (!user) { setAuthOpen(true); return; }
      setPage(target as Page);
    } else {
      setPage(target as Page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  const handleAddToCart = useCallback((product: Product, _event: React.MouseEvent) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleUpdateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== id));
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleBuyNow = useCallback((product: Product) => {
    handleAddToCart(product, {} as React.MouseEvent);
    setCartOpen(true);
  }, [handleAddToCart]);

  const handleTopup = useCallback((amount: number, method: 'sbp' | 'card') => {
    setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : prev);
  }, []);

  const handlePublishProduct = useCallback((product: Product) => {
    setExtraProducts(prev => [...prev, product]);
    setUser(prev => prev ? { ...prev, myProducts: [...prev.myProducts, product] } : prev);
  }, []);

  const handleDeleteMyProduct = useCallback((id: number) => {
    setExtraProducts(prev => prev.filter(p => p.id !== id));
    setUser(prev => prev ? { ...prev, myProducts: prev.myProducts.filter(p => p.id !== id) } : prev);
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const NAV_ITEMS = [
    { id: 'home', icon: 'Home', label: 'Главная' },
    { id: 'catalog', icon: 'Grid3X3', label: 'Каталог' },
    { id: 'cart', icon: 'ShoppingCart', label: 'Корзина', badge: cartCount },
    { id: 'profile', icon: 'User', label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        isLoggedIn={!!user}
        userName={user?.name}
        onNavigate={navigate}
        currentPage={page}
        onSearch={handleSearch}
      />

      <main>
        {page === 'home' && (
          <HomePage
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onNavigate={navigate}
            onSearch={handleSearch}
          />
        )}
        {page === 'catalog' && (
          <CatalogPage
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            initialSearch={searchQuery}
            extraProducts={extraProducts}
          />
        )}
        {page === 'product' && selectedProduct && (
          <ProductPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={() => setPage('catalog')}
            onNavigate={navigate}
          />
        )}
        {page === 'profile' && user && (
          <ProfilePage
            user={user}
            onLogout={() => { setUser(null); setPage('home'); }}
            onNavigate={navigate}
            onTopupOpen={() => setTopupOpen(true)}
            onSell={() => navigate('sell')}
            onDeleteProduct={handleDeleteMyProduct}
          />
        )}
        {page === 'sell' && user && (
          <SellPage
            user={user}
            onPublish={handlePublishProduct}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-30"
        style={{ background: 'rgba(10,10,15,0.95)', borderTop: '1px solid rgba(255,45,155,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 -4px 30px rgba(255,45,155,0.08)' }}>
        <div className="flex">
          {NAV_ITEMS.map(item => {
            const isActive = item.id !== 'cart' && page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'cart') setCartOpen(true);
                  else navigate(item.id);
                }}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all duration-200"
                style={{ color: isActive ? '#FF2D9B' : 'rgba(255,255,255,0.3)' }}
              >
                <div className="relative">
                  <Icon name={item.icon} size={20} />
                  {item.badge ? (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 text-black text-[9px] font-black rounded-full flex items-center justify-center px-0.5"
                      style={{ background: '#FF2D9B', boxShadow: '0 0 8px rgba(255,45,155,0.8)' }}>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onCheckout={() => { setCartOpen(false); if (!user) setAuthOpen(true); }}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={setUser}
      />

      {user && (
        <TopupModal
          open={topupOpen}
          onClose={() => setTopupOpen(false)}
          currentBalance={user.balance}
          onTopup={handleTopup}
        />
      )}
    </div>
  );
}