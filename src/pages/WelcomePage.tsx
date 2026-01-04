import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-lg">
          <Sparkles className="h-12 w-12 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground xl:text-5xl">
            Understand what's really in your food
          </h1>
          <p className="text-lg text-muted-foreground xl:text-xl">
            Get clear, honest ingredient insights — in seconds.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full max-w-xs text-lg"
          onClick={() => navigate('/goal-selection')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
