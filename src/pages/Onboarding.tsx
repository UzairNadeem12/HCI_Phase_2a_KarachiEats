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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('welcomeTo')} <span className="text-primary">{t('appName')}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('onboardingDescription')}
          </p>

          <div className="pt-6">
            <Button
              onClick={handleContinue}
              className="px-10 py-6 text-lg font-semibold"
            >
              {t('continue')}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Onboarding;



