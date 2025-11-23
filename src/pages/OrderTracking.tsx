import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateOrderStatus } from '@/services/appsScript';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { userGroup, userInfo } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';

  const allSteps = [
    { label: 'Order Confirmed', icon: '✓', status: 'confirmed' },
    { label: 'Preparing Food', icon: '🍳', status: 'preparing' },
    { label: 'Out for Delivery', icon: '🚴', status: 'out-for-delivery' },
    { label: 'Delivered', icon: '✅', status: 'delivered' },
  ];

  useEffect(() => {
    const interval = setInterval(async () => {
      setCurrentStep(prev => {
        const newStep = prev < allSteps.length - 1 ? prev + 1 : prev;
        
        // Update backend with new status when step changes
        if (newStep !== prev && userInfo?.email && orderId) {
          const newStatus = allSteps[newStep].status;
          console.log('Updating order status to:', newStatus);
          updateOrderStatus(userInfo.email, orderId, newStatus)
            .then(result => {
              if (result.success) {
                console.log('Order status updated in backend:', newStatus);
              } else {
                console.error('Failed to update order status:', result.error);
              }
            })
            .catch(error => console.error('Error updating order status:', error));
        }
        
        return newStep;
      });
    }, 10000); // Change status every 10 seconds

    return () => clearInterval(interval);
  }, [orderId, userInfo?.email]);

  const orderSteps = allSteps.map((step, index) => ({
    ...step,
    completed: index <= currentStep,
  }));

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-2`}>
            Order Placed Successfully!
          </h1>
          <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
            Order #{orderId}
          </p>
        </div>

        {/* Order Status */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-6`}>
            Order Status
          </h2>
          <div className="space-y-4">
            {orderSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-success text-white' : 'bg-muted'
                } ${isLargeText ? 'text-2xl' : 'text-xl'}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isLargeText ? 'text-xl' : 'text-lg'} ${
                    step.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rider Info */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Your Delivery Rider
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className={`font-medium ${isLargeText ? 'text-xl' : 'text-lg'}`}>Ahmed Khan</p>
              <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                Rating: 4.8/5
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button size={isLargeText ? "lg" : "default"} variant="outline" className="w-full">
              <Phone className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
              Call
            </Button>
            <Button size={isLargeText ? "lg" : "default"} variant="outline" className="w-full">
              <MessageSquare className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
              Chat
            </Button>
          </div>
        </Card>

        {/* Map Placeholder */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} text-primary`} />
            <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'}`}>
              Live Tracking
            </h2>
          </div>
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map View</p>
          </div>
          <p className={`mt-4 text-muted-foreground ${isLargeText ? 'text-lg' : 'text-sm'}`}>
            Estimated arrival: 15 minutes
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/home')}
            variant="outline"
            size={isLargeText ? "lg" : "default"}
            className={`w-full ${isLargeText ? 'h-14 text-lg' : ''}`}
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/home')}
            size={isLargeText ? "lg" : "default"}
            className={`w-full ${isLargeText ? 'h-14 text-lg' : ''}`}
          >
            Order Again
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
