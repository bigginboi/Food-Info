import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import type { TonePreference } from '@/types/food-label';
import { ArrowLeft } from 'lucide-react';

const toneOptions: Array<{ value: TonePreference; label: string }> = [
  { value: 'simple', label: 'Simple' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'detailed', label: 'Detailed' },
];

export default function PreferenceConfigPage() {
  const navigate = useNavigate();
  const { preferences, updateTonePreference, updateFlags } = useUserPreferences();
  
  const [tone, setTone] = useState<TonePreference>(preferences.tonePreference);
  const [flagHighSugar, setFlagHighSugar] = useState(preferences.flagHighSugar);
  const [flagArtificialAdditives, setFlagArtificialAdditives] = useState(preferences.flagArtificialAdditives);
  const [flagPreservatives, setFlagPreservatives] = useState(preferences.flagPreservatives);
  const [flagAllergens, setFlagAllergens] = useState(preferences.flagAllergens);

  const handleStartScanning = () => {
    updateTonePreference(tone);
    updateFlags({
      flagHighSugar,
      flagArtificialAdditives,
      flagPreservatives,
      flagAllergens,
    });
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background to-secondary p-4 xl:p-8">
      <div className="mx-auto w-full max-w-2xl space-y-8 py-8 xl:py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
            Customize your experience
          </h1>
          <p className="text-base text-muted-foreground xl:text-lg">
            Fine-tune how we explain things
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Explanation style</Label>
            <div className="flex gap-2">
              {toneOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={tone === option.value ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setTone(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Flag these for me</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-sugar" className="cursor-pointer">
                  High sugar content
                </Label>
                <Switch
                  id="high-sugar"
                  checked={flagHighSugar}
                  onCheckedChange={setFlagHighSugar}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="artificial-additives" className="cursor-pointer">
                  Artificial additives
                </Label>
                <Switch
                  id="artificial-additives"
                  checked={flagArtificialAdditives}
                  onCheckedChange={setFlagArtificialAdditives}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="preservatives" className="cursor-pointer">
                  Preservatives
                </Label>
                <Switch
                  id="preservatives"
                  checked={flagPreservatives}
                  onCheckedChange={setFlagPreservatives}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allergens" className="cursor-pointer">
                  Common allergens
                </Label>
                <Switch
                  id="allergens"
                  checked={flagAllergens}
                  onCheckedChange={setFlagAllergens}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-20"
            onClick={() => navigate('/goal-selection')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button size="lg" className="flex-1" onClick={handleStartScanning}>
            Start Scanning
          </Button>
        </div>
      </div>
    </div>
  );
}
