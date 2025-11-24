import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Trash2, Plus, Minus, User, Phone, Clock, CreditCard, Wallet, DollarSign, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { saveOrder } from '@/services/appsScript';
import { MapPin } from "lucide-react";
import LocationPicker from '@/components/LocationPicker';
import { useTranslation } from '@/hooks/useTranslation';


const Checkout = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, settings, userInfo, location } = useApp();
  const { t } = useTranslation();
  const { speak } = useVoice();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [guestName, setGuestName] = useState(userInfo?.name || '');
  const [guestPhone, setGuestPhone] = useState(userInfo?.phone || '');
  const [guestEmail, setGuestEmail] = useState(userInfo?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [mobileWallet, setMobileWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const hasAnnouncedWelcome = useRef(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const isLargeText = settings.largeText;

  const deliveryFee = cart[0]?.deliveryFee || 60;
  const total = cartTotal + deliveryFee;

  // Announce checkout page on load (only once)
  useEffect(() => {
    if (!hasAnnouncedWelcome.current) {
      speak('Welcome to checkout. Please fill in your contact details and select a payment method');
      hasAnnouncedWelcome.current = true;
    }
  }, [speak]);

  /**
   * Validates form fields and provides voice feedback
   */
  const validateAndSpeak = (): boolean => {
    if (!guestName || !guestPhone || !guestEmail) {
      speak('Please fill in your contact details: name, phone, and email');
      return false;
    }
    if (isScheduled && !scheduledTime) {
      speak('Please select a scheduled delivery time');
      return false;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV)) {
      speak('Please complete your card details: card number, expiry date, and CVV');
      return false;
    }
    if (paymentMethod === 'jazzcash' && !mobileWallet) {
      speak('Please enter your JazzCash or Easypaisa number');
      return false;
    }

    // All fields are valid, provide order summary feedback
    speak(`Please review the rest of the details. Your total is ${total} rupees`);
    return true;
  };
  const handlePlaceOrder = async () => {
    if (location === "Choose your location" || !location) {
      toast.error(t('pleaseChooseLocation'));
      return;
    }

    // Validate and provide voice feedback
    if (!validateAndSpeak()) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    setIsProcessing(true);

    try {
      const timestamp = new Date().toISOString();
      
      const orderData = {
        email: guestEmail,
        name: guestName,
        phone: guestPhone,
        location: location,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        paymentMethod: paymentMethod,
        scheduledTime: isScheduled ? scheduledTime : '',
        timestamp: timestamp,
      };

      const result = await saveOrder(orderData);

      if (result.success && result.orderId) {
        clearCart();
        
        // Announce order success with estimated time
        speak(`Your order is placed. Estimated time is 30 minutes`);
        
        if (isScheduled) {
          toast.success(t('orderScheduled'));
        } else {
          toast.success(t('orderSuccess'));
        }
        
        navigate(`/tracking/${result.orderId}`);
      } else {
        toast.error(result.error || t('orderFailed'));
      }
    } catch (error) {
      toast.error(t('orderFailedTryAgain'));
      console.error('Order error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'}`}>
            {t('yourCart')}
          </h1>
          <Button onClick={() => navigate('/home')} size={isLargeText ? "lg" : "default"}>
            {t('browseRestaurants')}
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
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className={`font-medium ${isLargeText ? 'text-lg' : 'text-sm'}`}>
                {location === "" || location === "Choose your location"
                  ? t('enterYourLocation')
                  : location}
              </span>
            </button>
          </div>

          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} size={isLargeText ? "lg" : "default"}>
            <ArrowLeft className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
            {t('back')}
          </Button>

        </div>
      </header>


      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          {t('checkout')}
        </h1>

        {/* Guest Details */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            {t('contactInfo')}
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                {t('emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailLabel')}
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
              />
            </div>
            <div>
              <Label htmlFor="name" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                <User className="w-4 h-4" />
                {t('nameLabel')}
              </Label>
              <Input
                id="name"
                placeholder={t('nameLabel')}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
              />
            </div>
            <div>
              <Label htmlFor="phone" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                <Phone className="w-4 h-4" />
                {t('phoneLabel')}
              </Label>
              <Input
                id="phone"
                placeholder={t('phoneLabel')}
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
            {t('orderSummary')}
          </h2>
          <div className="space-y-4">
            {cart.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-[70px_1fr] gap-4 pb-4 border-b border-border last:border-0"
                >
                  {/* Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`${isLargeText ? "w-20 h-20" : "w-16 h-16"} object-cover rounded`}
                    />
                  )}

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col w-full min-w-0">

                    {/* LINE 1: NAME */}
                    <h3
                      className={`font-medium truncate ${
                        isLargeText ? "text-xl" : ""
                      }`}
                    >
                      {item.name}
                    </h3>

                    {/* LINE 2: PRICE */}
                    <p
                      className={`text-primary font-semibold mt-1 ${
                        isLargeText ? "text-lg" : ""
                      }`}
                    >
                      Rs. {item.price}
                    </p>

                    {/* LINE 3: ACTION BUTTONS */}
                    <div className="flex items-center gap-2 mt-2">

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={isLargeText ? "h-12 w-12" : "h-9 w-9"}
                      >
                        <Minus className={`${isLargeText ? "w-5 h-5" : "w-4 h-4"}`} />
                      </Button>

                      <span
                        className={`min-w-[2rem] text-center font-medium ${
                          isLargeText ? "text-xl" : "text-base"
                        }`}
                      >
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={isLargeText ? "h-12 w-12" : "h-9 w-9"}
                      >
                        <Plus className={`${isLargeText ? "w-5 h-5" : "w-4 h-4"}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className={isLargeText ? "h-12 w-12" : "h-9 w-9"}
                      >
                        <Trash2
                          className={`${isLargeText ? "w-5 h-5" : "w-4 h-4"} text-destructive`}
                        />
                      </Button>

                    </div>
                  </div>
                </div>

              ))}
          </div>
        </Card>

        {/* Delivery Schedule */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Clock className="w-5 h-5" />
            {t('deliveryTime')}
          </h2>
          <RadioGroup value={isScheduled ? 'later' : 'now'} onValueChange={(v) => setIsScheduled(v === 'later')}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now" className={isLargeText ? 'text-lg' : ''}>{t('deliverNow')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later" className={isLargeText ? 'text-lg' : ''}>{t('scheduleOrder')}</Label>
            </div>
          </RadioGroup>
          
          {isScheduled && (
            <div className="mt-4">
              <Label htmlFor="time" className={isLargeText ? 'text-lg' : ''}>{t('selectTime')}</Label>
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
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Wallet className="w-5 h-5" />
            {t('paymentMethod')}
          </h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                <DollarSign className="w-4 h-4" />
                {t('cashOnDelivery')}
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                <CreditCard className="w-4 h-4" />
                {t('cardPayment')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jazzcash" id="jazzcash" />
              <Label htmlFor="jazzcash" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                <Wallet className="w-4 h-4" />
                {t('mobileWallet')}
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-4 pt-4 border-t border-border">
              <div>
                <Label htmlFor="cardNumber" className={isLargeText ? 'text-lg' : ''}>{t('cardNumber')}</Label>
                <Input
                  id="cardNumber"
                  placeholder={t('cardNumber')}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry" className={isLargeText ? 'text-lg' : ''}>{t('expiryDate')}</Label>
                  <Input
                    id="cardExpiry"
                    placeholder={t('expiryDate')}
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); 

                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                      }

                      setCardExpiry(value);
                    }}
                    className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCVV" className={isLargeText ? 'text-lg' : ''}>{t('cvv')}</Label>
                  <Input
                    id="cardCVV"
                    placeholder={t('cvv')}
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
              <Label htmlFor="mobileWallet" className={isLargeText ? 'text-lg' : ''}>{t('mobileWalletNumber')}</Label>
              <Input
                id="mobileWallet"
                placeholder={t('mobileWalletNumber')}
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
            {t('orderSummary')}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={isLargeText ? 'text-lg' : ''}>{t('subtotal')}</span>
              <span className={isLargeText ? 'text-lg' : ''}>Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className={isLargeText ? 'text-lg' : ''}>{t('deliveryFee')}</span>
              <span className={isLargeText ? 'text-lg' : ''}>Rs. {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-primary pt-2 border-t border-border">
              <span className={isLargeText ? 'text-2xl' : 'text-xl'}>{t('total')}</span>
              <span className={isLargeText ? 'text-2xl' : 'text-xl'}>Rs. {total}</span>
            </div>
          </div>
        </Card>

        {/* Place Order Button */}
        <Button 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          size={isLargeText ? "lg" : "default"}
          className={`w-full ${isLargeText ? 'h-16 text-xl' : 'h-14 text-lg'} flex items-center justify-center gap-2`}
        >
          <ShoppingBag className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {isProcessing ? t('loading') : `${t('placeOrder')} - Rs. ${total}`}
        </Button>
      </main>
      <LocationPicker open={showLocationPicker} onClose={() => setShowLocationPicker(false)} />
    </div>
  );
};

export default Checkout;
