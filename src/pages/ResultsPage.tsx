import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, User, Lightbulb, AlertCircle, Package } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { analyzeIngredients } from '@/utils/ingredientAnalysis';
import type { AnalysisResult } from '@/types/food-label';
import IngredientCard from '@/components/IngredientCard';
import AppHeader from '@/components/AppHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);

  useEffect(() => {
    const ingredientList = location.state?.ingredientList;
    const detectedProductName = location.state?.productName;
    
    if (!ingredientList) {
      navigate('/home');
      return;
    }

    if (detectedProductName) {
      setProductName(detectedProductName);
    }

    try {
      const analysis = analyzeIngredients(ingredientList, preferences);
      setResult(analysis);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze ingredients');
      setResult(null);
    }
  }, [location.state, preferences, navigate]);

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <AppHeader />
        
        <div className="mx-auto w-full max-w-3xl space-y-6 p-4 py-6 xl:p-8 xl:py-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Analysis Error</h1>
          </div>

          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-destructive">Unable to Analyze</p>
                <p className="text-sm text-foreground">{error}</p>
                <Button 
                  onClick={() => navigate('/home')} 
                  variant="outline"
                  className="mt-2"
                >
                  Return to Home
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
      <AppHeader />
      
      <div className="mx-auto w-full max-w-3xl space-y-6 p-4 py-6 xl:p-8 xl:py-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Analysis Results</h1>
        </div>

        {/* Product Name */}
        {productName && (
          <Card className="border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Scanned Product</p>
                <p className="text-lg font-bold text-foreground">{productName}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Allergen Warning */}
        {summary.allergens.length > 0 && (
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-destructive">Contains Allergens</p>
                <div className="flex flex-wrap gap-2">
                  {summary.allergens.map((allergen, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-foreground">
                  This product contains ingredients that may cause allergic reactions in sensitive individuals.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                <span className="font-medium">Natural ({summary.naturalCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-processed" />
                <span className="font-medium">Processed ({summary.processedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-synthetic" />
                <span className="font-medium">Synthetic ({summary.syntheticCount})</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Impact Summary */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Health Impact Summary</h2>
          
          <div className="space-y-3">
            <div className="rounded-lg border-2 border-natural/30 bg-natural/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-natural mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-natural mb-1">Good for Health</h3>
                  <p className="text-sm text-foreground">
                    {summary.naturalCount > 0 
                      ? `Contains ${summary.naturalCount} natural ingredient${summary.naturalCount > 1 ? 's' : ''} that provide nutritional benefits, vitamins, minerals, and support overall health without artificial processing.`
                      : 'No natural ingredients found in this product.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-processed/30 bg-processed/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-processed mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-processed mb-1">Moderate Concerns</h3>
                  <p className="text-sm text-foreground">
                    {summary.processedCount > 0
                      ? `Contains ${summary.processedCount} processed ingredient${summary.processedCount > 1 ? 's' : ''} that have been refined or modified. These may lack fiber, nutrients, or contain added sugars and unhealthy fats.`
                      : 'No processed ingredients found.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-synthetic/30 bg-synthetic/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-synthetic mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-synthetic mb-1">Health Cautions</h3>
                  <p className="text-sm text-foreground">
                    {summary.syntheticCount > 0
                      ? `Contains ${summary.syntheticCount} synthetic ingredient${summary.syntheticCount > 1 ? 's' : ''} that are artificially created. These may include preservatives, artificial sweeteners, or flavor enhancers that some people prefer to avoid.`
                      : 'No synthetic ingredients found.'}
                  </p>
                </div>
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
            <CollapsibleContent className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                All ingredient information is based on data from authoritative health and regulatory organizations:
              </p>
              <div className="space-y-3">
                {sources.map((source, index) => (
                  <div key={index} className="rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block space-y-1"
                    >
                      <h4 className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                        {source.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {source.description}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
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
