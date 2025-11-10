import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, userGroup } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [mobileWallet, setMobileWallet] = useState('');

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  const deliveryFee = cart[0]?.deliveryFee || 60;
  const total = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!guestName || !guestPhone) {
      toast.error('Please fill in your contact details');
      return;
    }
    if (isScheduled && !scheduledTime) {
      toast.error('Please select a delivery time');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV)) {
      toast.error('Please fill in your card details');
      return;
    }
    if (paymentMethod === 'jazzcash' && !mobileWallet) {
      toast.error('Please enter your JazzCash/Easypaisa number');
      return;
    }
    
    clearCart();
    
    if (isScheduled) {
      toast.success(`Order scheduled for ${scheduledTime}! We'll deliver at the requested time.`);
    } else {
      toast.success('Order placed successfully! Your food is on the way.');
    }
    
    navigate('/tracking/12345');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'}`}>
            Your cart is empty
          </h1>
          <Button onClick={() => navigate('/home')} size={isLargeText ? "lg" : "default"}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size={isLargeText ? "lg" : "default"}>
            <ArrowLeft className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
            {!isIconFocused && 'Back'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          Checkout
        </h1>

        {/* Guest Details */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Contact Details
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className={isLargeText ? 'text-lg' : ''}>Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
              />
            </div>
            <div>
              <Label htmlFor="phone" className={isLargeText ? 'text-lg' : ''}>Phone Number</Label>
              <Input
                id="phone"
                placeholder="03XX-XXXXXXX"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
              />
            </div>
          </div>
        </Card>

        {/* Cart Items */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Your Order
          </h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                {item.image && (
                  <img src={item.image} alt={item.name} className={`${isLargeText ? 'w-20 h-20' : 'w-16 h-16'} object-cover rounded`} />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${isLargeText ? 'text-xl' : ''}`}>{item.name}</h3>
                  <p className={`text-primary font-semibold ${isLargeText ? 'text-lg' : ''}`}>
                    Rs. {item.price}
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size={isLargeText ? "default" : "icon"}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={isLargeText ? 'h-10 w-10 sm:h-12 sm:w-12' : ''}
                  >
                    <Minus className={`${isLargeText ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4 h-4'}`} />
                  </Button>
                  <span className={`min-w-[2rem] text-center font-medium ${isLargeText ? 'text-lg sm:text-xl' : ''}`}>
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size={isLargeText ? "default" : "icon"}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={isLargeText ? 'h-10 w-10 sm:h-12 sm:w-12' : ''}
                  >
                    <Plus className={`${isLargeText ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4 h-4'}`} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size={isLargeText ? "default" : "icon"}
                  onClick={() => removeFromCart(item.id)}
                  className={isLargeText ? 'h-10 w-10 sm:h-12 sm:w-12' : ''}
                >
                  <Trash2 className={`${isLargeText ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4 h-4'} text-destructive`} />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Schedule */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Delivery Time
          </h2>
          <RadioGroup value={isScheduled ? 'later' : 'now'} onValueChange={(v) => setIsScheduled(v === 'later')}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now" className={isLargeText ? 'text-lg' : ''}>Deliver Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later" className={isLargeText ? 'text-lg' : ''}>Schedule for Later</Label>
            </div>
          </RadioGroup>
          
          {isScheduled && (
            <div className="mt-4">
              <Label htmlFor="time" className={isLargeText ? 'text-lg' : ''}>Select Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                min={new Date().toTimeString().slice(0, 5)}
              />
            </div>
          )}
        </Card>

        {/* Payment Method */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Payment Method
          </h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className={isLargeText ? 'text-lg' : ''}>Cash on Delivery</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className={isLargeText ? 'text-lg' : ''}>Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jazzcash" id="jazzcash" />
              <Label htmlFor="jazzcash" className={isLargeText ? 'text-lg' : ''}>JazzCash/Easypaisa</Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-4 pt-4 border-t border-border">
              <div>
                <Label htmlFor="cardNumber" className={isLargeText ? 'text-lg' : ''}>Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry" className={isLargeText ? 'text-lg' : ''}>Expiry</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCVV" className={isLargeText ? 'text-lg' : ''}>CVV</Label>
                  <Input
                    id="cardCVV"
                    placeholder="123"
                    type="password"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'jazzcash' && (
            <div className="mt-6 pt-4 border-t border-border">
              <Label htmlFor="mobileWallet" className={isLargeText ? 'text-lg' : ''}>JazzCash/Easypaisa Number</Label>
              <Input
                id="mobileWallet"
                placeholder="03XX-XXXXXXX"
                value={mobileWallet}
                onChange={(e) => setMobileWallet(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
              />
            </div>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="p-6 mb-6 bg-secondary">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={isLargeText ? 'text-lg' : ''}>Subtotal</span>
              <span className={isLargeText ? 'text-lg' : ''}>Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className={isLargeText ? 'text-lg' : ''}>Delivery Fee</span>
              <span className={isLargeText ? 'text-lg' : ''}>Rs. {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-primary pt-2 border-t border-border">
              <span className={isLargeText ? 'text-2xl' : 'text-xl'}>Total</span>
              <span className={isLargeText ? 'text-2xl' : 'text-xl'}>Rs. {total}</span>
            </div>
          </div>
        </Card>

        {/* Place Order Button */}
        <Button 
          onClick={handlePlaceOrder}
          size={isLargeText ? "lg" : "default"}
          className={`w-full ${isLargeText ? 'h-16 text-xl' : 'h-14 text-lg'}`}
        >
          Place Order - Rs. {total}
        </Button>
      </main>
    </div>
  );
};

export default Checkout;
