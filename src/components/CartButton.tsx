import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

const CartButton = () => {
  const navigate = useNavigate();
  const { cart, settings } = useApp();
  const [animate, setAnimate] = useState(false);
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isLargeText = settings.largeText;

  // Trigger animation when cart changes
  useEffect(() => {
    if (itemCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <Button 
      onClick={() => navigate('/checkout')}
      className={`fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all ${
        animate ? 'animate-scale-in' : ''
      } ${isLargeText ? 'h-16 w-16 p-0' : 'h-14 w-14 p-0'} rounded-full`}
      size="icon"
    >
      <ShoppingCart className={`${isLargeText ? 'w-7 h-7' : 'w-6 h-6'}`} />
      <Badge 
        variant="secondary" 
        className={`absolute -top-1 -right-1 ${
          isLargeText ? 'h-7 w-7 text-base' : 'h-6 w-6 text-sm'
        } rounded-full flex items-center justify-center bg-accent text-accent-foreground border-2 border-background ${
          animate ? 'animate-[pulse_0.5s_ease-in-out]' : ''
        }`}
      >
        {itemCount}
      </Badge>
    </Button>
  );
};

export default CartButton;
