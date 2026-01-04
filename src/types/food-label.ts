export type UserGoal = 
  | 'normal-consumer'
  | 'fitness-focused'
  | 'health-conscious'
  | 'medical-sensitivity'
  | 'curious-learner';

export type TonePreference = 'simple' | 'balanced' | 'detailed';

export type IngredientClassification = 'natural' | 'processed' | 'synthetic';

export type VerdictType = 'better-choice' | 'occasional-choice' | 'not-ideal';

export interface UserPreferences {
  goal: UserGoal;
  tonePreference: TonePreference;
  flagHighSugar: boolean;
  flagArtificialAdditives: boolean;
  flagPreservatives: boolean;
  flagAllergens: boolean;
}

export interface Ingredient {
  name: string;
  classification: IngredientClassification;
  description: string;
  chemicalName?: string;
  whyUsed?: string;
  benefits?: string[];
  considerations?: string[];
  whoShouldCare?: string;
  evolvingScience?: string;
  allergens?: string[];
}

export interface IngredientSummary {
  totalCount: number;
  naturalCount: number;
  processedCount: number;
  syntheticCount: number;
  summaryText: string;
  allergens: string[];
}

export interface AnalysisResult {
  summary: IngredientSummary;
  verdict: {
    type: VerdictType;
    explanation: string;
  };
  personalizedInsight: string;
  ingredients: Ingredient[];
  sources: string[];
}

export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  ingredientList: string;
}
