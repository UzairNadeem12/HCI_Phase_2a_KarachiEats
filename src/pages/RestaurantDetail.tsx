import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Clock, Bike, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import CartButton from '@/components/CartButton';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

import raitaImg from '@/assets/raita.jpg';
import naanImg from '@/assets/naan.jpg';
import garlicBreadImg from '@/assets/garlic-bread.jpg';

// Dummy menu data with translation keys
const menuItemsData = {
  '1': [
    { id: 'm1', nameKey: 'chickenBiryani' as const, descKey: 'chickenBiryaniDesc' as const, price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
    { id: 'm2', nameKey: 'muttonBiryani' as const, descKey: 'muttonBiryaniDesc' as const, price: 450, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400' },
    { id: 'm3', nameKey: 'raita' as const, descKey: 'raitaDesc' as const, price: 80, image: raitaImg },
  ],
  '2': [
    { id: 'm4', nameKey: 'margheritaPizza' as const, descKey: 'margheritaPizzaDesc' as const, price: 600, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
    { id: 'm5', nameKey: 'pepperoniPizza' as const, descKey: 'pepperoniPizzaDesc' as const, price: 750, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { id: 'm6', nameKey: 'garlicBread' as const, descKey: 'garlicBreadDesc' as const, price: 200, image: garlicBreadImg },
  ],
  '4': [
    { id: 'm7', nameKey: 'seekhKebab' as const, descKey: 'seekhKebabDesc' as const, price: 280, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
    { id: 'm8', nameKey: 'chickenTikka' as const, descKey: 'chickenTikkaDesc' as const, price: 320, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
    { id: 'm9', nameKey: 'naan' as const, descKey: 'naanDesc' as const, price: 40, image: naanImg },
  ],
  '5': [
    { id: 'm10', nameKey: 'classicBurger' as const, descKey: 'classicBurgerDesc' as const, price: 350, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { id: 'm11', nameKey: 'chickenBurger' as const, descKey: 'chickenBurgerDesc' as const, price: 320, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
    { id: 'm12', nameKey: 'fries' as const, descKey: 'friesDesc' as const, price: 150, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400' },
  ],
};

const restaurantDataRaw: Record<string, any> = {
  '1': { nameKey: 'biryaniHouse', cuisineKey: 'cuisinePakistaniBiryani', rating: 4.5, deliveryTime: '25-35', deliveryFee: 50 },
  '2': { nameKey: 'pizzaParadise', cuisineKey: 'cuisineItalianFastFood', rating: 4.3, deliveryTime: '30-40', deliveryFee: 70 },
  '4': { nameKey: 'desiDelights', cuisineKey: 'cuisinePakistaniBBQ', rating: 4.6, deliveryTime: '35-45', deliveryFee: 60 },
  '5': { nameKey: 'burgerBarn', cuisineKey: 'cuisineFastFoodBurgers', rating: 4.2, deliveryTime: '20-30', deliveryFee: 45 },
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, settings } = useApp();
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const restaurantRaw = restaurantDataRaw[id || '1'];
  const restaurant = {
    ...restaurantRaw,
    name: t(restaurantRaw.nameKey as any),
    cuisine: t(restaurantRaw.cuisineKey as any),
  };
  
  const menuRaw = menuItemsData[id as keyof typeof menuItemsData] || menuItemsData['1'];
  const menu = menuRaw.map(item => ({
    ...item,
    name: t(item.nameKey),
    description: t(item.descKey),
  }));

  const isLargeText = settings.largeText;

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
    toast.success(`${qty} x ${item.name} ${t('itemAddedToCart')}`);
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
              {t('back')}
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
          {t('menu')}
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
                    {t('addToCart')}
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
