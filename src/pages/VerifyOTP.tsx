import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { verifyOTP, getUserData } from '@/services/appsScript';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo, setIsLoggedIn, settings } = useApp();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || '';

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending OTP verification for email:', email, 'OTP:', otp);
      const result = await verifyOTP(email, otp);
      
      console.log('OTP verification result:', result);
      
      if (result.success) {
        // Fetch user data after successful OTP verification
        console.log('OTP verified, fetching user data for email:', email);
        const userData = await getUserData(email);
        
        console.log('User data response:', userData);
        
        // Backend returns data at root level, not in .data property
        if (userData.success) {
          const data = userData as any;
          console.log('Setting user info with data:', data);
          setUserInfo({
            email: data.email,
            name: data.name,
            phone: data.phone,
            locations: data.locations,
          });
          setIsLoggedIn(true);
          toast.success('Account verified successfully!');
          navigate('/profile');
        } else {
          console.error('User data fetch failed:', userData);
          toast.error(userData.error || 'Failed to fetch user data');
        }
      } else {
        console.error('OTP verification failed:', result);
        toast.error(result.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const isLargeText = settings.largeText;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size={isLargeText ? "lg" : "default"}>
            <ArrowLeft className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-md">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'} mb-2`}>
              Verify Your Account
            </h1>
            <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
              Enter the 6-digit OTP sent to
            </p>
            <p className={`font-medium ${isLargeText ? 'text-lg' : ''}`}>{email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="otp" className={isLargeText ? 'text-lg' : ''}>
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className={`${isLargeText ? 'h-14 text-xl' : 'h-12 text-lg'} text-center tracking-widest mt-2`}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              size={isLargeText ? "lg" : "default"}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              size={isLargeText ? "lg" : "default"}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default VerifyOTP;
