import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { addLocation } from '@/services/appsScript';
import { useTranslation } from '@/hooks/useTranslation';

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
}

const LocationPicker = ({ open, onClose }: LocationPickerProps) => {
  const { location, setLocation, settings, userInfo } = useApp();
  const { t } = useTranslation();
  const [newLocation, setNewLocation] = useState(
  location === "Choose your location" ? "" : location);
  const [isSaving, setIsSaving] = useState(false);

  const isLargeText = settings.largeText;

  const popularLocations = [
    'Gulshan-e-Iqbal, Karachi',
    'Clifton, Karachi',
    'Saddar, Karachi',
    'North Nazimabad, Karachi',
    'DHA Phase 5, Karachi',
    'Malir, Karachi',
  ];

  const handleSave = async () => {
    if (!newLocation.trim()) {
      toast.error(t('pleaseEnterLocation'));
      return;
    }

    setIsSaving(true);

    try {
      // If user is logged in, save location to backend
      if (userInfo?.email) {
        const result = await addLocation(userInfo.email, newLocation);

        if (result.success) {
          setLocation(newLocation);
          toast.success(t('locationSavedSuccessfully'));
          onClose();
        } else {
          toast.error(result.error || t('failedToSaveLocation'));
        }
      } else {
        // For guests, just update local state
        setLocation(newLocation);
        toast.success(t('locationUpdated'));
        onClose();
      }
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error(t('failedToSaveLocation'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={isLargeText ? 'text-2xl' : 'text-xl'}>
            {t('changeLocation')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={location === "Choose your location" ? "Choose your location" : t('enterYourLocation')}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className={`pl-10 ${isLargeText ? 'h-14 text-lg' : 'h-12'}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className={`font-medium ${isLargeText ? 'text-lg' : 'text-sm'} text-muted-foreground`}>
              {t('popularLocations')}
            </p>
            <div className="space-y-2">
              {popularLocations.map((loc) => (
                <Button
                  key={loc}
                  variant="outline"
                  className={`w-full justify-start ${isLargeText ? 'h-12 text-base' : 'h-10'}`}
                  onClick={() => setNewLocation(loc)}
                >
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {loc}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={isSaving}
            size={isLargeText ? "lg" : "default"}
          >
            {isSaving ? t('saving') : t('saveLocation')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
