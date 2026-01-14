
import React, { useState, useMemo, useEffect } from 'react';
import { AppView, Product, CartItem, SlotOption, ChatMessage } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AIDesignAssistant from './components/AIDesignAssistant';
import Dashboard from './components/Dashboard';
import Cart from './components/Cart';
import DesignerChat from './components/DesignerChat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialOptions, setInitialOptions] = useState<Record<string, SlotOption> | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  // Handle Shared Links on Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    
    if (productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        const preSelected: Record<string, SlotOption> = {};
        product.slots?.forEach(slot => {
          const optId = params.get(slot.name);
          if (optId) {
            const foundOpt = slot.options.find(o => o.id === optId);
            if (foundOpt) preSelected[slot.name] = foundOpt;
          }
        });
        
        setSelectedProduct(product);
        if (Object.keys(preSelected).length > 0) {
          setInitialOptions(preSelected);
        }
      }
    }
  }, []);

  const addToCart = (product: Product, options?: Record<string, SlotOption>, customPrice?: number) => {
    const configId = options ? (Object.values(options) as SlotOption[]).map(o => o.id).join('-') : 'default';
    const finalPrice = customPrice !== undefined ? customPrice : product.price;

    setCart(prev => {
      const existing = prev.find(item => {
        const itemConfigId = item.selectedOptions ? (Object.values(item.selectedOptions) as SlotOption[]).map(o => o.id).join('-') : 'default';
        return item.id === product.id && itemConfigId === configId;
      });

      if (existing) {
        return prev.map(item => {
          const itemConfigId = item.selectedOptions ? (Object.values(item.selectedOptions) as SlotOption[]).map(o => o.id).join('-') : 'default';
          if (item.id === product.id && itemConfigId === configId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      return [...prev, { ...product, quantity: 1, selectedOptions: options, totalPrice: finalPrice }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const removeFromCart = (id: string, configId?: string) => {
    setCart(prev => prev.filter(item => {
      const itemConfigId = item.selectedOptions ? (Object.values(item.selectedOptions) as SlotOption[]).map(o => o.id).join('-') : 'default';
      return !(item.id === id && itemConfigId === (configId || 'default'));
    }));
  };

  const updateQuantity = (id: string, delta: number, configId?: string) => {
    setCart(prev => prev.map(item => {
      const itemConfigId = item.selectedOptions ? (Object.values(item.selectedOptions) as SlotOption[]).map(o => o.id).join('-') : 'default';
      if (item.id === id && itemConfigId === (configId || 'default')) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      if (cat === 'All') return ['All'];
      const filtered = prev.filter(c => c !== 'All');
      if (filtered.includes(cat)) {
        const next = filtered.filter(c => c !== cat);
        return next.length === 0 ? ['All'] : next;
      }
      return [...filtered, cat];
    });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(p.category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategories, priceRange]);

  const wishlistProducts = useMemo(() => 
    PRODUCTS.filter(p => wishlist.includes(p.id)), [wishlist]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-stone-200">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-grow pt-20 pb-24 md:pb-0">
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-700">
            <Hero onExplore={() => setCurrentView('shop')} />
            <section className="max-w-7xl mx-auto px-4 py-20">
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl md:text-5xl font-bold serif">Curated for You</h2>
                <button onClick={() => setCurrentView('shop')} className="text-sm font-bold uppercase tracking-widest underline decoration-stone-200 underline-offset-8 hover:decoration-stone-800 transition-all">Explore All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PRODUCTS.slice(0, 3).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={wishlist.includes(product.id)}
                    onWishlist={() => toggleWishlist(product.id)}
                    onView={() => setSelectedProduct(product)}
                    onAdd={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-12">
              <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit space-y-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Discovery</h3>
                  <input 
                    type="text" 
                    placeholder="Search collection..."
                    className="w-full bg-white border border-stone-100 px-4 py-3 text-sm focus:ring-1 focus:ring-stone-400 rounded-sm outline-none shadow-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Categories</h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`text-left px-4 py-2 text-sm transition-all rounded-sm border ${
                          selectedCategories.includes(cat)
                          ? 'bg-stone-900 border-stone-900 text-white font-medium shadow-md'
                          : 'bg-white border-stone-100 text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Price Ceiling</h3>
                    <span className="text-xs font-mono text-stone-900 font-bold">${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" min="0" max="5000" step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </aside>

              <div className="flex-grow">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} product={product} 
                        isWishlisted={wishlist.includes(product.id)}
                        onWishlist={() => toggleWishlist(product.id)}
                        onView={() => setSelectedProduct(product)}
                        onAdd={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center bg-white border border-stone-100 rounded-sm">
                    <p className="text-stone-400 italic serif text-2xl mb-6">No pieces found.</p>
                    <button onClick={() => { setSelectedCategories(['All']); setPriceRange([0, 5000]); setSearchQuery(''); }} className="bg-stone-900 text-white px-8 py-3 text-xs font-bold tracking-widest uppercase">Clear Filters</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-500">
             <h2 className="text-4xl font-bold mb-12 serif">Your Favorites</h2>
             {wishlistProducts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                 {wishlistProducts.map(product => (
                    <ProductCard 
                      key={product.id} product={product} 
                      isWishlisted={true}
                      onWishlist={() => toggleWishlist(product.id)}
                      onView={() => setSelectedProduct(product)}
                      onAdd={() => setSelectedProduct(product)}
                    />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20">
                 <p className="text-stone-400 italic mb-8">You haven't saved any pieces yet.</p>
                 <button onClick={() => setCurrentView('shop')} className="border border-stone-900 px-8 py-3 text-xs font-bold uppercase tracking-widest">Discover Collection</button>
               </div>
             )}
          </div>
        )}

        {currentView === 'ai-studio' && <AIDesignAssistant onProductClick={(id) => setSelectedProduct(PRODUCTS.find(p => p.id === id) || null)} />}
        {currentView === 'dashboard' && <Dashboard />}
      </main>

      <footer className="hidden md:block bg-stone-900 text-stone-400 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-white text-3xl font-bold mb-6 serif tracking-tight">FURNEXA</h3>
            <p className="max-w-sm text-stone-500 leading-relaxed">Redefining interiors through high-intelligence design and timeless craftsmanship. Join the furniture revolution.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors">Collection</button></li>
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">Sustainability</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Connect</h4>
            <p className="text-sm">studio@furnexa.com</p>
            <p className="text-sm mt-2">+39 02 123 4567</p>
          </div>
        </div>
      </footer>

      {/* Global AI Chatbot */}
      <DesignerChat onNavigate={setCurrentView} onProductSelect={setSelectedProduct} />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          initialOptions={initialOptions}
          onClose={() => { setSelectedProduct(null); setInitialOptions(undefined); }} 
          onAdd={addToCart} 
          onProductSelect={(p) => { setSelectedProduct(p); setInitialOptions(undefined); }}
        />
      )}
      {isCartOpen && <Cart items={cart} onClose={() => setIsCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQuantity} />}
    </div>
  );
};

export default App;
