import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const CartButton = () => {
  const navigate = useNavigate();
  const { cart, userGroup } = useApp();
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isLargeText = userGroup === 'senior' || userGroup === 'disability';

  if (itemCount === 0) return null;

  return (
    <Button 
      onClick={() => navigate('/checkout')}
      className={`relative ${isLargeText ? 'h-12 px-6' : 'h-10'}`}
    >
      <ShoppingCart className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
      <span className={isLargeText ? 'text-base' : 'text-sm'}>Cart</span>
      <Badge 
        variant="secondary" 
        className="absolute -top-2 -right-2 bg-accent text-accent-foreground"
      >
        {itemCount}
      </Badge>
    </Button>
  );
};

export default CartButton;
