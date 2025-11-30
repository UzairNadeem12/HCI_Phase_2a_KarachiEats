import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleContinue = () => {
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in">
        {/* Left side - Hero content */}
        <div className="text-center md:text-left space-y-6 order-2 md:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              {t('welcomeTo')}
              <span className="block text-primary mt-2">{t('appName')}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              {t('onboardingDescription')}
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {t('continue')}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground/80 pt-4">
            💡 Best viewed on mobile devices
          </p>
        </div>

        {/* Right side - Visual element */}
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 animate-pulse"></div>
            <div className="absolute inset-0 bg-primary/20 rounded-3xl -rotate-6"></div>
            <div className="relative bg-card rounded-3xl shadow-2xl p-8 md:p-12 flex items-center justify-center border border-border">
              <div className="text-center space-y-4">
                <div className="text-6xl md:text-8xl">🍽️</div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">
                  Delicious Food
                </p>
                <p className="text-sm text-muted-foreground">
                  Delivered Fast
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Onboarding;
