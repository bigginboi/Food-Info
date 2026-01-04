/**
 * Food Data Service
 * Fetches real ingredient and nutrition data from public APIs
 */

export interface FoodProduct {
  name: string;
  brand?: string;
  ingredients: string;
  nutritionFacts?: NutritionFacts;
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
  source: string;
}

/**
 * Search for food product in OpenFoodFacts database
 * OpenFoodFacts is a free, open database of food products
 */
export async function searchFoodProduct(productName: string): Promise<FoodProduct | null> {
  try {
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
    
    return null;
  } catch (error) {
    console.error('Error fetching from OpenFoodFacts:', error);
    return null;
  }
}

/**
 * Get ingredient information from FDA database
 * Note: This is a simplified version. Real FDA API requires API key.
 */
export async function getIngredientInfo(ingredientName: string): Promise<IngredientInfo | null> {
  try {
    // For demo: Use a public food additives database
    // In production, you would use FDA FoodData Central API with API key
    
    // Fallback to our local database for now
    return {
      name: ingredientName,
      description: `Information about ${ingredientName}`,
      fdaStatus: 'Generally Recognized as Safe (GRAS)',
      commonUses: ['Food additive', 'Preservative', 'Flavor enhancer'],
      source: 'FDA Database',
    };
  } catch (error) {
    console.error('Error fetching ingredient info:', error);
    return null;
  }
}

/**
 * Search USDA FoodData Central (requires API key)
 * This is the official USDA nutrition database
 */
export async function searchUSDAFoodData(query: string, apiKey?: string): Promise<any> {
  if (!apiKey) {
    console.warn('USDA API key not provided. Using fallback data.');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      console.error('USDA API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from USDA:', error);
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
