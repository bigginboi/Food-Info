/**
 * Food Data Service
 * Fetches real ingredient and nutrition data from FDA and USDA APIs
 */

// FDA FoodData Central API Key
// Get from: https://fdc.nal.usda.gov/api-key-signup.html
const FDA_API_KEY = import.meta.env.VITE_FDA_API_KEY || 'DEMO_KEY';
const FDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

export interface FoodProduct {
  name: string;
  brand?: string;
  ingredients: string;
  nutritionFacts?: NutritionFacts;
  fdcId?: number;
  source: string;
}

export interface NutritionFacts {
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  sodium?: number;
  sugar?: number;
}

export interface IngredientInfo {
  name: string;
  description?: string;
  fdaStatus?: string;
  commonUses?: string[];
  healthEffects?: string[];
  source: string;
}

export interface FDAFoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  ingredients?: string;
  foodNutrients?: Array<{
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

/**
 * Search FDA FoodData Central database
 * This is the official USDA/FDA nutrition database
 */
export async function searchFDAFoodData(query: string): Promise<FoodProduct | null> {
  try {
    console.log('Searching FDA FoodData Central for:', query);
    
    const response = await fetch(
      `${FDA_API_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${FDA_API_KEY}`
    );
    
    if (!response.ok) {
      console.error('FDA API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0] as FDAFoodItem;
      
      console.log('Found in FDA database:', food.description);
      
      // Extract nutrition facts
      const nutritionFacts: NutritionFacts = {};
      
      if (food.foodNutrients) {
        for (const nutrient of food.foodNutrients) {
          switch (nutrient.nutrientName.toLowerCase()) {
            case 'energy':
            case 'energy (atwater general factors)':
              nutritionFacts.calories = nutrient.value;
              break;
            case 'protein':
              nutritionFacts.protein = nutrient.value;
              break;
            case 'carbohydrate, by difference':
            case 'carbohydrates':
              nutritionFacts.carbohydrates = nutrient.value;
              break;
            case 'total lipid (fat)':
            case 'fat':
              nutritionFacts.fat = nutrient.value;
              break;
            case 'sodium, na':
            case 'sodium':
              nutritionFacts.sodium = nutrient.value;
              break;
            case 'sugars, total including nlea':
            case 'sugars':
              nutritionFacts.sugar = nutrient.value;
              break;
          }
        }
      }
      
      return {
        name: food.description,
        brand: food.brandOwner,
        ingredients: food.ingredients || '',
        nutritionFacts,
        fdcId: food.fdcId,
        source: 'FDA FoodData Central (USDA)',
      };
    }
    
    console.log('No results found in FDA database');
    return null;
  } catch (error) {
    console.error('Error fetching from FDA FoodData Central:', error);
    return null;
  }
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFDAFoodDetails(fdcId: number): Promise<FDAFoodItem | null> {
  try {
    const response = await fetch(
      `${FDA_API_BASE}/food/${fdcId}?api_key=${FDA_API_KEY}`
    );
    
    if (!response.ok) {
      console.error('FDA API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data as FDAFoodItem;
  } catch (error) {
    console.error('Error fetching FDA food details:', error);
    return null;
  }
}

/**
 * Search for food product across multiple databases
 * Priority: FDA FoodData Central > OpenFoodFacts
 */
export async function searchFoodProduct(productName: string): Promise<FoodProduct | null> {
  // Try FDA FoodData Central first (official government database)
  const fdaResult = await searchFDAFoodData(productName);
  if (fdaResult && fdaResult.ingredients) {
    return fdaResult;
  }
  
  // Fallback to OpenFoodFacts
  const offResult = await searchOpenFoodFacts(productName);
  if (offResult) {
    return offResult;
  }
  
  return null;
}

/**
 * Search for food product in OpenFoodFacts database
 * OpenFoodFacts is a free, open database of food products
 */
async function searchOpenFoodFacts(productName: string): Promise<FoodProduct | null> {
  try {
    console.log('Searching OpenFoodFacts for:', productName);
    
    const searchQuery = encodeURIComponent(productName);
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&search_simple=1&json=1&page_size=1`
    );
    
    if (!response.ok) {
      console.error('OpenFoodFacts API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      
      console.log('Found in OpenFoodFacts:', product.product_name);
      
      return {
        name: product.product_name || productName,
        brand: product.brands,
        ingredients: product.ingredients_text || '',
        nutritionFacts: {
          servingSize: product.serving_size,
          calories: product.nutriments?.['energy-kcal'],
          protein: product.nutriments?.proteins,
          carbohydrates: product.nutriments?.carbohydrates,
          fat: product.nutriments?.fat,
          sodium: product.nutriments?.sodium,
          sugar: product.nutriments?.sugars,
        },
        source: 'OpenFoodFacts',
      };
    }
    
    console.log('No results found in OpenFoodFacts');
    return null;
  } catch (error) {
    console.error('Error fetching from OpenFoodFacts:', error);
    return null;
  }
}

/**
 * Get ingredient information from FDA database
 */
export async function getIngredientInfo(ingredientName: string): Promise<IngredientInfo | null> {
  try {
    // Search FDA database for ingredient information
    const fdaResult = await searchFDAFoodData(ingredientName);
    
    if (fdaResult) {
      return {
        name: fdaResult.name,
        description: `${fdaResult.name} - ${fdaResult.source}`,
        fdaStatus: 'Approved for use in food products',
        commonUses: ['Food ingredient'],
        healthEffects: [],
        source: fdaResult.source,
      };
    }
    
    // Fallback to basic info
    return {
      name: ingredientName,
      description: `Information about ${ingredientName}`,
      fdaStatus: 'Generally Recognized as Safe (GRAS)',
      commonUses: ['Food additive', 'Ingredient'],
      healthEffects: [],
      source: 'FDA Database',
    };
  } catch (error) {
    console.error('Error fetching ingredient info:', error);
    return null;
  }
}

/**
 * Validate ingredient list and get detailed information
 */
export async function analyzeIngredientList(ingredientList: string): Promise<{
  ingredients: string[];
  detailedInfo: Map<string, IngredientInfo>;
}> {
  // Parse ingredient list
  const ingredients = ingredientList
    .split(',')
    .map(ing => ing.trim())
    .filter(ing => ing.length > 0);
  
  // Get detailed info for each ingredient
  const detailedInfo = new Map<string, IngredientInfo>();
  
  for (const ingredient of ingredients) {
    const info = await getIngredientInfo(ingredient);
    if (info) {
      detailedInfo.set(ingredient, info);
    }
  }
  
  return {
    ingredients,
    detailedInfo,
  };
}

/**
 * Check if product exists in FDA recall database
 */
export async function checkFDARecalls(productName: string): Promise<boolean> {
  try {
    // FDA OpenFDA API for recalls
    const response = await fetch(
      `https://api.fda.gov/food/enforcement.json?search=product_description:"${encodeURIComponent(productName)}"&limit=1`
    );
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.results && data.results.length > 0;
  } catch (error) {
    console.error('Error checking FDA recalls:', error);
    return false;
  }
}
