import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Package } from 'lucide-react';

const dummyOrders = [
  {
    id: '12345',
    date: '2025-01-15',
    restaurant: 'Biryani House',
    items: ['Chicken Biryani', 'Raita'],
    total: 430,
    status: 'delivered',
  },
  {
    id: '12344',
    date: '2025-01-12',
    restaurant: 'Pizza Paradise',
    items: ['Margherita Pizza', 'Garlic Bread'],
    total: 800,
    status: 'delivered',
  },
  {
    id: '12343',
    date: '2025-01-10',
    restaurant: 'Burger Barn',
    items: ['Classic Burger', 'Fries'],
    total: 500,
    status: 'delivered',
  },
  {
    id: '12342',
    date: '2025-01-08',
    restaurant: 'Desi Delights',
    items: ['Seekh Kebab', 'Chicken Tikka', 'Naan'],
    total: 640,
    status: 'cancelled',
  },
];

const OrderHistory = () => {
  const navigate = useNavigate();
  const { userGroup } = useApp();

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          {isIconFocused ? '📦 Order History' : 'Order History'}
        </h1>

        {dummyOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-2`}>
              No orders yet
            </h2>
            <p className={`text-muted-foreground mb-4 ${isLargeText ? 'text-lg' : ''}`}>
              Start ordering to see your history here
            </p>
            <Button onClick={() => navigate('/home')} size={isLargeText ? 'lg' : 'default'}>
              {isIconFocused ? '🍽️ Browse Restaurants' : 'Browse Restaurants'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {dummyOrders.map((order) => (
              <Card key={order.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className={`font-bold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-1`}>
                      {order.restaurant}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
                      <span className={isLargeText ? 'text-base' : 'text-sm'}>
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={order.status === 'delivered' ? 'default' : 'secondary'}
                      className={isLargeText ? 'text-base px-4 py-2' : ''}
                    >
                      {order.status === 'delivered'
                        ? isIconFocused
                          ? '✅ Delivered'
                          : 'Delivered'
                        : isIconFocused
                        ? '❌ Cancelled'
                        : 'Cancelled'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                    Order #{order.id}
                  </p>
                  <p className={isLargeText ? 'text-base' : 'text-sm'}>
                    <span className="font-medium">Items:</span> {order.items.join(', ')}
                  </p>
                  <p className={`font-bold text-primary ${isLargeText ? 'text-xl' : 'text-lg'}`}>
                    Total: Rs. {order.total}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size={isLargeText ? 'lg' : 'default'}
                    onClick={() => navigate('/home')}
                  >
                    {isIconFocused ? '🔄 Reorder' : 'Reorder'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size={isLargeText ? 'lg' : 'default'}
                    onClick={() => navigate(`/tracking/${order.id}`)}
                  >
                    {isIconFocused ? '👀 View Details' : 'View Details'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
