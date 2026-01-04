/**
 * Product Keyword Database
 * Maps product keywords to their known ingredients
 */

export interface ProductKeywordMatch {
  keywords: string[];
  productName: string;
  ingredients: string;
  category: string;
}

export interface IngredientClassification {
  name: string;
  classification: 'Natural' | 'Processed' | 'Synthetic';
  description: string;
  commonUses: string[];
}

/**
 * Individual Ingredient Database with Classifications
 * Used to identify and classify ingredients found in OCR text
 */
export const INGREDIENT_DATABASE: IngredientClassification[] = [
  // Natural Ingredients
  {
    name: 'Wheat',
    classification: 'Natural',
    description: 'A cereal grain that is a staple food worldwide',
    commonUses: ['Bread', 'Pasta', 'Baked goods', 'Cereals'],
  },
  {
    name: 'Salt',
    classification: 'Natural',
    description: 'Sodium chloride, used for flavoring and preservation',
    commonUses: ['Seasoning', 'Preservation', 'Flavor enhancement'],
  },
  {
    name: 'Water',
    classification: 'Natural',
    description: 'Essential liquid ingredient',
    commonUses: ['Hydration', 'Mixing', 'Cooking'],
  },
  {
    name: 'Milk',
    classification: 'Natural',
    description: 'Dairy product from mammals',
    commonUses: ['Beverages', 'Dairy products', 'Baking'],
  },
  {
    name: 'Sugar',
    classification: 'Natural',
    description: 'Sweet carbohydrate from sugarcane or sugar beet',
    commonUses: ['Sweetening', 'Baking', 'Preservation'],
  },
  {
    name: 'Cocoa',
    classification: 'Natural',
    description: 'Powder made from roasted cacao beans',
    commonUses: ['Chocolate', 'Beverages', 'Desserts'],
  },
  {
    name: 'Butter',
    classification: 'Natural',
    description: 'Dairy product made from milk fat',
    commonUses: ['Cooking', 'Baking', 'Spreading'],
  },
  {
    name: 'Egg',
    classification: 'Natural',
    description: 'Protein-rich food from birds',
    commonUses: ['Baking', 'Cooking', 'Binding agent'],
  },
  {
    name: 'Corn',
    classification: 'Natural',
    description: 'Cereal grain also known as maize',
    commonUses: ['Snacks', 'Cereals', 'Flour'],
  },
  {
    name: 'Rice',
    classification: 'Natural',
    description: 'Staple cereal grain',
    commonUses: ['Main dishes', 'Flour', 'Cereals'],
  },
  {
    name: 'Potato',
    classification: 'Natural',
    description: 'Starchy root vegetable',
    commonUses: ['Chips', 'Fries', 'Flour'],
  },
  {
    name: 'Onion',
    classification: 'Natural',
    description: 'Aromatic vegetable',
    commonUses: ['Flavoring', 'Seasoning', 'Cooking'],
  },
  {
    name: 'Garlic',
    classification: 'Natural',
    description: 'Pungent bulb used for flavoring',
    commonUses: ['Seasoning', 'Flavoring', 'Cooking'],
  },
  {
    name: 'Tomato',
    classification: 'Natural',
    description: 'Fruit commonly used as vegetable',
    commonUses: ['Sauces', 'Cooking', 'Salads'],
  },
  {
    name: 'Vanilla',
    classification: 'Natural',
    description: 'Flavoring from vanilla orchid',
    commonUses: ['Flavoring', 'Baking', 'Desserts'],
  },
  
  // Processed Ingredients
  {
    name: 'Palm Oil',
    classification: 'Processed',
    description: 'Vegetable oil extracted from palm fruit',
    commonUses: ['Cooking', 'Frying', 'Food manufacturing'],
  },
  {
    name: 'Vegetable Oil',
    classification: 'Processed',
    description: 'Oil extracted from various plants',
    commonUses: ['Cooking', 'Frying', 'Baking'],
  },
  {
    name: 'Wheat Flour',
    classification: 'Processed',
    description: 'Powder made from grinding wheat',
    commonUses: ['Baking', 'Bread', 'Pasta'],
  },
  {
    name: 'Corn Flour',
    classification: 'Processed',
    description: 'Powder made from grinding corn',
    commonUses: ['Baking', 'Thickening', 'Coating'],
  },
  {
    name: 'Cornstarch',
    classification: 'Processed',
    description: 'Starch extracted from corn',
    commonUses: ['Thickening', 'Baking', 'Coating'],
  },
  {
    name: 'Maltodextrin',
    classification: 'Processed',
    description: 'Polysaccharide used as food additive',
    commonUses: ['Thickening', 'Bulking', 'Preserving'],
  },
  {
    name: 'High Fructose Corn Syrup',
    classification: 'Processed',
    description: 'Sweetener made from corn starch',
    commonUses: ['Sweetening', 'Beverages', 'Processed foods'],
  },
  {
    name: 'Glucose',
    classification: 'Processed',
    description: 'Simple sugar processed from starch',
    commonUses: ['Sweetening', 'Energy', 'Food manufacturing'],
  },
  {
    name: 'Dextrose',
    classification: 'Processed',
    description: 'Form of glucose from corn',
    commonUses: ['Sweetening', 'Baking', 'Fermentation'],
  },
  {
    name: 'Whey',
    classification: 'Processed',
    description: 'Liquid byproduct of cheese production',
    commonUses: ['Protein supplements', 'Baking', 'Food manufacturing'],
  },
  {
    name: 'Lecithin',
    classification: 'Processed',
    description: 'Emulsifier from soybeans or eggs',
    commonUses: ['Emulsifying', 'Stabilizing', 'Chocolate'],
  },
  {
    name: 'Yeast',
    classification: 'Processed',
    description: 'Microorganism used for fermentation',
    commonUses: ['Bread', 'Fermentation', 'Flavor'],
  },
  {
    name: 'Cocoa Butter',
    classification: 'Processed',
    description: 'Fat extracted from cocoa beans',
    commonUses: ['Chocolate', 'Cosmetics', 'Baking'],
  },
  {
    name: 'Cheese',
    classification: 'Processed',
    description: 'Dairy product made from milk',
    commonUses: ['Snacks', 'Cooking', 'Flavoring'],
  },
  {
    name: 'Milk Solids',
    classification: 'Processed',
    description: 'Dried milk components',
    commonUses: ['Baking', 'Chocolate', 'Dairy products'],
  },
  
  // Synthetic Ingredients
  {
    name: 'Monosodium Glutamate',
    classification: 'Synthetic',
    description: 'Flavor enhancer (MSG)',
    commonUses: ['Flavor enhancement', 'Savory foods', 'Instant noodles'],
  },
  {
    name: 'Artificial Flavor',
    classification: 'Synthetic',
    description: 'Chemically synthesized flavoring',
    commonUses: ['Flavoring', 'Beverages', 'Snacks'],
  },
  {
    name: 'Artificial Color',
    classification: 'Synthetic',
    description: 'Synthetic food coloring',
    commonUses: ['Coloring', 'Visual appeal', 'Beverages'],
  },
  {
    name: 'Yellow 5',
    classification: 'Synthetic',
    description: 'Synthetic yellow food dye (Tartrazine)',
    commonUses: ['Coloring', 'Beverages', 'Snacks'],
  },
  {
    name: 'Yellow 6',
    classification: 'Synthetic',
    description: 'Synthetic yellow-orange food dye',
    commonUses: ['Coloring', 'Snacks', 'Beverages'],
  },
  {
    name: 'Red 40',
    classification: 'Synthetic',
    description: 'Synthetic red food dye',
    commonUses: ['Coloring', 'Candies', 'Beverages'],
  },
  {
    name: 'Caramel Color',
    classification: 'Synthetic',
    description: 'Brown coloring made from heated sugar',
    commonUses: ['Coloring', 'Beverages', 'Sauces'],
  },
  {
    name: 'Sodium Benzoate',
    classification: 'Synthetic',
    description: 'Preservative to prevent microbial growth',
    commonUses: ['Preservation', 'Beverages', 'Condiments'],
  },
  {
    name: 'Potassium Sorbate',
    classification: 'Synthetic',
    description: 'Preservative to inhibit mold',
    commonUses: ['Preservation', 'Beverages', 'Baked goods'],
  },
  {
    name: 'BHT',
    classification: 'Synthetic',
    description: 'Antioxidant preservative',
    commonUses: ['Preservation', 'Cereals', 'Snacks'],
  },
  {
    name: 'TBHQ',
    classification: 'Synthetic',
    description: 'Antioxidant preservative',
    commonUses: ['Preservation', 'Oils', 'Fried foods'],
  },
  {
    name: 'Aspartame',
    classification: 'Synthetic',
    description: 'Artificial sweetener',
    commonUses: ['Sweetening', 'Diet beverages', 'Sugar-free products'],
  },
  {
    name: 'Sucralose',
    classification: 'Synthetic',
    description: 'Artificial sweetener',
    commonUses: ['Sweetening', 'Diet products', 'Beverages'],
  },
  {
    name: 'Acesulfame Potassium',
    classification: 'Synthetic',
    description: 'Artificial sweetener',
    commonUses: ['Sweetening', 'Diet beverages', 'Sugar-free products'],
  },
  {
    name: 'Disodium Inosinate',
    classification: 'Synthetic',
    description: 'Flavor enhancer',
    commonUses: ['Flavor enhancement', 'Snacks', 'Instant foods'],
  },
  {
    name: 'Disodium Guanylate',
    classification: 'Synthetic',
    description: 'Flavor enhancer',
    commonUses: ['Flavor enhancement', 'Snacks', 'Instant foods'],
  },
];

/**
 * Search for ingredient in database and return classification
 */
export function classifyIngredient(ingredientName: string): IngredientClassification | null {
  const lowerName = ingredientName.toLowerCase().trim();
  
  for (const ingredient of INGREDIENT_DATABASE) {
    if (ingredient.name.toLowerCase() === lowerName || 
        lowerName.includes(ingredient.name.toLowerCase())) {
      return ingredient;
    }
  }
  
  return null;
}

/**
 * Database of known products with their ingredients
 * When OCR detects these keywords, we use the predefined ingredients
 */
export const PRODUCT_KEYWORD_DATABASE: ProductKeywordMatch[] = [
  // Chocolates
  {
    keywords: ['dairy milk', 'cadbury'],
    productName: 'Dairy Milk Chocolate',
    ingredients: 'Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Emulsifiers (E442, E476), Flavoring',
    category: 'Chocolate',
  },
  {
    keywords: ['kit kat', 'kitkat'],
    productName: 'Kit Kat',
    ingredients: 'Sugar, Wheat Flour, Milk Solids, Cocoa Butter, Cocoa Mass, Vegetable Fat, Yeast, Emulsifier (Soya Lecithin), Raising Agent (Sodium Bicarbonate), Salt, Natural Vanilla Flavoring',
    category: 'Chocolate',
  },
  {
    keywords: ['snickers'],
    productName: 'Snickers',
    ingredients: 'Milk Chocolate (Sugar, Cocoa Butter, Chocolate, Skim Milk, Lactose, Milkfat, Soy Lecithin), Peanuts, Corn Syrup, Sugar, Palm Oil, Skim Milk, Lactose, Salt, Egg Whites, Artificial Flavor',
    category: 'Chocolate',
  },
  
  // Beverages
  {
    keywords: ['coca cola', 'coke', 'coca-cola'],
    productName: 'Coca-Cola',
    ingredients: 'Carbonated Water, Sugar, Caramel Color (E150d), Phosphoric Acid, Natural Flavors, Caffeine',
    category: 'Beverage',
  },
  {
    keywords: ['pepsi'],
    productName: 'Pepsi',
    ingredients: 'Carbonated Water, High Fructose Corn Syrup, Caramel Color, Sugar, Phosphoric Acid, Caffeine, Citric Acid, Natural Flavor',
    category: 'Beverage',
  },
  {
    keywords: ['sprite'],
    productName: 'Sprite',
    ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Lemon and Lime Flavors, Sodium Citrate, Sodium Benzoate (Preservative)',
    category: 'Beverage',
  },
  {
    keywords: ['mountain dew'],
    productName: 'Mountain Dew',
    ingredients: 'Carbonated Water, High Fructose Corn Syrup, Concentrated Orange Juice, Citric Acid, Natural Flavor, Sodium Benzoate, Caffeine, Sodium Citrate, Gum Arabic, Calcium Disodium EDTA, Brominated Vegetable Oil, Yellow 5',
    category: 'Beverage',
  },
  
  // Chips/Snacks
  {
    keywords: ['lays', "lay's"],
    productName: "Lay's Chips",
    ingredients: 'Potatoes, Vegetable Oil (Sunflower, Corn, and/or Canola Oil), Salt',
    category: 'Snack',
  },
  {
    keywords: ['doritos'],
    productName: 'Doritos',
    ingredients: 'Corn, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Maltodextrin, Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate, Buttermilk, Romano Cheese, Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Artificial Color (Yellow 6, Yellow 5, Red 40), Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk, Red and Green Bell Pepper Powder, Disodium Inosinate, Disodium Guanylate',
    category: 'Snack',
  },
  {
    keywords: ['pringles'],
    productName: 'Pringles',
    ingredients: 'Dried Potatoes, Vegetable Oil (Corn, Cottonseed, High Oleic Soybean, and/or Sunflower Oil), Degerminated Yellow Corn Flour, Cornstarch, Rice Flour, Maltodextrin, Mono- and Diglycerides, Salt, Wheat Starch',
    category: 'Snack',
  },
  {
    keywords: ['cheetos'],
    productName: 'Cheetos',
    ingredients: 'Enriched Corn Meal (Corn Meal, Ferrous Sulfate, Niacin, Thiamin Mononitrate, Riboflavin, Folic Acid), Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Cheese Seasoning (Whey, Cheddar Cheese [Milk, Cheese Cultures, Salt, Enzymes], Canola Oil, Maltodextrin, Natural and Artificial Flavors, Salt, Whey Protein Concentrate, Monosodium Glutamate, Lactic Acid, Citric Acid, Artificial Color [Yellow 6]), Salt',
    category: 'Snack',
  },
  
  // Cookies/Biscuits
  {
    keywords: ['oreo'],
    productName: 'Oreo',
    ingredients: 'Sugar, Unbleached Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Palm and/or Canola Oil, Cocoa (Processed with Alkali), High Fructose Corn Syrup, Leavening (Baking Soda and/or Calcium Phosphate), Salt, Soy Lecithin, Chocolate, Artificial Flavor',
    category: 'Cookie',
  },
  {
    keywords: ['parle-g', 'parle g'],
    productName: 'Parle-G',
    ingredients: 'Wheat Flour, Sugar, Edible Vegetable Oil (Palm), Invert Sugar Syrup, Leavening Agents (503(ii), 500(ii)), Milk Solids, Salt, Emulsifier (322), Dough Conditioner (223)',
    category: 'Biscuit',
  },
  
  // Instant Noodles
  {
    keywords: ['maggi', 'maggie'],
    productName: 'Maggi Noodles',
    ingredients: 'Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Guar Gum, Acidity Regulators (501(i), 500(i), 330), Humectant (412), Colour (101(i)). Tastemaker: Mixed Spices (Onion Powder, Coriander Powder, Turmeric Powder, Red Chilli Powder, Garlic Powder, Cumin Powder, Aniseed Powder, Ginger Powder, Fenugreek Powder, Black Pepper Powder, Clove Powder, Nutmeg Powder, Cardamom Powder), Sugar, Flavour Enhancers (635, 627), Hydrolysed Groundnut Protein, Starch, Edible Vegetable Oil (Palm Oil), Wheat Flour, Salt, Thickener (508), Colour (150d)',
    category: 'Instant Noodles',
  },
  {
    keywords: ['top ramen', 'nissin'],
    productName: 'Top Ramen',
    ingredients: 'Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Vegetable Oil (Contains One or More of the Following: Canola, Cottonseed, Palm), Preserved by TBHQ, Salt, Soy Sauce (Water, Wheat, Soybeans, Salt), Potassium Carbonate, Sodium (Mono, Hexameta, and/or Tripoly) Phosphate, Sodium Carbonate, Turmeric',
    category: 'Instant Noodles',
  },
  
  // Cereals
  {
    keywords: ['corn flakes', 'kelloggs'],
    productName: 'Corn Flakes',
    ingredients: 'Milled Corn, Sugar, Malt Flavor, High Fructose Corn Syrup, Salt, BHT for Freshness. Vitamins and Minerals: Iron (Ferric Phosphate), Niacinamide, Vitamin B6 (Pyridoxine Hydrochloride), Vitamin B2 (Riboflavin), Vitamin B1 (Thiamin Hydrochloride), Folic Acid, Vitamin D3, Vitamin B12',
    category: 'Cereal',
  },
  
  // Bread
  {
    keywords: ['white bread', 'sandwich bread'],
    productName: 'White Bread',
    ingredients: 'Enriched Wheat Flour (Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Water, High Fructose Corn Syrup, Yeast, Soybean Oil, Salt, Wheat Gluten, Dough Conditioners (Contains One or More of the Following: Sodium Stearoyl Lactylate, Calcium Stearoyl Lactylate, Monoglycerides, Mono- and Diglycerides, Distilled Monoglycerides, Calcium Peroxide, Calcium Iodate, DATEM, Ethoxylated Mono- and Diglycerides, Enzymes, Ascorbic Acid), Calcium Propionate (Preservative), Soy Lecithin',
    category: 'Bread',
  },
  
  // Milk Products
  {
    keywords: ['amul milk'],
    productName: 'Amul Milk',
    ingredients: 'Milk, Vitamin A, Vitamin D3',
    category: 'Dairy',
  },
  
  // Energy Drinks
  {
    keywords: ['red bull', 'redbull'],
    productName: 'Red Bull',
    ingredients: 'Carbonated Water, Sucrose, Glucose, Citric Acid, Taurine, Sodium Bicarbonate, Magnesium Carbonate, Caffeine, Niacinamide, Calcium Pantothenate, Pyridoxine HCl, Vitamin B12, Natural and Artificial Flavors, Colors',
    category: 'Energy Drink',
  },
  {
    keywords: ['monster energy', 'monster'],
    productName: 'Monster Energy',
    ingredients: 'Carbonated Water, Sugar, Glucose, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Color Added, Panax Ginseng Root Extract, L-Carnitine, Caffeine, Sorbic Acid, Benzoic Acid, Niacinamide, Sucralose, Salt, D-Glucuronolactone, Inositol, Guarana Extract, Pyridoxine Hydrochloride, Riboflavin, Maltodextrin, Cyanocobalamin',
    category: 'Energy Drink',
  },
];

/**
 * Search for product keywords in OCR text
 * Returns matching product with ingredients
 */
export function searchProductKeywords(ocrText: string): ProductKeywordMatch | null {
  if (!ocrText || ocrText.trim().length < 3) {
    return null;
  }
  
  const lowerText = ocrText.toLowerCase();
  
  // Search for keyword matches
  for (const product of PRODUCT_KEYWORD_DATABASE) {
    for (const keyword of product.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        console.log(`Keyword match found: "${keyword}" → ${product.productName}`);
        return product;
      }
    }
  }
  
  return null;
}

/**
 * Get all available product categories
 */
export function getProductCategories(): string[] {
  const categories = new Set<string>();
  PRODUCT_KEYWORD_DATABASE.forEach(product => categories.add(product.category));
  return Array.from(categories).sort();
}

/**
 * Search products by category
 */
export function searchProductsByCategory(category: string): ProductKeywordMatch[] {
  return PRODUCT_KEYWORD_DATABASE.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );
}
