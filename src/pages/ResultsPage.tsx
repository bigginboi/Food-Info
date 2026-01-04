import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, User, Lightbulb } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { analyzeIngredients } from '@/utils/ingredientAnalysis';
import type { AnalysisResult } from '@/types/food-label';
import IngredientCard from '@/components/IngredientCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    const ingredientList = location.state?.ingredientList;
    if (!ingredientList) {
      navigate('/home');
      return;
    }

    const analysis = analyzeIngredients(ingredientList, preferences);
    setResult(analysis);
  }, [location.state, preferences, navigate]);

  if (!result) {
    return null;
  }

  const { summary, verdict, personalizedInsight, ingredients, sources } = result;

  const naturalPercent = (summary.naturalCount / summary.totalCount) * 100;
  const processedPercent = (summary.processedCount / summary.totalCount) * 100;
  const syntheticPercent = (summary.syntheticCount / summary.totalCount) * 100;

  const verdictConfig = {
    'better-choice': {
      label: 'Better Choice',
      bgColor: 'bg-natural/10',
      borderColor: 'border-natural',
      textColor: 'text-natural',
      icon: CheckCircle2,
    },
    'occasional-choice': {
      label: 'Occasional Choice',
      bgColor: 'bg-processed/10',
      borderColor: 'border-processed',
      textColor: 'text-processed',
      icon: AlertTriangle,
    },
    'not-ideal': {
      label: 'Not Ideal for Daily Use',
      bgColor: 'bg-synthetic/10',
      borderColor: 'border-synthetic',
      textColor: 'text-synthetic',
      icon: AlertTriangle,
    },
  };

  const verdictStyle = verdictConfig[verdict.type];
  const VerdictIcon = verdictStyle.icon;

  const goalLabels = {
    'normal-consumer': 'NORMAL CONSUMER',
    'fitness-focused': 'FITNESS-FOCUSED',
    'health-conscious': 'HEALTH-CONSCIOUS',
    'medical-sensitivity': 'MEDICAL SENSITIVITY',
    'curious-learner': 'CURIOUS LEARNER',
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="mx-auto w-full max-w-3xl space-y-6 p-4 py-6 xl:p-8 xl:py-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Analysis Results</h1>
        </div>

        {/* Ingredient Summary */}
        <Card className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Product contains</p>
            <h2 className="text-3xl font-bold">{summary.totalCount} ingredients</h2>
          </div>

          <p className="text-sm text-foreground">{summary.summaryText}</p>

          <div className="space-y-2">
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              <div
                className="bg-natural"
                style={{ width: `${naturalPercent}%` }}
              />
              <div
                className="bg-processed"
                style={{ width: `${processedPercent}%` }}
              />
              <div
                className="bg-synthetic"
                style={{ width: `${syntheticPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-natural" />
                <span>Natural ({summary.naturalCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-processed" />
                <span>Processed ({summary.processedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-synthetic" />
                <span>Synthetic ({summary.syntheticCount})</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Overall Verdict */}
        <Card className={`border-2 p-6 ${verdictStyle.borderColor} ${verdictStyle.bgColor}`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${verdictStyle.bgColor}`}>
              <VerdictIcon className={`h-6 w-6 ${verdictStyle.textColor}`} />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className={`text-xl font-bold ${verdictStyle.textColor}`}>
                {verdictStyle.label}
              </h3>
              <p className="text-sm text-foreground">{verdict.explanation}</p>
            </div>
          </div>
        </Card>

        {/* Personalized Insight */}
        <Card className="bg-accent/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                FOR A {goalLabels[preferences.goal]}
              </h3>
              <p className="text-sm text-foreground">{personalizedInsight}</p>
            </div>
          </div>
        </Card>

        {/* Ingredient Breakdown */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Ingredient Breakdown</h2>
          {ingredients.map((ingredient, index) => (
            <IngredientCard key={index} ingredient={ingredient} />
          ))}
        </div>

        {/* Sources */}
        <Card className="p-6">
          <Collapsible open={showSources} onOpenChange={setShowSources}>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Where this information comes from</h3>
              </div>
              {showSources ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-2">
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Disclaimer */}
        <Alert>
          <AlertDescription className="text-xs">
            This app summarizes public research and regulatory guidance. It does not provide medical advice. Always consult healthcare professionals for dietary concerns.
          </AlertDescription>
        </Alert>

        <Button size="lg" className="w-full" onClick={() => navigate('/home')}>
          Scan Another Product
        </Button>
      </div>
    </div>
  );
}
