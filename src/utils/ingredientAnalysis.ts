import type {
  AnalysisResult,
  Ingredient,
  IngredientClassification,
  UserPreferences,
  VerdictType,
} from '@/types/food-label';
import { dataSources } from './mockData';

// Ingredient knowledge base for analysis
const ingredientDatabase: Record<string, Partial<Ingredient>> = {
  'wheat flour': {
    classification: 'processed',
    chemicalName: 'Refined Wheat Flour',
    whyUsed: "It's inexpensive, creates a desirable texture (chewy and soft), and is easy to process.",
    benefits: ['Provides carbohydrates for energy'],
    considerations: ['Low in fiber compared to whole wheat', 'Stripped of many vitamins and minerals during refining'],
    whoShouldCare: 'Individuals managing blood sugar levels, those looking for higher fiber intake, or anyone prioritizing nutrient-dense foods.',
  },
  'water': {
    classification: 'natural',
    whyUsed: 'Essential for hydration and as a base for mixing ingredients.',
    benefits: ['Essential for life', 'Hydration', 'No calories'],
    considerations: [],
  },
  'high fructose corn syrup': {
    classification: 'processed',
    chemicalName: 'High Fructose Corn Syrup (HFCS)',
    whyUsed: 'Sweetener that is cheaper than sugar and extends shelf life.',
    benefits: ['Provides sweetness', 'Cost-effective'],
    considerations: ['High in calories', 'May contribute to weight gain', 'Linked to metabolic issues when consumed in excess'],
    whoShouldCare: 'Anyone watching their sugar intake, managing weight, or concerned about metabolic health.',
  },
  'yeast': {
    classification: 'natural',
    whyUsed: 'Leavening agent that helps dough rise.',
    benefits: ['Natural fermentation', 'Provides B vitamins'],
    considerations: [],
  },
  'salt': {
    classification: 'natural',
    whyUsed: 'Enhances flavor and acts as a preservative.',
    benefits: ['Essential mineral', 'Flavor enhancement'],
    considerations: ['Excessive intake can lead to high blood pressure'],
    whoShouldCare: 'Individuals with hypertension or heart conditions.',
  },
  'calcium propionate': {
    classification: 'synthetic',
    chemicalName: 'Calcium Propionate (E282)',
    whyUsed: 'Preservative that prevents mold growth.',
    benefits: ['Extends shelf life', 'Generally recognized as safe by FDA'],
    considerations: ['Some individuals report sensitivity'],
    whoShouldCare: 'Individuals who report sensitivity to MSG or prefer to avoid synthetic additives.',
  },
  'monosodium glutamate': {
    classification: 'synthetic',
    chemicalName: 'Monosodium Glutamate (MSG)',
    whyUsed: 'They make the product\'s flavor more pronounced and appealing, often allowing for less natural spice to be used.',
    benefits: ['Enhances savory flavor significantly'],
    considerations: ['Some individuals report sensitivity to MSG, though scientific evidence for widespread adverse reactions is limited and often anecdotal.'],
    whoShouldCare: 'Individuals who report sensitivity to MSG or prefer to avoid synthetic additives.',
    evolvingScience: 'Research on MSG sensitivity is mixed: while some individuals report symptoms, large-scale studies haven\'t consistently linked it to adverse reactions in the general population when consumed at typical levels.',
  },
  'palm oil': {
    classification: 'processed',
    whyUsed: 'Used for frying the noodles, contributing to texture and shelf life.',
    benefits: ['Stable at high temperatures', 'Long shelf life'],
    considerations: ['High in saturated fat', 'Environmental concerns related to palm oil production'],
    whoShouldCare: 'Those monitoring saturated fat intake or concerned about environmental sustainability.',
  },
  'whey protein isolate': {
    classification: 'processed',
    whyUsed: 'High-quality protein source for muscle building and recovery.',
    benefits: ['High protein content', 'Complete amino acid profile', 'Fast absorption'],
    considerations: ['May cause digestive issues for lactose-intolerant individuals'],
    whoShouldCare: 'Athletes, fitness enthusiasts, or those with lactose intolerance.',
  },
  'erythritol': {
    classification: 'processed',
    chemicalName: 'Erythritol',
    whyUsed: 'Sugar alcohol used as a low-calorie sweetener.',
    benefits: ['Low calorie', 'Does not spike blood sugar', 'Tooth-friendly'],
    considerations: ['May cause digestive discomfort in large amounts'],
    whoShouldCare: 'Individuals managing blood sugar or those sensitive to sugar alcohols.',
  },
  'sucralose': {
    classification: 'synthetic',
    chemicalName: 'Sucralose',
    whyUsed: 'Artificial sweetener that is much sweeter than sugar with no calories.',
    benefits: ['Zero calories', 'Does not affect blood sugar'],
    considerations: ['Some prefer to avoid artificial sweeteners'],
    whoShouldCare: 'Those avoiding artificial ingredients or preferring natural alternatives.',
  },
  'carbonated water': {
    classification: 'natural',
    whyUsed: 'Provides fizz and refreshing sensation.',
    benefits: ['Hydration', 'No calories'],
    considerations: [],
  },
  'caramel color': {
    classification: 'processed',
    chemicalName: 'Caramel Color (E150)',
    whyUsed: 'Provides brown color to beverages.',
    benefits: ['Aesthetic appeal'],
    considerations: ['Some types may contain trace amounts of compounds formed during processing'],
    whoShouldCare: 'Those preferring to minimize processed additives.',
  },
  'phosphoric acid': {
    classification: 'synthetic',
    chemicalName: 'Phosphoric Acid (E338)',
    whyUsed: 'Provides tangy flavor and acts as a preservative.',
    benefits: ['Flavor enhancement', 'Preservative'],
    considerations: ['May affect calcium absorption when consumed in large amounts'],
    whoShouldCare: 'Individuals concerned about bone health.',
  },
  'caffeine': {
    classification: 'natural',
    whyUsed: 'Stimulant that provides energy boost.',
    benefits: ['Increased alertness', 'Improved focus'],
    considerations: ['Can cause jitters, sleep disruption, or dependency'],
    whoShouldCare: 'Those sensitive to caffeine or managing sleep issues.',
  },
};

// Parse ingredient list into individual ingredients
function parseIngredients(ingredientList: string): string[] {
  // Remove parenthetical content for main parsing
  const mainIngredients = ingredientList
    .split(/,(?![^()]*\))/)
    .map((ing) => ing.trim().toLowerCase())
    .filter((ing) => ing.length > 0);
  
  return mainIngredients;
}

// Classify ingredient based on database or heuristics
function classifyIngredient(ingredientName: string): IngredientClassification {
  const normalized = ingredientName.toLowerCase();
  
  // Check database first
  for (const [key, data] of Object.entries(ingredientDatabase)) {
    if (normalized.includes(key)) {
      return data.classification || 'processed';
    }
  }
  
  // Heuristic classification
  if (
    normalized.includes('natural') ||
    normalized.includes('water') ||
    normalized.includes('salt') ||
    normalized.includes('spice') ||
    normalized.includes('herb')
  ) {
    return 'natural';
  }
  
  if (
    normalized.includes('acid') ||
    normalized.includes('glutamate') ||
    normalized.includes('propionate') ||
    normalized.includes('benzoate') ||
    normalized.includes('artificial') ||
    normalized.includes('synthetic') ||
    normalized.includes('sucralose') ||
    normalized.includes('aspartame')
  ) {
    return 'synthetic';
  }
  
  return 'processed';
}

// Get ingredient details from database
function getIngredientDetails(ingredientName: string): Partial<Ingredient> {
  const normalized = ingredientName.toLowerCase();
  
  for (const [key, data] of Object.entries(ingredientDatabase)) {
    if (normalized.includes(key)) {
      return data;
    }
  }
  
  return {};
}

// Generate description based on classification
function generateDescription(name: string, classification: IngredientClassification): string {
  const details = getIngredientDetails(name);
  if (details.whyUsed) {
    return details.whyUsed;
  }
  
  switch (classification) {
    case 'natural':
      return 'A naturally occurring ingredient.';
    case 'processed':
      return 'A processed ingredient derived from natural sources.';
    case 'synthetic':
      return 'A synthetically produced ingredient.';
  }
}

// Analyze ingredients and generate result
export function analyzeIngredients(
  ingredientList: string,
  preferences: UserPreferences
): AnalysisResult {
  const parsedIngredients = parseIngredients(ingredientList);
  
  const ingredients: Ingredient[] = parsedIngredients.map((name) => {
    const classification = classifyIngredient(name);
    const details = getIngredientDetails(name);
    
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      classification,
      description: generateDescription(name, classification),
      chemicalName: details.chemicalName,
      whyUsed: details.whyUsed,
      benefits: details.benefits,
      considerations: details.considerations,
      whoShouldCare: details.whoShouldCare,
      evolvingScience: details.evolvingScience,
    };
  });
  
  // Calculate summary
  const naturalCount = ingredients.filter((i) => i.classification === 'natural').length;
  const processedCount = ingredients.filter((i) => i.classification === 'processed').length;
  const syntheticCount = ingredients.filter((i) => i.classification === 'synthetic').length;
  
  const summary = {
    totalCount: ingredients.length,
    naturalCount,
    processedCount,
    syntheticCount,
    summaryText: generateSummaryText(naturalCount, processedCount, syntheticCount),
  };
  
  // Determine verdict
  const verdict = determineVerdict(naturalCount, processedCount, syntheticCount);
  
  // Generate personalized insight
  const personalizedInsight = generatePersonalizedInsight(preferences, verdict.type, ingredients);
  
  return {
    summary,
    verdict,
    personalizedInsight,
    ingredients,
    sources: dataSources,
  };
}

function generateSummaryText(natural: number, processed: number, synthetic: number): string {
  const total = natural + processed + synthetic;
  const naturalPercent = Math.round((natural / total) * 100);
  const processedPercent = Math.round((processed / total) * 100);
  const syntheticPercent = Math.round((synthetic / total) * 100);
  
  if (naturalPercent > 60) {
    return `This product primarily consists of natural ingredients with some processed components.`;
  }
  if (syntheticPercent > 30) {
    return `This product contains a notable amount of synthetic additives and processed ingredients.`;
  }
  return `This product is a mix of natural, processed, and synthetic ingredients.`;
}

function determineVerdict(
  natural: number,
  processed: number,
  synthetic: number
): { type: VerdictType; explanation: string } {
  const total = natural + processed + synthetic;
  const syntheticPercent = (synthetic / total) * 100;
  const naturalPercent = (natural / total) * 100;
  
  if (naturalPercent > 60 && syntheticPercent < 10) {
    return {
      type: 'better-choice',
      explanation: 'This product contains mostly natural ingredients with minimal synthetic additives, making it a better choice for regular consumption.',
    };
  }
  
  if (syntheticPercent > 30 || processed > natural) {
    return {
      type: 'not-ideal',
      explanation: 'This product contains significant amounts of processed and synthetic ingredients, making it not ideal for daily consumption.',
    };
  }
  
  return {
    type: 'occasional-choice',
    explanation: 'While it contains natural ingredients, the presence of processed and synthetic components makes it suitable for occasional consumption rather than a daily staple.',
  };
}

function generatePersonalizedInsight(
  preferences: UserPreferences,
  verdict: VerdictType,
  ingredients: Ingredient[]
): string {
  const goalInsights: Record<string, string> = {
    'normal-consumer': 'This product is primarily a source of carbohydrates and fat, with flavor coming from a mix of natural spices and synthetic enhancers. If you\'re looking for a quick meal, it can fit, but consider its nutritional density and the presence of refined ingredients and additives.',
    'fitness-focused': 'From a fitness perspective, this product may not provide optimal nutrition. It\'s high in refined carbohydrates and may contain additives that don\'t support performance goals. Consider whole food alternatives for better nutrient density.',
    'health-conscious': 'For health-conscious individuals, this product contains several processed and synthetic ingredients that may not align with clean eating principles. The presence of additives and refined ingredients suggests it\'s better as an occasional choice.',
    'medical-sensitivity': 'If you have specific sensitivities or medical conditions, pay close attention to the synthetic additives and processed ingredients in this product. Some individuals report sensitivity to certain flavor enhancers and preservatives.',
    'curious-learner': 'This product offers an interesting case study in food manufacturing. It combines natural spices with synthetic flavor enhancers and processed ingredients to create a convenient, shelf-stable product. Understanding these ingredients helps you make informed choices.',
  };
  
  return goalInsights[preferences.goal] || goalInsights['normal-consumer'];
}

// Simulate OCR extraction (in real app, this would use actual OCR)
export function extractTextFromImage(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate OCR result
      resolve('Wheat flour, water, sugar, yeast, salt, vegetable oil, preservatives (calcium propionate)');
    }, 1500);
  });
}

// Detect if image contains food product
export function detectFoodItem(imageData: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate food detection (90% success rate)
      resolve(Math.random() > 0.1);
    }, 1000);
  });
}
