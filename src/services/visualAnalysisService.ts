/**
 * Visual Analysis Service
 * Analyzes food images by color, appearance, and visual features
 * to predict ingredients and food types
 */

export interface VisualAnalysisResult {
  dominantColors: string[];
  predictedFoodType: string;
  predictedIngredients: string[];
  confidence: number;
}

export interface ColorInfo {
  r: number;
  g: number;
  b: number;
  hex: string;
}

/**
 * Analyze image colors to predict food type and ingredients
 */
export async function analyzeImageVisually(imageData: string): Promise<VisualAnalysisResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas to analyze image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve({
          dominantColors: [],
          predictedFoodType: 'Unknown',
          predictedIngredients: [],
          confidence: 0,
        });
        return;
      }
      
      // Resize for faster processing
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Analyze colors
      const colors = extractDominantColors(pixels);
      const dominantColors = colors.map(c => c.hex);
      
      // Predict food type based on colors
      const foodType = predictFoodTypeFromColors(colors);
      
      // Predict ingredients based on visual analysis
      const ingredients = predictIngredientsFromVisuals(foodType, colors);
      
      console.log('Visual Analysis:', {
        dominantColors,
        predictedFoodType: foodType,
        predictedIngredients: ingredients,
      });
      
      resolve({
        dominantColors,
        predictedFoodType: foodType,
        predictedIngredients: ingredients,
        confidence: 0.7,
      });
    };
    
    img.onerror = () => {
      resolve({
        dominantColors: [],
        predictedFoodType: 'Unknown',
        predictedIngredients: [],
        confidence: 0,
      });
    };
    
    img.src = imageData;
  });
}

/**
 * Extract dominant colors from image pixels
 */
function extractDominantColors(pixels: Uint8ClampedArray): ColorInfo[] {
  const colorMap = new Map<string, number>();
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Quantize colors to reduce variations
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    
    const key = `${qr},${qg},${qb}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  // Get top 5 colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return {
        r,
        g,
        b,
        hex: rgbToHex(r, g, b),
      };
    });
  
  return sortedColors;
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Predict food type based on dominant colors
 */
function predictFoodTypeFromColors(colors: ColorInfo[]): string {
  if (colors.length === 0) return 'Unknown';
  
  const primary = colors[0];
  
  // Brown/tan colors - baked goods, grains
  if (isBrownish(primary)) {
    return 'Baked Goods / Grains';
  }
  
  // White/cream - dairy, flour products
  if (isWhitish(primary)) {
    return 'Dairy / Flour Product';
  }
  
  // Yellow/orange - cheese, snacks, oils
  if (isYellowish(primary)) {
    return 'Cheese / Snack / Oil';
  }
  
  // Red/pink - meat, tomato products
  if (isReddish(primary)) {
    return 'Meat / Tomato Product';
  }
  
  // Green - vegetables, herbs
  if (isGreenish(primary)) {
    return 'Vegetable / Herb Product';
  }
  
  // Dark brown/black - chocolate, coffee, soy sauce
  if (isDarkBrownish(primary)) {
    return 'Chocolate / Coffee / Dark Sauce';
  }
  
  // Transparent/light - beverages
  if (isTransparent(primary)) {
    return 'Beverage / Liquid';
  }
  
  return 'Processed Food Product';
}

/**
 * Predict ingredients based on visual food type and colors
 */
function predictIngredientsFromVisuals(foodType: string, colors: ColorInfo[]): string[] {
  const ingredients: string[] = [];
  
  switch (foodType) {
    case 'Baked Goods / Grains':
      ingredients.push('Wheat Flour', 'Sugar', 'Yeast', 'Salt', 'Water', 'Vegetable Oil');
      break;
    
    case 'Dairy / Flour Product':
      ingredients.push('Milk', 'Flour', 'Sugar', 'Salt', 'Butter', 'Cream');
      break;
    
    case 'Cheese / Snack / Oil':
      ingredients.push('Corn', 'Vegetable Oil', 'Salt', 'Cheese Powder', 'Flavor Enhancers');
      break;
    
    case 'Meat / Tomato Product':
      ingredients.push('Tomato Paste', 'Salt', 'Sugar', 'Spices', 'Preservatives');
      break;
    
    case 'Vegetable / Herb Product':
      ingredients.push('Vegetables', 'Herbs', 'Salt', 'Oil', 'Vinegar');
      break;
    
    case 'Chocolate / Coffee / Dark Sauce':
      ingredients.push('Cocoa', 'Sugar', 'Milk', 'Soy Sauce', 'Caramel Color');
      break;
    
    case 'Beverage / Liquid':
      ingredients.push('Water', 'Sugar', 'Flavoring', 'Preservatives', 'Citric Acid');
      break;
    
    default:
      ingredients.push('Various Ingredients', 'Preservatives', 'Flavor Enhancers');
  }
  
  return ingredients;
}

// Color detection helper functions
function isBrownish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return r > 100 && r < 200 && g > 60 && g < 150 && b > 30 && b < 100;
}

function isWhitish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return r > 200 && g > 200 && b > 200;
}

function isYellowish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return r > 180 && g > 150 && b < 100;
}

function isReddish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return r > 150 && g < 100 && b < 100;
}

function isGreenish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return g > r && g > b && g > 100;
}

function isDarkBrownish(color: ColorInfo): boolean {
  const { r, g, b } = color;
  return r < 80 && g < 60 && b < 50;
}

function isTransparent(color: ColorInfo): boolean {
  const { r, g, b } = color;
  const avg = (r + g + b) / 3;
  return avg > 220 || avg < 30;
}
