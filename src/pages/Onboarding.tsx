import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Eye, Accessibility } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserGroup } = useApp();

  const handleGroupSelection = (group: 'student' | 'senior' | 'lowLiteracy' | 'disability') => {
    setUserGroup(group);
    navigate('/home');
  };

  const userGroups = [
    {
      id: 'student' as const,
      label: "I'm a Student / Young User",
      description: "Modern UI with quick ordering",
      icon: GraduationCap,
    },
    {
      id: 'senior' as const,
      label: "I'm a Senior / Mature User",
      description: "Larger text, simpler layout",
      icon: Users,
    },
    {
      id: 'lowLiteracy' as const,
      label: "I prefer simpler visuals",
      description: "Icon-first, minimal text",
      icon: Eye,
    },
    {
      id: 'disability' as const,
      label: "I need accessible UI",
      description: "High contrast, voice-assisted",
      icon: Accessibility,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to <span className="text-primary">KarachiEats</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your preference for a personalized experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {userGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Button
                key={group.id}
                onClick={() => handleGroupSelection(group.id)}
                variant="outline"
                className="h-auto p-8 flex flex-col items-start gap-4 hover:bg-card-hover hover:border-primary transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">{group.label}</h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground pt-6">
          You can change this later in settings
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
