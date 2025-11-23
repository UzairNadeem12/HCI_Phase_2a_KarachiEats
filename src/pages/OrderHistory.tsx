import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getOrderHistory, Order } from '@/services/appsScript';
import { useTranslation } from '@/hooks/useTranslation';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { settings, userInfo } = useApp();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isLargeText = settings.largeText;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        if (!userInfo?.email) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const result = await getOrderHistory(userInfo.email);

        if (result.success && result.orders) {
          setOrders(result.orders);
        } else {
          toast.error(result.error || 'Failed to fetch order history');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch order history');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?.email]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!userInfo?.email) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
            {t('myOrders')}
          </h1>
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-2`}>
              {t('pleaseLogin')}
            </h2>
            <p className={`text-muted-foreground mb-4 ${isLargeText ? 'text-lg' : ''}`}>
              {t('needLoginForHistory')}
            </p>
            <Button onClick={() => navigate('/auth')} size={isLargeText ? 'lg' : 'default'}>
              {t('goToLogin')}
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          {t('myOrders')}
        </h1>

        {isLoading ? (
          <Card className="p-12 text-center">
            <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
              {t('loadingOrders')}
            </p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-2`}>
              {t('noOrdersYet')}
            </h2>
            <p className={`text-muted-foreground mb-4 ${isLargeText ? 'text-lg' : ''}`}>
              {t('startOrdering')}
            </p>
            <Button onClick={() => navigate('/home')} size={isLargeText ? 'lg' : 'default'}>
              {t('browseRestaurants')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className={`font-bold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-1`}>
                      {t('order')} #{order.id}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className={`${isLargeText ? 'w-5 h-5' : 'w-4 h-4'}`} />
                      <span className={isLargeText ? 'text-base' : 'text-sm'}>
                        {order.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={getStatusColor(order.status)}
                      className={isLargeText ? 'text-base px-4 py-2' : ''}
                    >
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                    {t('location')}: {order.location}
                  </p>
                  <p className={isLargeText ? 'text-base' : 'text-sm'}>
                    <span className="font-medium">{t('items')}:</span> {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </p>
                  <p className={`font-bold text-primary ${isLargeText ? 'text-xl' : 'text-lg'}`}>
                    {t('total')}: Rs. {order.total}
                  </p>
                  {order.paymentMethod && (
                    <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                      {t('paymentLabel')}: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    size={isLargeText ? 'lg' : 'default'}
                    onClick={() => navigate('/home')}
                  >
                    <RotateCcw className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    Reorder
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    size={isLargeText ? 'lg' : 'default'}
                    onClick={() => navigate(`/tracking/${order.id}`)}
                  >
                    <FileText className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    View Details
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
