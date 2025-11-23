import { useApp } from '@/contexts/AppContext';
import { translations, TranslationKey } from '@/lib/translations';

export const useTranslation = () => {
  const { settings } = useApp();
  
  const t = (key: TranslationKey): string => {
    return translations[settings.language][key] || key;
  };
  
  return { t, language: settings.language };
};
