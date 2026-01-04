import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Extract text from image using Tesseract.js OCR
 * @param imageData - Base64 image data or image URL
 * @returns Extracted text and confidence score
 */
export async function extractTextFromImage(imageData: string): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: (m) => {
          // Log progress for debugging
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      }
    );

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Detect if image contains food product by analyzing text
 * @param imageData - Base64 image data
 * @returns True if food product detected
 */
export async function detectFoodInImage(imageData: string): Promise<boolean> {
  try {
    const { text } = await extractTextFromImage(imageData);
    
    // Check for food-related keywords in extracted text
    const foodIndicators = [
      'ingredients', 'nutrition facts', 'serving size', 'calories',
      'protein', 'carbohydrate', 'fat', 'sodium', 'sugar',
      'flour', 'milk', 'egg', 'oil', 'salt', 'water',
      'preservative', 'flavor', 'color', 'vitamin', 'mineral',
    ];
    
    const lowerText = text.toLowerCase();
    const hasFood = foodIndicators.some(keyword => lowerText.includes(keyword));
    
    // Check for non-food indicators
    const nonFoodIndicators = [
      'shampoo', 'detergent', 'battery', 'electronic',
      'machine washable', 'fabric', 'perfume', 'cologne',
    ];
    
    const hasNonFood = nonFoodIndicators.some(keyword => lowerText.includes(keyword));
    
    return hasFood && !hasNonFood;
  } catch (error) {
    console.error('Food detection error:', error);
    return false;
  }
}

/**
 * Extract product name from OCR text
 * @param text - OCR extracted text
 * @returns Product name or null
 */
export function extractProductName(text: string): string | null {
  // Try to find product name (usually in first few lines, often in caps or larger text)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) return null;
  
  // First non-empty line is often the product name
  const firstLine = lines[0].trim();
  
  // If first line is too short or looks like a barcode, try second line
  if (firstLine.length < 3 || /^\d+$/.test(firstLine)) {
    return lines[1]?.trim() || firstLine;
  }
  
  return firstLine;
}

/**
 * Extract ingredient list from OCR text
 * @param text - OCR extracted text
 * @returns Ingredient list string
 */
export function extractIngredients(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  // Look for "ingredients:" or "ingredients :" pattern
  const ingredientsMatch = text.match(/ingredients?\s*:?\s*([^.]+(?:\.[^.]+)*)/i);
  
  if (ingredientsMatch) {
    return ingredientsMatch[1].trim();
  }
  
  // Alternative: Look for text after "contains:" or "made with:"
  const containsMatch = text.match(/(?:contains|made with)\s*:?\s*([^.]+)/i);
  
  if (containsMatch) {
    return containsMatch[1].trim();
  }
  
  // If no clear pattern, look for comma-separated list
  const lines = text.split('\n');
  for (const line of lines) {
    // If line has multiple commas, it's likely an ingredient list
    if (line.split(',').length >= 3) {
      return line.trim();
    }
  }
  
  return null;
}
