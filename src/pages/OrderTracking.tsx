import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { userGroup } = useApp();

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  const orderSteps = [
    { label: 'Order Confirmed', icon: '✓', completed: true },
    { label: 'Preparing Food', icon: '🍳', completed: true },
    { label: 'Out for Delivery', icon: '🚴', completed: true },
    { label: 'Delivered', icon: '✅', completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-2`}>
            {isIconFocused ? '✅ Order Placed!' : 'Order Placed Successfully!'}
          </h1>
          <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
            Order #{orderId}
          </p>
        </div>

        {/* Order Status */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-6`}>
            {isIconFocused ? '📦 Order Status' : 'Order Status'}
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
            {isIconFocused ? '🚴 Your Rider' : 'Your Delivery Rider'}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className={`font-medium ${isLargeText ? 'text-xl' : 'text-lg'}`}>Ahmed Khan</p>
              <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                {isIconFocused ? '⭐ 4.8' : 'Rating: 4.8/5'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button size={isLargeText ? "lg" : "default"} variant="outline" className="w-full">
              <Phone className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
              {isIconFocused ? '📞' : 'Call'}
            </Button>
            <Button size={isLargeText ? "lg" : "default"} variant="outline" className="w-full">
              <MessageSquare className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
              {isIconFocused ? '💬' : 'Chat'}
            </Button>
          </div>
        </Card>

        {/* Map Placeholder */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} text-primary`} />
            <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'}`}>
              {isIconFocused ? '🗺️ Live Tracking' : 'Live Tracking'}
            </h2>
          </div>
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map View</p>
          </div>
          <p className={`mt-4 text-muted-foreground ${isLargeText ? 'text-lg' : 'text-sm'}`}>
            {isIconFocused ? '⏱️ Arriving in 15 minutes' : 'Estimated arrival: 15 minutes'}
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
            {isIconFocused ? '🏠 Back to Home' : 'Back to Home'}
          </Button>
          <Button 
            onClick={() => navigate('/home')}
            size={isLargeText ? "lg" : "default"}
            className={`w-full ${isLargeText ? 'h-14 text-lg' : ''}`}
          >
            {isIconFocused ? '🔄 Order Again' : 'Order Again'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
