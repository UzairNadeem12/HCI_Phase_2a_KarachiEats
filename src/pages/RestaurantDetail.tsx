import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Clock, Bike, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import CartButton from '@/components/CartButton';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

import raitaImg from '@/assets/raita.jpg';
import naanImg from '@/assets/naan.jpg';
import garlicBreadImg from '@/assets/garlic-bread.jpg';

// Dummy menu data
const menuItems = {
  '1': [
    { id: 'm1', name: 'Chicken Biryani', price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', description: 'Aromatic rice with tender chicken' },
    { id: 'm2', name: 'Mutton Biryani', price: 450, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400', description: 'Rich and flavorful mutton biryani' },
    { id: 'm3', name: 'Raita', price: 80, image: raitaImg, description: 'Cooling yogurt side dish' },
  ],
  '2': [
    { id: 'm4', name: 'Margherita Pizza', price: 600, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', description: 'Classic tomato and mozzarella' },
    { id: 'm5', name: 'Pepperoni Pizza', price: 750, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', description: 'Loaded with pepperoni' },
    { id: 'm6', name: 'Garlic Bread', price: 200, image: garlicBreadImg, description: 'Crispy garlic bread sticks' },
  ],
  '4': [
    { id: 'm7', name: 'Seekh Kebab', price: 280, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', description: 'Grilled minced meat skewers' },
    { id: 'm8', name: 'Chicken Tikka', price: 320, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400', description: 'Marinated grilled chicken' },
    { id: 'm9', name: 'Naan', price: 40, image: naanImg, description: 'Fresh tandoor bread' },
  ],
  '5': [
    { id: 'm10', name: 'Classic Burger', price: 350, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Beef patty with cheese' },
    { id: 'm11', name: 'Chicken Burger', price: 320, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', description: 'Crispy chicken burger' },
    { id: 'm12', name: 'Fries', price: 150, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400', description: 'Golden crispy fries' },
  ],
};

const restaurantData: Record<string, any> = {
  '1': { name: 'Biryani House', cuisine: 'Pakistani, Biryani', rating: 4.5, deliveryTime: '25-35', deliveryFee: 50 },
  '2': { name: 'Pizza Paradise', cuisine: 'Italian, Fast Food', rating: 4.3, deliveryTime: '30-40', deliveryFee: 70 },
  '4': { name: 'Desi Delights', cuisine: 'Pakistani, BBQ', rating: 4.6, deliveryTime: '35-45', deliveryFee: 60 },
  '5': { name: 'Burger Barn', cuisine: 'Fast Food, Burgers', rating: 4.2, deliveryTime: '20-30', deliveryFee: 45 },
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, settings } = useApp();
  const { speak } = useVoice();
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const restaurant = restaurantData[id || '1'];
  const menu = menuItems[id as keyof typeof menuItems] || menuItems['1'];

  const isLargeText = settings.largeText;

  // Announce when restaurant detail page loads
  useEffect(() => {
    speak(`You are now viewing ${restaurant.name}'s menu`);
  }, [id, speak, restaurant.name]);

  const handleAddToCart = (item: typeof menu[0]) => {
    const qty = quantities[item.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: id || '1',
        image: item.image,
        deliveryFee: restaurant.deliveryFee,
      });
    }
    toast.success(`${qty} x ${item.name} added to cart`);
    speak(`You have added ${qty} x ${item.name} to cart`);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} size={isLargeText ? "lg" : "default"}>
              <ArrowLeft className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-2`}>
            {restaurant.name}
          </h1>
          <p className={`text-muted-foreground mb-4 ${isLargeText ? 'text-lg' : ''}`}>
            {restaurant.cuisine}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'} fill-warning text-warning`} />
              <span className={`font-medium ${isLargeText ? 'text-base' : ''}`}>{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
              <span className={isLargeText ? 'text-base' : ''}>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bike className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
              <span className={isLargeText ? 'text-base' : ''}>Rs. {restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <main className="container mx-auto px-4 py-6">
        <h2 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'} mb-6`}>
          Menu
        </h2>
        
        <div className="space-y-4">
          {menu.map(item => (
            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={`${isLargeText ? 'w-full sm:w-32 h-32' : 'w-full sm:w-24 h-24'} object-cover rounded-lg flex-shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-lg'} mb-1`}>
                    {item.name}
                  </h3>
                  <p className={`text-muted-foreground mb-2 ${isLargeText ? 'text-base' : 'text-sm'}`}>
                    {item.description}
                  </p>
                  <p className={`font-bold text-primary ${isLargeText ? 'text-xl' : 'text-lg'}`}>
                    Rs. {item.price}
                  </p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size={isLargeText ? "default" : "icon"}
                      onClick={() => updateQuantity(item.id, -1)}
                      className={isLargeText ? 'h-12 w-12' : ''}
                    >
                      <Minus className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </Button>
                    <span className={`min-w-[2rem] text-center font-medium ${isLargeText ? 'text-xl' : ''}`}>
                      {quantities[item.id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size={isLargeText ? "default" : "icon"}
                      onClick={() => updateQuantity(item.id, 1)}
                      className={isLargeText ? 'h-12 w-12' : ''}
                    >
                      <Plus className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </Button>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(item)}
                    size={isLargeText ? "default" : "default"}
                    className={`${isLargeText ? 'h-12 px-6' : ''} whitespace-nowrap`}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      <CartButton />
    </div>
  );
};

export default RestaurantDetail;
