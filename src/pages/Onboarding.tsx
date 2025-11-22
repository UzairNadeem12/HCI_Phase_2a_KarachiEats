import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Eye, Accessibility } from 'lucide-react';


const Onboarding = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to <span className="text-primary">KarachiEats</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Enjoy fast food delivery, personalized restaurant recommendations, and smooth ordering experience.
        </p>

        <div className="pt-6">
          <Button
            onClick={handleContinue}
            className="px-10 py-6 text-lg font-semibold"
          >
            Continue
          </Button>
        </div>

        </div>
      </div>
    </div>
  );
};


export default Onboarding;



