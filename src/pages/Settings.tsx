import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Globe, Type, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();
  const { isVoiceEnabled, setVoiceEnabled, speak, isSupported } = useVoice();
  const { t } = useTranslation();

  const handleLanguageChange = (language: 'en' | 'ur') => {
    updateSettings({ language });
    toast.success(language === 'en' ? t('languageSetEnglish') : t('languageSetUrdu'));
  };

  const handleLargeTextToggle = (checked: boolean) => {
    updateSettings({ largeText: checked });
    toast.success(checked ? t('largeTextEnabled') : t('largeTextDisabled'));
  };

  const handleVoiceToggle = (checked: boolean) => {
    setVoiceEnabled(checked);
    if (checked && isSupported) {
      speak('Voice feedback is now enabled');
      toast.success(t('voiceFeedbackEnabled') || 'Voice feedback enabled');
    } else if (checked && !isSupported) {
      toast.error('Voice feedback is not supported in your browser');
    } else {
      toast.success(t('voiceFeedbackDisabled') || 'Voice feedback disabled');
    }
  };

  const isLargeText = settings.largeText;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size={isLargeText ? "lg" : "default"}>
            <ArrowLeft className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
            {t('back')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          {t('settings')}
        </h1>

        {/* Language Settings */}
        <Card className="p-6 mb-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Globe className="w-5 h-5" />
            {t('languageBilingual')}
          </h2>
          <RadioGroup value={settings.language} onValueChange={handleLanguageChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                {t('english')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ur" id="ur" />
              <Label htmlFor="ur" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                {t('urdu')}
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Accessibility Settings */}
        <Card className="p-6">
          <h2 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4 flex items-center gap-2`}>
            <Type className="w-5 h-5" />
            {t('accessibility')}
          </h2>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div className="flex-1">
              <Label htmlFor="large-text" className={`cursor-pointer ${isLargeText ? 'text-lg' : ''}`}>
                {t('largeTextIcons')}
              </Label>
              <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'} mt-1`}>
                {t('largeTextDescription')}
              </p>
            </div>
            <Switch
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={handleLargeTextToggle}
            />
          </div>

          {/* Voice Feedback Toggle */}
          {isSupported && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="voice-feedback" className={`cursor-pointer flex items-center gap-2 ${isLargeText ? 'text-lg' : ''}`}>
                  <Volume2 className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
                  {t('voiceFeedback') || 'Voice Feedback'}
                </Label>
                <p className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'} mt-1`}>
                  {t('voiceFeedbackDescription') || 'Enable text-to-speech announcements for app interactions'}
                </p>
              </div>
              <Switch
                id="voice-feedback"
                checked={isVoiceEnabled}
                onCheckedChange={handleVoiceToggle}
              />
            </div>
          )}
          {!isSupported && (
            <p className={`text-amber-600 ${isLargeText ? 'text-base' : 'text-sm'}`}>
              Voice feedback is not supported in your browser.
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Settings;
