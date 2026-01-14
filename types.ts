
export interface SlotOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CustomizationSlot {
  name: string;
  options: SlotOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  material: string;
  dimensions: string;
  slots?: CustomizationSlot[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, SlotOption>;
  totalPrice: number;
}

export type AppView = 'home' | 'shop' | 'ai-studio' | 'dashboard' | 'wishlist';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AIRecommendation {
  productId: string;
  reason: string;
  stylingTip: string;
}
