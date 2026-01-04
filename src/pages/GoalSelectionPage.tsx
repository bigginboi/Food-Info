import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import type { UserGoal } from '@/types/food-label';
import { User, Dumbbell, Heart, ShieldAlert, BookOpen } from 'lucide-react';

const goalOptions: Array<{
  value: UserGoal;
  label: string;
  description: string;
  icon: typeof User;
}> = [
  {
    value: 'normal-consumer',
    label: 'Normal Consumer',
    description: 'Just want clear, honest info',
    icon: User,
  },
  {
    value: 'fitness-focused',
    label: 'Fitness-Focused',
    description: 'Tracking macros & quality',
    icon: Dumbbell,
  },
  {
    value: 'health-conscious',
    label: 'Health-Conscious',
    description: 'Prioritizing clean eating',
    icon: Heart,
  },
  {
    value: 'medical-sensitivity',
    label: 'Medical Sensitivity',
    description: 'Need extra caution',
    icon: ShieldAlert,
  },
  {
    value: 'curious-learner',
    label: 'Curious Learner',
    description: 'Want to understand more',
    icon: BookOpen,
  },
];

export default function GoalSelectionPage() {
  const navigate = useNavigate();
  const { preferences, updateGoal } = useUserPreferences();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(preferences.goal);

  const handleContinue = () => {
    updateGoal(selectedGoal);
    navigate('/preferences');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background to-secondary p-4 xl:p-8">
      <div className="mx-auto w-full max-w-2xl space-y-8 py-8 xl:py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
            What describes you best?
          </h1>
          <p className="text-base text-muted-foreground xl:text-lg">
            This helps personalize your insights
          </p>
        </div>

        <div className="space-y-3">
          {goalOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedGoal === option.value;
            
            return (
              <Card
                key={option.value}
                className={`cursor-pointer border-2 p-4 transition-all hover:border-primary ${
                  isSelected ? 'border-primary bg-accent' : 'border-border'
                }`}
                onClick={() => setSelectedGoal(option.value)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button size="lg" className="w-full" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
