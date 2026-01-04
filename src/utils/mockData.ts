import type { SampleProduct } from '@/types/food-label';

export const sampleProducts: SampleProduct[] = [
  {
    id: 'packaged-bread',
    name: 'Packaged Bread',
    category: 'Bakery',
    ingredientList: 'Enriched wheat flour (wheat flour, malted barley flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid), water, high fructose corn syrup, yeast, soybean oil, salt, calcium propionate (preservative), monoglycerides, datem, calcium sulfate, soy lecithin',
  },
  {
    id: 'instant-noodles',
    name: 'Instant Noodles',
    category: 'Packaged Food',
    ingredientList: 'Maida (all-purpose flour), palm oil, salt, wheat gluten, onion (spice), garlic (spice), turmeric (spice), coriander (spice), chili (spice), flavor enhancers (monosodium glutamate, disodium inosinate, disodium guanylate), thickeners (modified starch, xanthan gum)',
  },
  {
    id: 'protein-bar',
    name: 'Protein Bar',
    category: 'Nutrition',
    ingredientList: 'Protein blend (whey protein isolate, milk protein isolate), soluble corn fiber, almonds, water, erythritol, natural flavors, cocoa butter, sea salt, sunflower lecithin, sucralose, steviol glycosides',
  },
  {
    id: 'soft-drink',
    name: 'Soft Drink',
    category: 'Beverage',
    ingredientList: 'Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine, citric acid',
  },
];

export const dataSources = [
  {
    name: 'FDA (Food & Drug Administration)',
    description: 'U.S. federal agency responsible for food safety and nutrition labeling',
    url: 'https://www.fda.gov'
  },
  {
    name: 'Nutrition.gov',
    description: 'USDA resource for nutrition information and dietary guidelines',
    url: 'https://www.nutrition.gov'
  },
  {
    name: 'American Heart Association',
    description: 'Leading organization for cardiovascular health and nutrition recommendations',
    url: 'https://www.heart.org'
  },
  {
    name: 'American Diabetes Association',
    description: 'Authority on diabetes management and dietary recommendations',
    url: 'https://www.diabetes.org'
  },
  {
    name: 'Dietary Guidelines for Americans',
    description: 'Official U.S. government dietary recommendations updated every 5 years',
    url: 'https://www.dietaryguidelines.gov'
  },
  {
    name: 'EFSA (European Food Safety Authority)',
    description: 'European agency providing scientific advice on food safety',
    url: 'https://www.efsa.europa.eu'
  },
  {
    name: 'WHO (World Health Organization)',
    description: 'International health organization providing global nutrition guidance',
    url: 'https://www.who.int'
  },
  {
    name: 'PubChem',
    description: 'National library of chemical compounds and their properties',
    url: 'https://pubchem.ncbi.nlm.nih.gov'
  },
  {
    name: 'NIH / NCBI',
    description: 'National Institutes of Health research database',
    url: 'https://www.ncbi.nlm.nih.gov'
  },
];
