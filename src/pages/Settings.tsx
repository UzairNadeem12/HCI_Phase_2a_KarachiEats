import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Globe, Type } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();

  const handleLanguageChange = (language: 'en' | 'ur') => {
    updateSettings({ language });
    toast.success(language === 'en' ? 'Language set to English' : 'زبان اردو میں سیٹ ہو گئی');
  };

  const handleLargeTextToggle = (checked: boolean) => {
    updateSettings({ largeText: checked });
    toast.success(checked ? 'Large text enabled' : 'Large text disabled');
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

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          Settings
        </h1>

        {/* Language Settings */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Globe className="w-5 h-5" />
            Language / زبان
          </h2>
          <RadioGroup value={settings.language} onValueChange={handleLanguageChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                English
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ur" id="ur" />
              <Label htmlFor="ur" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                اردو (Urdu)
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Accessibility Settings */}
        <Card className="p-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Type className="w-5 h-5" />
            Accessibility
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="large-text" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                Large Text & Icons
              </Label>
              <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'} mt-1`}>
                Increase text size and button size for better visibility
              </p>
            </div>
            <Switch
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={handleLargeTextToggle}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
