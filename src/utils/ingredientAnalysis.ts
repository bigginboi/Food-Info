import type {
  AnalysisResult,
  Ingredient,
  IngredientClassification,
  UserPreferences,
  VerdictType,
} from '@/types/food-label';
import { dataSources } from './mockData';

// Non-food keywords that indicate invalid input
const NON_FOOD_KEYWORDS = [
  // Household items
  'detergent', 'soap', 'shampoo', 'conditioner', 'lotion', 'cleanser',
  'bleach', 'disinfectant', 'sanitizer', 'polish', 'wax',
  // Electronics
  'battery', 'charger', 'cable', 'wire', 'circuit', 'electronic', 'computer',
  'phone', 'tablet', 'laptop', 'monitor', 'keyboard', 'mouse',
  // Clothing/Textiles
  'fabric', 'textile', 'polyester', 'nylon', 'clothing', 'shirt',
  'pants', 'dress', 'shoes', 'socks', 'underwear',
  // Tools/Hardware
  'hammer', 'screwdriver', 'wrench', 'drill', 'saw', 'nail', 'screw',
  'bolt', 'tool', 'hardware',
  // Furniture
  'chair', 'desk', 'bed', 'sofa', 'couch', 'furniture',
  // Cosmetics/Personal Care
  'makeup', 'lipstick', 'mascara', 'foundation', 'perfume', 'cologne',
  'deodorant', 'toothpaste', 'mouthwash',
  // Automotive
  'motor oil', 'gasoline', 'diesel', 'antifreeze', 'brake fluid',
  // Office supplies
  'paper', 'pen', 'pencil', 'stapler', 'tape', 'glue',
  // Chemicals
  'solvent', 'thinner', 'acetone', 'ammonia',
];

// Common food-related words that should pass validation
const FOOD_KEYWORDS = [
  'flour', 'sugar', 'salt', 'water', 'oil', 'butter', 'milk', 'egg',
  'wheat', 'corn', 'rice', 'oat', 'barley', 'soy', 'protein',
  'vitamin', 'mineral', 'preservative', 'flavor', 'color', 'starch',
  'yeast', 'baking', 'spice', 'herb', 'extract', 'acid', 'syrup',
  'sweetener', 'emulsifier', 'thickener', 'stabilizer', 'lecithin',
  'gelatin', 'pectin', 'agar', 'carrageenan', 'gum', 'fiber',
];

// Validate if input is food-related
function validateFoodInput(ingredientList: string): { isValid: boolean; reason?: string } {
  const normalized = ingredientList.toLowerCase();
  
  // Check for non-food keywords with context awareness
  for (const keyword of NON_FOOD_KEYWORDS) {
    if (normalized.includes(keyword)) {
      // Skip false positives - check if it's part of a food term
      const foodExceptions: Record<string, string[]> = {
        'table': ['table salt', 'tablespoon'],
        'cream': ['ice cream', 'sour cream', 'cream cheese', 'whipping cream', 'heavy cream'],
        'alcohol': ['sugar alcohol'],
        'cotton': ['cottonseed'],
      };
      
      // Check if this keyword has exceptions
      if (foodExceptions[keyword]) {
        let isException = false;
        for (const exception of foodExceptions[keyword]) {
          if (normalized.includes(exception)) {
            isException = true;
            break;
          }
        }
        if (isException) {
          continue; // Skip this keyword, it's a valid food term
        }
      }
      
      return {
        isValid: false,
        reason: `This appears to be a non-food item (detected: "${keyword}"). Please scan or enter food product ingredients only.`
      };
    }
  }
  
  // If input is very short and doesn't contain food keywords, it might be invalid
  if (ingredientList.length < 10) {
    const hasAnyFoodKeyword = FOOD_KEYWORDS.some(keyword => normalized.includes(keyword));
    if (!hasAnyFoodKeyword) {
      return {
        isValid: false,
        reason: 'Input too short or does not appear to be food ingredients. Please enter a valid ingredient list.'
      };
    }
  }
  
  return { isValid: true };
}

// Ingredient knowledge base for analysis
const ingredientDatabase: Record<string, Partial<Ingredient>> = {
  'wheat flour': {
    classification: 'processed',
    chemicalName: 'Refined Wheat Flour',
    whyUsed: "It's inexpensive, creates a desirable texture (chewy and soft), and is easy to process.",
    benefits: ['Provides carbohydrates for energy', 'Source of some B vitamins and iron (when enriched)', 'Easy to digest for most people'],
    considerations: ['Low in fiber compared to whole wheat', 'Stripped of many vitamins and minerals during refining', 'High glycemic index may cause blood sugar spikes', 'Contains gluten which some people cannot tolerate'],
    whoShouldCare: 'Individuals managing blood sugar levels, those looking for higher fiber intake, people with celiac disease or gluten sensitivity, or anyone prioritizing nutrient-dense foods.',
    allergens: ['Wheat', 'Gluten'],
  },
  'enriched wheat flour': {
    classification: 'processed',
    chemicalName: 'Enriched Refined Wheat Flour',
    whyUsed: "Refined flour with added vitamins and minerals to replace nutrients lost during processing.",
    benefits: ['Provides carbohydrates for energy', 'Fortified with B vitamins (niacin, thiamine, riboflavin, folic acid) and iron', 'Helps prevent nutrient deficiencies'],
    considerations: ['Still low in fiber compared to whole wheat', 'High glycemic index may cause blood sugar spikes', 'Contains gluten', 'Enrichment doesn\'t replace all lost nutrients from refining'],
    whoShouldCare: 'Individuals managing blood sugar levels, those looking for higher fiber intake, people with celiac disease or gluten sensitivity.',
    allergens: ['Wheat', 'Gluten'],
  },
  'water': {
    classification: 'natural',
    whyUsed: 'Essential for hydration and as a base for mixing ingredients.',
    benefits: ['Essential for life and bodily functions', 'Zero calories', 'Helps with hydration', 'No additives or processing'],
    considerations: [],
  },
  'high fructose corn syrup': {
    classification: 'processed',
    chemicalName: 'High Fructose Corn Syrup (HFCS)',
    whyUsed: 'Sweetener that is cheaper than sugar and extends shelf life.',
    benefits: ['Provides sweetness and energy', 'Cost-effective for manufacturers', 'Extends product shelf life'],
    considerations: ['High in calories with no nutritional value', 'May contribute to weight gain and obesity according to FDA studies', 'Linked to increased risk of type 2 diabetes per American Diabetes Association', 'Associated with non-alcoholic fatty liver disease when consumed in excess', 'Can increase triglyceride levels', 'May promote insulin resistance', 'Dietary Guidelines for Americans recommend limiting added sugars to less than 10% of daily calories', 'No fiber, vitamins, or minerals'],
    whoShouldCare: 'Anyone watching their sugar intake, managing weight, people with diabetes or prediabetes, those concerned about metabolic health, individuals with fatty liver disease, people following Dietary Guidelines for Americans.',
  },
  'sugar': {
    classification: 'processed',
    chemicalName: 'Sucrose',
    whyUsed: 'Provides sweetness and enhances flavor.',
    benefits: ['Quick source of energy', 'Enhances taste and palatability'],
    considerations: ['High in calories with no nutritional value (empty calories)', 'Can cause blood sugar spikes', 'Linked to tooth decay and cavities', 'Excessive consumption associated with obesity, type 2 diabetes, and heart disease per FDA', 'May be addictive according to research', 'American Heart Association recommends limiting added sugars to 25g/day for women and 36g/day for men', 'Contributes to inflammation when consumed in excess', 'No vitamins, minerals, or fiber'],
    whoShouldCare: 'People with diabetes, those managing weight, individuals concerned about dental health, anyone trying to reduce sugar intake, people following American Heart Association guidelines.',
  },
  'yeast': {
    classification: 'natural',
    whyUsed: 'Leavening agent that helps dough rise through natural fermentation.',
    benefits: ['Natural fermentation process', 'Provides B vitamins (especially B12 in nutritional yeast)', 'Source of protein and minerals', 'Improves digestibility of grains', 'Contains beneficial compounds'],
    considerations: ['May cause issues for people with yeast allergies', 'Can trigger symptoms in those with candida overgrowth'],
    whoShouldCare: 'Individuals with yeast allergies or sensitivities, people managing candida issues.',
  },
  'salt': {
    classification: 'natural',
    whyUsed: 'Enhances flavor and acts as a preservative.',
    benefits: ['Essential mineral (sodium) needed for nerve and muscle function', 'Helps maintain fluid balance', 'Flavor enhancement', 'Natural preservative'],
    considerations: ['Excessive intake can lead to high blood pressure', 'May increase risk of heart disease and stroke per American Heart Association', 'Can cause water retention', 'Linked to kidney problems in excess', 'FDA recommends limiting sodium to less than 2,300mg per day (about 1 teaspoon of salt)', 'Average American consumes 3,400mg daily, exceeding recommendations', 'May contribute to stomach cancer risk when consumed in very high amounts'],
    whoShouldCare: 'Individuals with hypertension, heart conditions, kidney disease, or those on sodium-restricted diets, people following FDA dietary guidelines.',
  },
  'calcium propionate': {
    classification: 'synthetic',
    chemicalName: 'Calcium Propionate (E282)',
    whyUsed: 'Preservative that prevents mold and bacterial growth.',
    benefits: ['Extends shelf life significantly', 'Generally recognized as safe by FDA', 'Prevents food waste', 'Effective at low concentrations'],
    considerations: ['Some individuals report headaches or migraines', 'May cause digestive issues in sensitive people', 'Possible link to behavioral changes in children (limited evidence)', 'Synthetic additive some prefer to avoid'],
    whoShouldCare: 'Individuals who report sensitivity to preservatives, parents of children with behavioral concerns, those preferring to avoid synthetic additives.',
  },
  'monosodium glutamate': {
    classification: 'synthetic',
    chemicalName: 'Monosodium Glutamate (MSG)',
    whyUsed: 'Flavor enhancer that intensifies savory (umami) taste, allowing manufacturers to use less natural ingredients.',
    benefits: ['Enhances savory flavor significantly', 'Allows for reduced sodium in some products', 'Generally recognized as safe by FDA'],
    considerations: ['Some individuals report sensitivity symptoms (headaches, flushing, sweating)', 'May increase appetite and food intake', 'Can mask poor quality ingredients', 'Concerns about potential effects on brain health (ongoing research)', 'May cause allergic-like reactions in sensitive individuals'],
    whoShouldCare: 'Individuals who report sensitivity to MSG, those trying to control appetite, people preferring whole food ingredients, anyone avoiding synthetic additives.',
    evolvingScience: 'Research on MSG sensitivity is mixed: while some individuals report symptoms, large-scale studies haven\'t consistently linked it to adverse reactions in the general population when consumed at typical levels. However, some studies suggest potential concerns with high doses.',
  },
  'disodium inosinate': {
    classification: 'synthetic',
    chemicalName: 'Disodium Inosinate (E631)',
    whyUsed: 'Flavor enhancer that works synergistically with MSG to boost savory taste.',
    benefits: ['Enhances umami flavor', 'Allows for reduced use of other flavor enhancers'],
    considerations: ['Often used alongside MSG', 'May cause reactions in people sensitive to flavor enhancers', 'Derived from animal or fish sources (concern for vegetarians)', 'Synthetic additive'],
    whoShouldCare: 'Vegetarians and vegans, people sensitive to flavor enhancers, those avoiding synthetic additives.',
  },
  'disodium guanylate': {
    classification: 'synthetic',
    chemicalName: 'Disodium Guanylate (E627)',
    whyUsed: 'Flavor enhancer that amplifies savory taste, often used with MSG.',
    benefits: ['Enhances umami flavor', 'Effective at low concentrations'],
    considerations: ['Often combined with MSG', 'May cause reactions in sensitive individuals', 'Not recommended for people with gout (contains purines)', 'Derived from yeast or fish', 'Synthetic additive'],
    whoShouldCare: 'People with gout or high uric acid levels, those sensitive to flavor enhancers, individuals avoiding synthetic additives.',
  },
  'palm oil': {
    classification: 'processed',
    whyUsed: 'Used for frying and adding texture; stable at high temperatures with long shelf life.',
    benefits: ['Stable at high temperatures for cooking', 'Long shelf life reduces food waste', 'Source of vitamin E (tocotrienols and tocopherols)', 'Contains beta-carotene (provitamin A)', 'Semi-solid at room temperature (good for texture)', 'Does not require hydrogenation (no trans fats)'],
    considerations: ['High in saturated fat (approximately 50% of total fat content)', 'May raise LDL (bad) cholesterol levels according to FDA studies', 'Environmental concerns (deforestation, habitat destruction for orangutans)', 'Linked to increased cardiovascular disease risk when consumed in excess', 'American Heart Association recommends limiting saturated fat intake', 'May contribute to inflammation when consumed regularly'],
    whoShouldCare: 'Those monitoring saturated fat intake, people with high cholesterol or heart disease, individuals following American Heart Association guidelines, environmentally conscious consumers.',
    allergens: [],
  },
  'soybean oil': {
    classification: 'processed',
    chemicalName: 'Refined Soybean Oil',
    whyUsed: 'Inexpensive cooking oil that adds moisture and extends shelf life.',
    benefits: ['Source of polyunsaturated fats', 'Contains vitamin E', 'Neutral flavor', 'Cost-effective'],
    considerations: ['Highly processed and refined', 'High in omega-6 fatty acids (may promote inflammation when ratio to omega-3 is imbalanced)', 'Often genetically modified', 'May contain trans fats if partially hydrogenated'],
    whoShouldCare: 'People concerned about omega-6 to omega-3 ratio, those avoiding GMOs, individuals with soy allergies.',
    allergens: ['Soy'],
  },
  'whey protein isolate': {
    classification: 'processed',
    whyUsed: 'High-quality protein source for muscle building and recovery.',
    benefits: ['High protein content (90%+ protein)', 'Complete amino acid profile', 'Fast absorption for muscle recovery', 'Supports muscle growth and repair', 'May aid in weight management', 'Low in lactose'],
    considerations: ['May cause digestive issues for some people', 'Can trigger acne in sensitive individuals', 'Processed dairy product', 'May contain artificial sweeteners', 'Not suitable for vegans'],
    whoShouldCare: 'Athletes and fitness enthusiasts (positive), people with dairy sensitivities, those with acne-prone skin, vegans.',
    allergens: ['Milk', 'Dairy'],
  },
  'milk protein isolate': {
    classification: 'processed',
    chemicalName: 'Milk Protein Isolate',
    whyUsed: 'Concentrated protein source with slow and fast-digesting proteins.',
    benefits: ['High protein content', 'Contains both whey and casein proteins', 'Supports muscle growth', 'Provides sustained amino acid release'],
    considerations: ['Contains lactose (may cause issues for lactose-intolerant individuals)', 'Processed dairy product', 'Not suitable for vegans', 'May cause digestive discomfort'],
    whoShouldCare: 'People with lactose intolerance, those with dairy allergies, vegans.',
    allergens: ['Milk', 'Dairy', 'Lactose'],
  },
  'erythritol': {
    classification: 'processed',
    chemicalName: 'Erythritol',
    whyUsed: 'Sugar alcohol used as a low-calorie sweetener.',
    benefits: ['Very low calorie (0.2 calories per gram)', 'Does not spike blood sugar or insulin', 'Tooth-friendly (doesn\'t cause cavities)', 'About 70% as sweet as sugar', 'Generally well-tolerated'],
    considerations: ['May cause digestive discomfort (bloating, gas) in large amounts', 'Can have a cooling aftertaste', 'Laxative effect if consumed in excess', 'Recent studies suggest possible link to cardiovascular events (ongoing research)'],
    whoShouldCare: 'Individuals managing blood sugar (positive), those sensitive to sugar alcohols, people with digestive issues.',
    evolvingScience: 'Recent research has raised questions about potential cardiovascular effects of erythritol, though more studies are needed to confirm these findings. Most health authorities still consider it safe at typical consumption levels.',
  },
  'sucralose': {
    classification: 'synthetic',
    chemicalName: 'Sucralose',
    whyUsed: 'Artificial sweetener that is 600 times sweeter than sugar with no calories.',
    benefits: ['Zero calories', 'Does not affect blood sugar or insulin levels', 'Heat-stable for cooking', 'No bitter aftertaste'],
    considerations: ['Artificial sweetener some prefer to avoid', 'May alter gut bacteria composition', 'Possible effects on glucose metabolism with regular use', 'May increase cravings for sweet foods', 'Not metabolized by the body'],
    whoShouldCare: 'Those avoiding artificial ingredients, people concerned about gut health, individuals preferring natural alternatives.',
    evolvingScience: 'Emerging research suggests sucralose may affect gut microbiome and glucose metabolism, though it\'s still approved as safe by regulatory agencies. Long-term effects are still being studied.',
  },
  'steviol glycosides': {
    classification: 'processed',
    chemicalName: 'Steviol Glycosides (from Stevia)',
    whyUsed: 'Natural-origin sweetener extracted from stevia plant.',
    benefits: ['Zero calories', 'Does not affect blood sugar', 'Derived from natural plant source', '200-300 times sweeter than sugar', 'May have antioxidant properties'],
    considerations: ['Can have a bitter or licorice-like aftertaste', 'Highly processed despite natural origin', 'May cause digestive issues in some people', 'Possible effects on blood pressure (may lower it)'],
    whoShouldCare: 'People with low blood pressure, those sensitive to stevia, individuals preferring less processed sweeteners.',
  },
  'carbonated water': {
    classification: 'natural',
    whyUsed: 'Provides fizz and refreshing sensation.',
    benefits: ['Hydration', 'Zero calories', 'No sugar', 'May help with digestion', 'Satisfying alternative to sugary sodas'],
    considerations: ['May cause bloating or gas in some people', 'Can erode tooth enamel if consumed in large amounts (due to carbonic acid)', 'May trigger IBS symptoms in sensitive individuals'],
    whoShouldCare: 'People with IBS or digestive sensitivities, those concerned about dental health.',
  },
  'caramel color': {
    classification: 'processed',
    chemicalName: 'Caramel Color (E150)',
    whyUsed: 'Provides brown color to beverages and foods.',
    benefits: ['Aesthetic appeal', 'Consistent color', 'Cost-effective'],
    considerations: ['Some types (Class III and IV) may contain 4-methylimidazole (4-MEI), a potential carcinogen', 'Purely cosmetic with no nutritional value', 'May mask poor quality ingredients', 'Highly processed'],
    whoShouldCare: 'Those preferring to minimize processed additives, people concerned about potential carcinogens, anyone prioritizing whole foods.',
  },
  'phosphoric acid': {
    classification: 'synthetic',
    chemicalName: 'Phosphoric Acid (E338)',
    whyUsed: 'Provides tangy flavor and acts as a preservative and acidulant.',
    benefits: ['Flavor enhancement', 'Preservative properties', 'Prevents bacterial growth'],
    considerations: ['May interfere with calcium absorption', 'Linked to lower bone mineral density', 'Can contribute to kidney problems with excessive consumption', 'May erode tooth enamel', 'Associated with increased risk of chronic kidney disease'],
    whoShouldCare: 'Individuals concerned about bone health, people with kidney disease or at risk, those with osteoporosis, children and adolescents building bone mass.',
  },
  'caffeine': {
    classification: 'natural',
    whyUsed: 'Stimulant that provides energy boost and enhances alertness.',
    benefits: ['Increased alertness and focus', 'Improved physical performance', 'May boost metabolism', 'Contains antioxidants', 'May reduce risk of certain diseases (Parkinson\'s, Alzheimer\'s)', 'Enhances mood'],
    considerations: ['Can cause jitters, anxiety, and restlessness', 'May disrupt sleep patterns', 'Can lead to dependency and withdrawal symptoms', 'May increase heart rate and blood pressure', 'Can cause digestive issues', 'May worsen anxiety disorders'],
    whoShouldCare: 'Those sensitive to caffeine, people with anxiety disorders, individuals with heart conditions, pregnant women, those managing sleep issues.',
  },
  'citric acid': {
    classification: 'processed',
    chemicalName: 'Citric Acid (E330)',
    whyUsed: 'Provides tartness, acts as preservative, and enhances flavor.',
    benefits: ['Natural preservative', 'Enhances flavor', 'May improve mineral absorption', 'Antioxidant properties'],
    considerations: ['Usually manufactured from mold (Aspergillus niger) rather than citrus fruits', 'May cause tooth enamel erosion in high concentrations', 'Can trigger allergic reactions in sensitive individuals', 'May cause digestive upset in large amounts'],
    whoShouldCare: 'People with citrus allergies, those with sensitive teeth, individuals with digestive sensitivities.',
  },
  'natural flavors': {
    classification: 'processed',
    chemicalName: 'Natural Flavoring Substances',
    whyUsed: 'Enhances or adds specific flavors to products.',
    benefits: ['Derived from natural sources (plants, animals)', 'Enhances taste without adding calories', 'Allows for consistent flavor'],
    considerations: ['Highly processed despite "natural" label', 'Can contain dozens of chemical compounds', 'May include solvents and preservatives', 'Vague term that doesn\'t specify exact ingredients', 'May trigger allergies in sensitive individuals'],
    whoShouldCare: 'People with food allergies, those preferring whole foods, individuals sensitive to additives.',
  },
  'artificial flavors': {
    classification: 'synthetic',
    chemicalName: 'Artificial Flavoring Substances',
    whyUsed: 'Provides specific flavors at lower cost than natural alternatives.',
    benefits: ['Cost-effective', 'Consistent flavor', 'Stable shelf life'],
    considerations: ['Synthetic chemicals created in laboratories', 'May contain petroleum-derived compounds', 'Possible allergic reactions', 'No nutritional value', 'May mask poor quality ingredients', 'Long-term health effects not fully understood'],
    whoShouldCare: 'Those avoiding synthetic additives, people with chemical sensitivities, anyone preferring natural ingredients.',
  },
  'modified starch': {
    classification: 'processed',
    chemicalName: 'Modified Food Starch',
    whyUsed: 'Thickening agent that improves texture and stability.',
    benefits: ['Improves texture and consistency', 'Prevents separation', 'Extends shelf life', 'Gluten-free'],
    considerations: ['Highly processed', 'May be derived from GMO corn', 'Can cause blood sugar spikes', 'May cause digestive issues in some people', 'Nutritionally empty'],
    whoShouldCare: 'People managing blood sugar, those avoiding GMOs, individuals with digestive sensitivities.',
  },
  'xanthan gum': {
    classification: 'processed',
    chemicalName: 'Xanthan Gum (E415)',
    whyUsed: 'Thickening and stabilizing agent.',
    benefits: ['Effective thickener at low concentrations', 'Gluten-free', 'May help lower blood sugar and cholesterol', 'Provides fiber'],
    considerations: ['May cause digestive issues (bloating, gas, diarrhea) in large amounts', 'Produced by bacterial fermentation', 'Can be a laxative in high doses', 'May be derived from corn, wheat, soy, or dairy (allergen concerns)'],
    whoShouldCare: 'People with digestive sensitivities, those with allergies to source ingredients, individuals with IBS.',
  },
  'monoglycerides': {
    classification: 'processed',
    chemicalName: 'Monoglycerides and Diglycerides',
    whyUsed: 'Emulsifiers that help mix oil and water, improve texture.',
    benefits: ['Improves texture and consistency', 'Extends shelf life', 'Prevents separation'],
    considerations: ['Highly processed', 'May contain trans fats', 'Can be derived from animal or plant sources (concern for vegetarians)', 'May affect gut health', 'Nutritionally empty'],
    whoShouldCare: 'Vegetarians and vegans (if animal-derived), people avoiding trans fats, those concerned about processed additives.',
  },
  'soy lecithin': {
    classification: 'processed',
    chemicalName: 'Soy Lecithin (E322)',
    whyUsed: 'Emulsifier that helps ingredients blend together.',
    benefits: ['Effective emulsifier', 'May support brain health (contains choline)', 'Generally well-tolerated', 'Helps improve texture'],
    considerations: ['Often derived from GMO soybeans', 'May cause allergic reactions in people with soy allergies', 'Extracted using chemical solvents (hexane)', 'Highly processed'],
    whoShouldCare: 'People with soy allergies, those avoiding GMOs, individuals concerned about chemical extraction processes.',
    allergens: ['Soy'],
  },
  'sunflower lecithin': {
    classification: 'processed',
    chemicalName: 'Sunflower Lecithin',
    whyUsed: 'Emulsifier that helps ingredients blend, alternative to soy lecithin.',
    benefits: ['Effective emulsifier', 'Soy-free alternative', 'Contains choline', 'Generally well-tolerated', 'Often non-GMO'],
    considerations: ['Highly processed', 'May be extracted using chemical solvents', 'Can cause allergic reactions in people with sunflower seed allergies'],
    whoShouldCare: 'People with sunflower seed allergies, those concerned about processing methods.',
  },
  'almonds': {
    classification: 'natural',
    whyUsed: 'Provides protein, healthy fats, and nutrients.',
    benefits: ['High in healthy monounsaturated fats', 'Good source of protein and fiber', 'Rich in vitamin E, magnesium, and antioxidants', 'May help lower cholesterol', 'Supports heart health', 'May aid in weight management'],
    considerations: ['High in calories', 'Common allergen', 'May contain phytic acid (reduces mineral absorption)', 'Can cause digestive issues if consumed in large amounts'],
    whoShouldCare: 'People with tree nut allergies, those managing calorie intake.',
    allergens: ['Tree Nuts', 'Almonds'],
  },
  'cocoa butter': {
    classification: 'natural',
    chemicalName: 'Theobroma Cacao Seed Butter',
    whyUsed: 'Provides creamy texture and chocolate flavor.',
    benefits: ['Contains healthy fats', 'Rich in antioxidants', 'May support heart health', 'Natural source of polyphenols', 'Stable fat that doesn\'t require hydrogenation'],
    considerations: ['High in calories and saturated fat', 'Can contribute to weight gain if consumed in excess'],
    whoShouldCare: 'Those managing weight or saturated fat intake.',
  },
  'sea salt': {
    classification: 'natural',
    whyUsed: 'Enhances flavor, contains trace minerals.',
    benefits: ['Contains trace minerals (magnesium, calcium, potassium)', 'Less processed than table salt', 'Natural flavor enhancement'],
    considerations: ['Still high in sodium', 'Excessive intake can lead to high blood pressure', 'Trace minerals present in very small amounts', 'May contain microplastics from ocean pollution'],
    whoShouldCare: 'Individuals with hypertension, heart conditions, or on sodium-restricted diets.',
  },
  'soluble corn fiber': {
    classification: 'processed',
    chemicalName: 'Soluble Corn Fiber',
    whyUsed: 'Adds fiber and sweetness while reducing calories.',
    benefits: ['Provides dietary fiber', 'Low glycemic impact', 'Prebiotic properties (feeds beneficial gut bacteria)', 'Helps with satiety'],
    considerations: ['Highly processed', 'May cause digestive issues (gas, bloating) in some people', 'Often derived from GMO corn', 'Not the same as natural fiber from whole foods'],
    whoShouldCare: 'People with digestive sensitivities, those avoiding GMOs, individuals preferring whole food fiber sources.',
  },
  'maida': {
    classification: 'processed',
    chemicalName: 'Refined All-Purpose Flour (Maida)',
    whyUsed: 'Creates desirable texture, inexpensive, easy to process.',
    benefits: ['Provides carbohydrates for energy', 'Creates soft, chewy texture'],
    considerations: ['Highly refined with almost no fiber', 'Stripped of all nutrients during processing', 'Very high glycemic index (causes rapid blood sugar spikes)', 'May contribute to weight gain', 'Linked to increased risk of diabetes and heart disease', 'Can cause digestive issues', 'Contains gluten'],
    whoShouldCare: 'People with diabetes or prediabetes, those managing weight, individuals with celiac disease or gluten sensitivity, anyone prioritizing nutrient-dense foods.',
  },
  'wheat gluten': {
    classification: 'processed',
    chemicalName: 'Vital Wheat Gluten',
    whyUsed: 'Provides elasticity and chewiness to noodles.',
    benefits: ['High in protein', 'Improves texture and chewiness', 'Helps dough hold together'],
    considerations: ['Problematic for people with celiac disease', 'Can trigger gluten sensitivity', 'May cause digestive issues', 'Highly processed protein isolate'],
    whoShouldCare: 'People with celiac disease, those with gluten sensitivity or intolerance, individuals with wheat allergies.',
    allergens: ['Wheat', 'Gluten'],
  },
  'onion': {
    classification: 'natural',
    whyUsed: 'Provides savory and aromatic flavor.',
    benefits: ['Rich in antioxidants and vitamin C', 'Contains anti-inflammatory compounds', 'May support heart health', 'Natural flavor enhancer', 'Contains prebiotic fiber'],
    considerations: ['May cause digestive discomfort or gas in some people', 'Can trigger heartburn or acid reflux'],
    whoShouldCare: 'People with IBS or digestive sensitivities, those prone to heartburn.',
  },
  'garlic': {
    classification: 'natural',
    whyUsed: 'Provides pungent, savory, and aromatic flavor.',
    benefits: ['Contains allicin (powerful antioxidant)', 'May boost immune system', 'Anti-inflammatory and antimicrobial properties', 'May help lower blood pressure and cholesterol', 'Supports heart health'],
    considerations: ['May cause digestive upset in some people', 'Can interact with blood thinners', 'May cause bad breath and body odor'],
    whoShouldCare: 'People on blood-thinning medications, those with digestive sensitivities.',
  },
  'turmeric': {
    classification: 'natural',
    whyUsed: 'Adds color and a distinct earthy, slightly bitter flavor.',
    benefits: ['Contains curcumin (powerful anti-inflammatory)', 'Rich in antioxidants', 'May support brain health', 'May help with arthritis and joint pain', 'Supports digestive health'],
    considerations: ['May interact with blood thinners', 'Can cause digestive upset in large amounts', 'May lower blood sugar (concern for diabetics on medication)'],
    whoShouldCare: 'People on blood-thinning medications, those with gallbladder issues, individuals taking diabetes medications.',
  },
  'coriander': {
    classification: 'natural',
    whyUsed: 'Contributes a warm, nutty, and citrusy flavor.',
    benefits: ['Rich in antioxidants', 'May help lower blood sugar', 'Supports digestive health', 'Anti-inflammatory properties', 'May promote heart health'],
    considerations: ['May cause allergic reactions in some people', 'Can interact with diabetes medications'],
    whoShouldCare: 'People with spice allergies, those taking diabetes medications.',
  },
  'chili': {
    classification: 'natural',
    whyUsed: 'Provides heat and a pungent flavor.',
    benefits: ['Contains capsaicin (may boost metabolism)', 'Rich in vitamins A and C', 'May help with pain relief', 'Anti-inflammatory properties', 'May support heart health'],
    considerations: ['Can cause digestive upset or heartburn', 'May irritate stomach lining in sensitive individuals', 'Can trigger IBS symptoms'],
    whoShouldCare: 'People with IBS, those with sensitive stomachs, individuals prone to heartburn or acid reflux.',
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
  // Validate input is food-related
  const validation = validateFoodInput(ingredientList);
  if (!validation.isValid) {
    throw new Error(validation.reason || 'Invalid food input');
  }
  
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
      allergens: details.allergens,
    };
  });
  
  // Calculate summary
  const naturalCount = ingredients.filter((i) => i.classification === 'natural').length;
  const processedCount = ingredients.filter((i) => i.classification === 'processed').length;
  const syntheticCount = ingredients.filter((i) => i.classification === 'synthetic').length;
  
  // Collect all allergens
  const allergenSet = new Set<string>();
  ingredients.forEach((ingredient) => {
    if (ingredient.allergens) {
      ingredient.allergens.forEach((allergen) => allergenSet.add(allergen));
    }
  });
  
  const summary = {
    totalCount: ingredients.length,
    naturalCount,
    processedCount,
    syntheticCount,
    summaryText: generateSummaryText(naturalCount, processedCount, syntheticCount),
    allergens: Array.from(allergenSet).sort(),
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
