
import React from 'react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <div className="relative h-[90vh] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
        className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
        alt="Hero Furniture"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
            Artistry for the <br /><span className="italic">Modern Home</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto font-light tracking-wide">
            Discover a collection where architectural precision meets organic elegance. 
            Crafted by masters, designed for life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onExplore}
              className="bg-white text-stone-900 px-10 py-4 font-semibold hover:bg-stone-100 transition-colors uppercase tracking-widest text-sm"
            >
              Shop Collection
            </button>
            <button 
              onClick={() => document.getElementById('ai-studio')?.scrollIntoView()}
              className="backdrop-blur-md bg-white/10 border border-white/30 text-white px-10 py-4 font-semibold hover:bg-white/20 transition-colors uppercase tracking-widest text-sm"
            >
              Design with AI
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Hero;
