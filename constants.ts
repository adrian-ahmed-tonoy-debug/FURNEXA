
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nordic Velvet Armchair',
    price: 899,
    category: 'Seating',
    description: 'A masterpiece of Scandinavian design featuring premium velvet upholstery and solid oak legs.',
    image: 'https://images.unsplash.com/photo-1598191950976-421222af685e?auto=format&fit=crop&q=80&w=800',
    material: 'Velvet, Oak',
    dimensions: '85cm x 80cm x 90cm',
    slots: [
      {
        name: 'Upholstery',
        options: [
          { id: 'v1', name: 'Emerald Velvet', priceModifier: 0 },
          { id: 'v2', name: 'Royal Blue Velvet', priceModifier: 50 },
          { id: 'v3', name: 'Cloud Grey Linen', priceModifier: -30 },
        ]
      },
      {
        name: 'Leg Finish',
        options: [
          { id: 'l1', name: 'Natural Oak', priceModifier: 0 },
          { id: 'l2', name: 'Smoked Walnut', priceModifier: 45 },
          { id: 'l3', name: 'Matte Black Steel', priceModifier: 20 },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Metropolis Marble Dining Table',
    price: 2450,
    category: 'Tables',
    description: 'Hand-cut Italian Carrara marble top supported by a minimalist brushed brass architectural base.',
    image: 'https://images.unsplash.com/photo-1577146333195-66049ac1164a?auto=format&fit=crop&q=80&w=800',
    material: 'Carrara Marble, Brass',
    dimensions: '220cm x 100cm x 75cm',
    slots: [
      {
        name: 'Top Surface',
        options: [
          { id: 'm1', name: 'Carrara White', priceModifier: 0 },
          { id: 'm2', name: 'Nero Marquina Black', priceModifier: 350 },
          { id: 'm3', name: 'Calacatta Gold', priceModifier: 800 },
        ]
      },
      {
        name: 'Base Detail',
        options: [
          { id: 'b1', name: 'Brushed Brass', priceModifier: 0 },
          { id: 'b2', name: 'Polished Chrome', priceModifier: 0 },
          { id: 'b3', name: 'Gunmetal Grey', priceModifier: 120 },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Suede Horizon Sofa',
    price: 3200,
    category: 'Seating',
    description: 'The ultimate in comfort. Deep-seated design with modular sections to fit any living space perfectly.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    material: 'Suede, Steel',
    dimensions: '300cm x 110cm x 70cm',
    slots: [
      {
        name: 'Configuration',
        options: [
          { id: 'c1', name: 'Standard 3-Seater', priceModifier: 0 },
          { id: 'c2', name: 'L-Shape Right', priceModifier: 650 },
          { id: 'c3', name: 'U-Shape Grand', priceModifier: 1800 },
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Eclipse Pendant Lamp',
    price: 420,
    category: 'Lighting',
    description: 'A dramatic orb of smoked glass that creates a warm, diffused atmosphere for elegant evenings.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    material: 'Smoked Glass, Matte Black Iron',
    dimensions: '45cm Diameter'
  },
  {
    id: '5',
    name: 'Zenith Walnut Sideboard',
    price: 1650,
    category: 'Storage',
    description: 'Slatted walnut panels hide ample storage space while maintaining a sleek, modern silhouette.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    material: 'Walnut, Ash Wood',
    dimensions: '180cm x 45cm x 85cm'
  },
  {
    id: '6',
    name: 'Astral Wool Rug',
    price: 780,
    category: 'Decor',
    description: 'Hand-woven New Zealand wool with organic patterns inspired by lunar topography.',
    image: 'https://images.unsplash.com/photo-1531835673320-94d7756f66c2?auto=format&fit=crop&q=80&w=800',
    material: 'New Zealand Wool',
    dimensions: '240cm x 300cm'
  }
];

export const CATEGORIES = ['All', 'Seating', 'Tables', 'Lighting', 'Storage', 'Decor'];
