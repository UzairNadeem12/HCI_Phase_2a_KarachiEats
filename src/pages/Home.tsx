import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import CartButton from '@/components/CartButton';
import LocationPicker from '@/components/LocationPicker';

// Dummy restaurant data
const restaurants = [
  {
    id: '1',
    name: 'Biryani House',
    cuisine: 'Pakistani, Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    rating: 4.5,
    deliveryTime: '25-35',
    deliveryFee: 50,
    isOpen: true,
  },
  {
    id: '2',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Fast Food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    rating: 4.3,
    deliveryTime: '30-40',
    deliveryFee: 70,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Karachi Café',
    cuisine: 'Café, Snacks',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    rating: 4.7,
    deliveryTime: '20-30',
    deliveryFee: 40,
    isOpen: false,
  },
  {
    id: '4',
    name: 'Desi Delights',
    cuisine: 'Pakistani, BBQ',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
    rating: 4.6,
    deliveryTime: '35-45',
    deliveryFee: 60,
    isOpen: true,
  },
  {
    id: '5',
    name: 'Burger Barn',
    cuisine: 'Fast Food, Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.2,
    deliveryTime: '20-30',
    deliveryFee: 45,
    isOpen: true,
  },
  {
    id: '6',
    name: 'Sushi Station',
    cuisine: 'Japanese, Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    rating: 4.8,
    deliveryTime: '40-50',
    deliveryFee: 100,
    isOpen: false,
  },
];

const Home = () => {
  const { location, userGroup } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className={`font-medium ${isLargeText ? 'text-lg' : 'text-sm'}`}>
                {location}
              </span>
            </button>
            <CartButton />
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isIconFocused ? "🔍 Search food..." : "Search restaurants or cuisines..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isLargeText ? 'h-14 text-lg' : 'h-12'}`}
              />
            </div>
            <Button
              variant="outline"
              size={isLargeText ? "lg" : "default"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {!isIconFocused && <span className="ml-2 hidden sm:inline">Filters</span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'} mb-2`}>
            {isIconFocused ? '🍽️ Restaurants Near You' : 'Restaurants Near You'}
          </h2>
          <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : 'text-sm'}`}>
            {restaurants.filter(r => r.isOpen).length} restaurants delivering now
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
                No restaurants found
              </p>
            </div>
          )}
        </div>
      </main>
      
      <LocationPicker open={showLocationPicker} onClose={() => setShowLocationPicker(false)} />
    </div>
  );
};

export default Home;
