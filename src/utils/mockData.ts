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
  'FDA (Food & Drug Administration)',
  'Nutrition.gov',
  'EFSA (European Food Safety Authority)',
  'WHO (World Health Organization)',
  'PubChem',
  'NIH / NCBI',
];
