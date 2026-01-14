
import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount, onCartClick }) => {
  const navLinks = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'shop', label: 'Shop', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'wishlist', label: 'Saved', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'ai-studio', label: 'Studio', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-[60] border-b border-stone-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-2xl font-black tracking-tighter text-stone-900 serif">FURNEXA.</button>
          
          <div className="flex items-center space-x-10">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setView(link.id as AppView)}
                className={`text-xs font-bold uppercase tracking-widest transition-all ${
                  currentView === link.id ? 'text-stone-900 border-b border-stone-900 pb-1' : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => setView('dashboard')} className="text-xs font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest">Insights</button>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={onCartClick} className="relative p-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 z-[70] md:hidden px-6 h-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center h-full">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setView(link.id as AppView)}
              className={`flex flex-col items-center space-y-1 transition-all ${
                currentView === link.id ? 'text-stone-900 scale-110' : 'text-stone-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
            </button>
          ))}
          <button onClick={onCartClick} className="relative flex flex-col items-center space-y-1 text-stone-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 right-0 bg-stone-900 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
