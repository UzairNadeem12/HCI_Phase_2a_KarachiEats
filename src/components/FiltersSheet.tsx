import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export interface FilterState {
  cuisine: string;
  maxDeliveryFee: number;
  minRating: number;
  showClosedOnly: boolean;
}

interface FiltersSheetProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FiltersSheet = ({ filters, onFiltersChange }: FiltersSheetProps) => {
  const { settings } = useApp();
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);
  const [open, setOpen] = useState(false);

  const isLargeText = settings.largeText;

  const cuisineOptions = [t('all'), 'Pakistani', 'Italian', 'Fast Food', 'Japanese', 'BBQ', 'Café'];

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      cuisine: 'All',
      maxDeliveryFee: 150,
      minRating: 0,
      showClosedOnly: false,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size={isLargeText ? 'lg' : 'default'}>
          <SlidersHorizontal className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">{t('filters')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className={isLargeText ? 'text-2xl' : 'text-xl'}>
            {t('filters')}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Cuisine Filter */}
          <div className="space-y-3">
            <Label className={isLargeText ? 'text-lg' : ''}>{t('cuisine')}</Label>
            <RadioGroup
              value={localFilters.cuisine}
              onValueChange={(value) => setLocalFilters({ ...localFilters, cuisine: value })}
            >
              {cuisineOptions.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <RadioGroupItem value={cuisine} id={cuisine} />
                  <Label htmlFor={cuisine} className={`cursor-pointer ${isLargeText ? 'text-base' : ''}`}>
                    {cuisine}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Max Delivery Fee */}
          <div className="space-y-3">
            <Label className={isLargeText ? 'text-lg' : ''}>
              {t('maxDeliveryFee')}: Rs. {localFilters.maxDeliveryFee}
            </Label>
            <Slider
              value={[localFilters.maxDeliveryFee]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, maxDeliveryFee: value })}
              min={0}
              max={150}
              step={10}
              className="mt-2"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3">
            <Label className={isLargeText ? 'text-lg' : ''}>
              {t('minRating')}: {localFilters.minRating === 0 ? t('any') : localFilters.minRating}
            </Label>
            <Slider
              value={[localFilters.minRating]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, minRating: value })}
              min={0}
              max={5}
              step={0.5}
              className="mt-2"
            />
          </div>

          {/* Show Open/Closed */}
          <div className="space-y-3">
            <Label className={isLargeText ? 'text-lg' : ''}>{t('showOpenOnly')}</Label>
            <RadioGroup
              value={localFilters.showClosedOnly ? 'closed' : 'open'}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, showClosedOnly: value === 'closed' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open" id="open" />
                <Label htmlFor="open" className={`cursor-pointer ${isLargeText ? 'text-base' : ''}`}>
                  {t('openOnly')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="closed" id="closed" />
                <Label htmlFor="closed" className={`cursor-pointer ${isLargeText ? 'text-base' : ''}`}>
                  {t('showAll')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
              size={isLargeText ? 'lg' : 'default'}
            >
              {t('resetFilters')}
            </Button>
            <Button onClick={handleApply} className="flex-1" size={isLargeText ? 'lg' : 'default'}>
              {t('applyFilters')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
