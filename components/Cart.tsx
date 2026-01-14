
import React from 'react';
import { CartItem, SlotOption } from '../types';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string, configId?: string) => void;
  onUpdateQty: (id: string, delta: number, configId?: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, onClose, onRemove, onUpdateQty }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  const freeShippingThreshold = 5000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const getConfigString = (item: CartItem) => {
    if (!item.selectedOptions) return '';
    return (Object.values(item.selectedOptions) as SlotOption[]).map(o => o.id).join('-');
  };

  const handleQuantityInput = (item: CartItem, configId: string, value: string) => {
    const newQty = parseInt(value, 10);
    if (!isNaN(newQty)) {
      // Calculate delta to work with existing updateQuantity logic
      const delta = Math.max(1, newQty) - item.quantity;
      onUpdateQty(item.id, delta, configId);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-20">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase">Your Bag</h2>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">{items.length} unique pieces</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-stone-50 rounded-full transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Dynamic Shipping Goal */}
        <div className="px-8 py-5 bg-stone-50 border-b border-stone-100">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
            <span className={progress === 100 ? 'text-green-600' : 'text-stone-500'}>
              {progress === 100 ? '✓ Complementary Delivery Earned' : 'Distance to Free Delivery'}
            </span>
            <span className="text-stone-900">${subtotal.toLocaleString()} / ${freeShippingThreshold.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-stone-900'}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          {progress < 100 && (
            <p className="text-[10px] text-stone-400 mt-2 italic font-medium">
              Add ${(freeShippingThreshold - subtotal).toLocaleString()} more for free shipping.
            </p>
          )}
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-12">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-300">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-xl serif italic text-stone-400">Your bag is awaiting curation.</p>
              <button onClick={onClose} className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-200 transition-all">Start Exploring</button>
            </div>
          ) : (
            items.map((item, idx) => {
              const configId = getConfigString(item);
              const itemSubtotal = item.totalPrice * item.quantity;
              
              return (
                <div key={`${item.id}-${configId}-${idx}`} className="group flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex space-x-6">
                    <div className="w-24 h-32 flex-shrink-0 bg-stone-50 rounded-sm overflow-hidden border border-stone-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-stone-900 leading-tight tracking-tight text-sm uppercase">{item.name}</h3>
                          <button 
                            onClick={() => onRemove(item.id, configId)} 
                            className="text-stone-300 hover:text-red-500 transition-colors p-1"
                            title="Remove from bag"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        
                        {item.selectedOptions && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {(Object.entries(item.selectedOptions) as [string, SlotOption][]).map(([slot, opt]) => (
                              <span key={slot} className="text-[8px] bg-stone-100 text-stone-500 px-2 py-1 rounded-sm font-black uppercase tracking-tighter">
                                {slot}: {opt.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shadow-sm group/qty">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1, configId)} 
                            className="w-10 h-10 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all font-bold text-lg"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          
                          {/* Advanced Quantity Input */}
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInput(item, configId, e.target.value)}
                            className="w-10 h-10 text-center font-mono text-xs font-black text-stone-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-stone-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Quantity"
                          />

                          <button 
                            onClick={() => onUpdateQty(item.id, 1, configId)} 
                            className="w-10 h-10 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all font-bold text-lg"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Subtotal</p>
                          <span className="text-sm font-black text-stone-900 font-mono">${itemSubtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-stone-100 space-y-6 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.03)]">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                <span>Order Subtotal</span>
                <span className="text-stone-600 font-mono">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                <span>Est. Taxes & Fees</span>
                <span className="text-stone-600 font-mono">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-stone-100">
                <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Total Investment</span>
                <span className="text-2xl text-stone-900 font-black font-mono tracking-tighter">${subtotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="w-full bg-stone-900 text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center space-x-3">
              <span>Checkout Securely</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            
            <div className="flex justify-center items-center space-x-2 opacity-30">
               <div className="h-px w-8 bg-stone-900" />
               <span className="text-[8px] font-black uppercase tracking-widest">FURNEXA Guarantee</span>
               <div className="h-px w-8 bg-stone-900" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
