
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlist: () => void;
  onView: () => void;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted, onWishlist, onView, onAdd }) => {
  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-white mb-5 rounded-sm shadow-sm transition-shadow hover:shadow-xl">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
        
        {/* Actions */}
        <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
           <button 
             onClick={(e) => { e.stopPropagation(); onWishlist(); }}
             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
               isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-stone-900 hover:bg-stone-900 hover:text-white'
             }`}
           >
             <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
           </button>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="absolute bottom-6 left-6 right-6 bg-stone-900 text-white py-4 text-[10px] font-black tracking-[0.2em] uppercase translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl hover:bg-white hover:text-stone-900"
        >
          Configure & Bag
        </button>
      </div>
      
      <div onClick={onView} className="cursor-pointer">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-bold text-stone-900 tracking-tight group-hover:underline decoration-stone-300 underline-offset-4">{product.name}</h3>
          <span className="text-sm font-black text-stone-900 font-mono">${product.price.toLocaleString()}</span>
        </div>
        <p className="text-[11px] text-stone-400 font-black uppercase tracking-widest">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
