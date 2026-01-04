import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, User, Lightbulb } from 'lucide-react';
import type { Ingredient } from '@/types/food-label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const classificationConfig = {
    natural: {
      label: 'Natural',
      color: 'bg-natural text-natural-foreground',
      dotColor: 'bg-natural',
    },
    processed: {
      label: 'Processed',
      color: 'bg-processed text-processed-foreground',
      dotColor: 'bg-processed',
    },
    synthetic: {
      label: 'Synthetic',
      color: 'bg-synthetic text-synthetic-foreground',
      dotColor: 'bg-synthetic',
    },
  };

  const config = classificationConfig[ingredient.classification];
  const hasDetails = ingredient.chemicalName || ingredient.whyUsed || ingredient.benefits || ingredient.considerations;

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-4 text-left hover:bg-accent/50 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${config.dotColor}`} />
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">{ingredient.name}</h3>
                  <Badge variant="secondary" className={config.color}>
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ingredient.description}</p>
              </div>
            </div>
            {hasDetails && (
              <div className="shrink-0">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
        </CollapsibleTrigger>

        {hasDetails && (
          <CollapsibleContent>
            <div className="border-t bg-muted/30 p-4 space-y-4">
              {ingredient.chemicalName && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Chemical Name
                  </h4>
                  <p className="text-sm text-foreground">{ingredient.chemicalName}</p>
                </div>
              )}

              {ingredient.whyUsed && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Why It's Used
                  </h4>
                  <p className="text-sm text-foreground">{ingredient.whyUsed}</p>
                </div>
              )}

              {ingredient.benefits && ingredient.benefits.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Benefits
                  </h4>
                  <ul className="space-y-1">
                    {ingredient.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-natural mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredient.considerations && ingredient.considerations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Considerations
                  </h4>
                  <ul className="space-y-1">
                    {ingredient.considerations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-processed mt-0.5" />
                        <span className="text-foreground">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredient.whoShouldCare && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Who Should Care More
                  </h4>
                  <div className="flex items-start gap-2 text-sm">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <span className="text-foreground">{ingredient.whoShouldCare}</span>
                  </div>
                </div>
              )}

              {ingredient.evolvingScience && (
                <Alert className="bg-evolving-bg border-evolving-border">
                  <Lightbulb className="h-4 w-4 text-foreground" />
                  <AlertDescription>
                    <h4 className="text-xs font-semibold uppercase mb-1">Evolving Science</h4>
                    <p className="text-sm">{ingredient.evolvingScience}</p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </Card>
  );
}
