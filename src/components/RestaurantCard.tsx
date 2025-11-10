import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Bike } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const navigate = useNavigate();
  const { userGroup } = useApp();
  
  const isLargeText = userGroup === 'senior' || userGroup === 'disability';

  const handleClick = () => {
    if (restaurant.isOpen) {
      navigate(`/restaurant/${restaurant.id}`);
    }
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
        restaurant.isOpen ? 'hover:scale-[1.02]' : 'opacity-75'
      } ${!restaurant.isOpen ? 'cursor-not-allowed' : ''}`}
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Badge variant="secondary" className={`${isLargeText ? 'text-2xl px-6 py-3' : 'text-lg px-4 py-2'} bg-badge-closed text-white`}>
              CLOSED
            </Badge>
          </div>
        )}
        {restaurant.isOpen && (
            <Badge className={`absolute top-3 left-3 ${isLargeText ? 'text-base px-3 py-1' : 'text-sm'} bg-success`}>
              OPEN
            </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className={`font-bold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-1`}>
            {restaurant.name}
          </h3>
          <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
            {restaurant.cuisine}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'} fill-warning text-warning`} />
              <span className={`font-medium ${isLargeText ? 'text-base' : ''}`}>
                {restaurant.rating}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
              <span className={isLargeText ? 'text-base' : ''}>
                {restaurant.deliveryTime} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bike className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <span className={isLargeText ? 'text-base' : ''}>
              Rs. {restaurant.deliveryFee}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
