
import React, { useState, useEffect, useMemo } from 'react';
import { Product, SlotOption } from '../types';
import { PRODUCTS } from '../constants';

interface ProductModalProps {
  product: Product;
  initialOptions?: Record<string, SlotOption>;
  onClose: () => void;
  onAdd: (product: Product, selectedOptions: Record<string, SlotOption>, totalPrice: number) => void;
  onProductSelect?: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, initialOptions, onClose, onAdd, onProductSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SlotOption>>({});
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Initialize with either shared options or defaults
  useEffect(() => {
    if (initialOptions && Object.keys(initialOptions).length > 0) {
      setSelectedOptions(initialOptions);
    } else if (product.slots) {
      const defaults: Record<string, SlotOption> = {};
      product.slots.forEach(slot => {
        defaults[slot.name] = slot.options[0];
      });
      setSelectedOptions(defaults);
    } else {
      setSelectedOptions({});
    }
  }, [product, initialOptions]);

  // Recalculate price whenever options change
  useEffect(() => {
    const optionsArray = Object.values(selectedOptions) as SlotOption[];
    const modifierSum = optionsArray.reduce((sum, opt) => sum + (opt?.priceModifier || 0), 0);
    setTotalPrice(product.price + modifierSum);
  }, [selectedOptions, product.price]);

  // Sync state to URL in real-time
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('productId', product.id);
    
    (Object.entries(selectedOptions) as [string, SlotOption][]).forEach(([slot, opt]) => {
      if (opt?.id) params.set(slot, opt.id);
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);

    // Cleanup: remove params when modal closes (unmounts)
    return () => {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    };
  }, [selectedOptions, product.id]);

  const handleOptionSelect = (slotName: string, option: SlotOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [slotName]: option
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 3000);
    });
  };

  const relatedProducts = useMemo(() => {
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);
    if (related.length < 3) {
      const others = PRODUCTS.filter(p => p.category !== product.category && p.id !== product.id);
      return [...related, ...others].slice(0, 3);
    }
    return related.slice(0, 3);
  }, [product]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-full md:h-[90vh] rounded-sm overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 fade-in duration-300 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-3/5 relative overflow-hidden bg-stone-100 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 border border-stone-100 hidden md:block">
             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Live Selection</p>
             <div className="flex flex-wrap gap-x-4 gap-y-1">
               {Object.entries(selectedOptions).length > 0 ? (
                 (Object.entries(selectedOptions) as [string, SlotOption][]).map(([slot, opt]) => (
                   <span key={slot} className="text-xs font-medium text-stone-800">{slot}: {opt.name}</span>
                 ))
               ) : (
                 <span className="text-xs font-medium text-stone-800">Standard Edition</span>
               )}
             </div>
          </div>
        </div>

        <div className="md:w-2/5 flex flex-col h-full bg-white">
          <div className="flex-grow p-8 md:p-12 overflow-y-auto">
            <div className="mb-8">
              <span className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-2 block">
                {product.category}
              </span>
              <h2 className="text-4xl font-bold mb-4 serif leading-tight">{product.name}</h2>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-light text-stone-900">${totalPrice.toLocaleString()}</p>
                {totalPrice !== product.price && (
                  <p className="text-sm text-stone-400 font-medium">Base: ${product.price.toLocaleString()}</p>
                )}
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed mb-8 text-lg font-light">
              {product.description}
            </p>

            {/* Architectural Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100 mb-10 overflow-hidden rounded-sm shadow-inner">
              <div className="bg-stone-50 p-6 flex flex-col justify-center">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 mb-2">Architectural Material</h4>
                <p className="text-sm text-stone-900 font-bold uppercase tracking-tight">{product.material}</p>
              </div>
              <div className="bg-stone-50 p-6 flex flex-col justify-center">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 mb-2">Master Dimensions</h4>
                <p className="text-sm text-stone-900 font-mono font-medium">{product.dimensions}</p>
              </div>
            </div>

            {/* Customization Slots */}
            {product.slots && product.slots.length > 0 && (
              <div className="space-y-10 mb-10">
                {product.slots.map(slot => (
                  <div key={slot.name}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{slot.name}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {slot.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionSelect(slot.name, opt)}
                          className={`flex justify-between items-center p-4 border rounded-sm transition-all text-sm ${
                            selectedOptions[slot.name]?.id === opt.id
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-white'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span className={selectedOptions[slot.name]?.id === opt.id ? 'text-stone-300' : 'text-stone-400'}>
                            {opt.priceModifier === 0 ? 'Inc.' : `${opt.priceModifier > 0 ? '+' : '-'}$${Math.abs(opt.priceModifier)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-stone-100 pt-8 mt-10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Price List Breakdown</h4>
                <button 
                  onClick={handleCopyLink}
                  className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-400 hover:border-stone-400 transition-all"
                >
                  {showCopyFeedback ? 'Link Copied!' : 'Copy Direct Link'}
                </button>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between text-sm">
                  <span className="text-stone-500">Base Frame</span>
                  <span className="font-mono">${product.price.toLocaleString()}</span>
                </li>
                {(Object.entries(selectedOptions) as [string, SlotOption][]).map(([slot, opt]) => (
                  <li key={slot} className="flex justify-between text-sm animate-in fade-in slide-in-from-bottom-1">
                    <span className="text-stone-500">{opt.name} ({slot})</span>
                    <span className="font-mono">
                      {opt.priceModifier >= 0 ? '+' : '-'}${Math.abs(opt.priceModifier).toLocaleString()}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between text-base font-bold pt-4 border-t border-stone-50 text-stone-900 mt-4">
                  <span>Total Investment</span>
                  <span className="font-mono">${totalPrice.toLocaleString()}</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-stone-100 pt-10 mt-12 pb-12">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-8">You Might Also Like</h4>
              <div className="space-y-6">
                {relatedProducts.map(rp => (
                  <div 
                    key={rp.id} 
                    onClick={() => onProductSelect?.(rp)}
                    className="flex items-center space-x-5 cursor-pointer group bg-stone-50/50 p-3 rounded-sm hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100"
                  >
                    <div className="w-20 h-24 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-stone-100 shadow-sm">
                      <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rp.name} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">{rp.category}</p>
                      <h5 className="text-sm font-bold text-stone-900 group-hover:underline leading-tight mb-2">{rp.name}</h5>
                      <span className="text-xs font-black font-mono text-stone-800">${rp.price.toLocaleString()}</span>
                    </div>
                    <div className="text-stone-300 group-hover:text-stone-900 transition-colors pr-2">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                       </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-stone-100 bg-stone-50 sticky bottom-0">
            <button 
              onClick={() => { onAdd(product, selectedOptions, totalPrice); onClose(); }}
              className="w-full bg-stone-900 text-white py-5 font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors shadow-lg active:scale-[0.98]"
            >
              Add Configuration to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
