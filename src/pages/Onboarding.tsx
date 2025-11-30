import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { UtensilsCrossed, Smartphone, ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleContinue = () => {
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md md:max-w-2xl space-y-8 animate-fade-in">
        {/* Logo/Icon Section */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-primary/10 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-primary/20">
              <UtensilsCrossed className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-4 md:space-y-6 px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {t('welcomeTo')}
            <br />
            <span className="text-primary bg-clip-text">{t('appName')}</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t('onboardingDescription')}
          </p>

          {/* Mobile Optimized Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Smartphone className="w-4 h-4 text-accent" />
            <span className="text-sm md:text-base text-accent font-medium">
              Optimized for Mobile
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center px-4">
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full md:w-auto px-8 md:px-12 py-6 md:py-7 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            {t('continue')}
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Optional: Features Preview */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 px-4 md:px-8">
          <div className="text-center p-3 md:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-xl md:text-2xl font-bold text-primary">Fast</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Delivery</div>
          </div>
          <div className="text-center p-3 md:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-xl md:text-2xl font-bold text-accent">Easy</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Ordering</div>
          </div>
          <div className="text-center p-3 md:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-xl md:text-2xl font-bold text-warning">Fresh</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Food</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Onboarding;
