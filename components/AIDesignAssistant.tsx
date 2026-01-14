
import React, { useState, useRef } from 'react';
import { analyzeRoomAndSuggest, generateVisualizerImage } from '../geminiService';
import { PRODUCTS } from '../constants';
import { AIRecommendation } from '../types';

interface AIDesignAssistantProps {
  onProductClick: (id: string) => void;
}

const AIDesignAssistant: React.FC<AIDesignAssistantProps> = ({ onProductClick }) => {
  const [image, setImage] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    recommendations: AIRecommendation[];
    overallFeedback: string;
  } | null>(null);
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !userInput) return;
    setLoading(true);
    setResults(null);
    setVisualizedImage(null);

    try {
      const response = await analyzeRoomAndSuggest(image || undefined, userInput);
      setResults(response);
      
      // Optionally generate a visualizer image if they didn't provide a photo
      if (!image) {
        const visual = await generateVisualizerImage(userInput);
        setVisualizedImage(visual);
      }
    } catch (error) {
      alert("Failed to analyze room. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-studio" className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4 serif">AI Interior Studio</h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Our advanced AI analyzes your space and preferences to suggest the perfect pieces from our collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Input Panel */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
          <div className="mb-8">
            <label className="block text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
              Step 1: Upload a Photo of your Room
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 aspect-video rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-colors overflow-hidden group"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="User room" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-300 group-hover:text-stone-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-stone-400 font-medium">Click to take or upload photo</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
              Step 2: Tell us your style or needs
            </label>
            <textarea
              className="w-full p-4 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-800 transition-colors h-32 resize-none"
              placeholder="e.g., 'I want a cozy reading nook' or 'Make this room look more industrial'..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (!image && !userInput)}
            className="w-full bg-stone-900 text-white py-5 font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:bg-stone-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing space...</span>
              </>
            ) : "Get AI Design Advice"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="space-y-8">
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-stone-100 border-dashed p-12 text-center text-stone-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-xl serif italic">Your AI recommendations will appear here.</p>
            </div>
          )}

          {results && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  AI Designer Assessment
                </h3>
                <p className="text-stone-800 italic leading-relaxed">
                  "{results.overallFeedback}"
                </p>
              </div>

              {visualizedImage && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
                    Concept Visualization
                  </h3>
                  <img src={visualizedImage} className="w-full rounded-sm shadow-lg border border-white" alt="Visualization" />
                </div>
              )}

              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">
                Recommended Pieces
              </h3>
              
              <div className="space-y-6">
                {results.recommendations.map((rec, idx) => {
                  const product = PRODUCTS.find(p => p.id === rec.productId);
                  if (!product) return null;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center space-x-6 bg-white p-4 rounded-sm border border-stone-100 group cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onProductClick(product.id)}
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover rounded-sm" alt={product.name} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-stone-900">{product.name}</h4>
                        <p className="text-xs text-stone-500 mb-2">{rec.reason}</p>
                        <p className="text-xs font-semibold text-stone-700 italic">Pro Tip: {rec.stylingTip}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-300 group-hover:text-stone-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesignAssistant;
