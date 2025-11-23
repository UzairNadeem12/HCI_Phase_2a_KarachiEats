import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Mail, Lock, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { sendSignup } from '@/services/appsScript';

const Auth = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', location: '', password: '', confirmPassword: '' });

  const isLargeText = settings.largeText;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Login flow - currently limited by backend, storing credentials in localStorage for demo
    try {
      localStorage.setItem('userEmail', loginData.email);
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendSignup({
        email: signupData.email,
        name: signupData.name,
        phone: signupData.phone,
        location: signupData.location,
      });

      if (result.success) {
        toast.success('Account created! Check your email for OTP.');
        navigate('/verify-otp', { state: { email: signupData.email } });
      } else {
        toast.error(result.error || 'Signup failed');
      }
    } catch (error) {
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-2`}>
            KarachiEats
          </h1>
          <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
            Welcome! Please login or sign up
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className={isLargeText ? 'text-lg' : ''}>
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className={isLargeText ? 'text-lg' : ''}>
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size={isLargeText ? 'lg' : 'default'}
                disabled={isLoading}
              >
                <LogIn className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <UserCircle className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-phone" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  Phone
                </Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-location" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  Location
                </Label>
                <Input
                  id="signup-location"
                  type="text"
                  placeholder="Your address"
                  value={signupData.location}
                  onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm" className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}>
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg mt-2' : 'mt-2'}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size={isLargeText ? 'lg' : 'default'}
                disabled={isLoading}
              >
                <UserPlus className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/home')}
            className={`${isLargeText ? 'text-lg' : ''} flex items-center gap-2`}
          >
            <UserCircle className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
            Continue as Guest
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
