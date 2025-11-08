import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { userGroup } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful!');
      navigate('/home');
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account created successfully!');
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-2`}>
            {isIconFocused ? '🍽️ KarachiEats' : 'KarachiEats'}
          </h1>
          <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
            Welcome! Please login or sign up
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className={isLargeText ? 'text-lg' : ''}>
              {isIconFocused ? '🔑 Login' : 'Login'}
            </TabsTrigger>
            <TabsTrigger value="signup" className={isLargeText ? 'text-lg' : ''}>
              {isIconFocused ? '➕ Sign Up' : 'Sign Up'}
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className={isLargeText ? 'text-lg' : ''}>
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
                <Label htmlFor="login-password" className={isLargeText ? 'text-lg' : ''}>
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
                {isLoading ? 'Logging in...' : isIconFocused ? '🔑 Login' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className={isLargeText ? 'text-lg' : ''}>
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
                <Label htmlFor="signup-email" className={isLargeText ? 'text-lg' : ''}>
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
                <Label htmlFor="signup-password" className={isLargeText ? 'text-lg' : ''}>
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
                <Label htmlFor="signup-confirm" className={isLargeText ? 'text-lg' : ''}>
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
                {isLoading ? 'Creating account...' : isIconFocused ? '➕ Sign Up' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/home')}
            className={isLargeText ? 'text-lg' : ''}
          >
            {isIconFocused ? '🏠 Continue as Guest' : 'Continue as Guest'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
