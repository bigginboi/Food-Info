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
 * EXTREMELY PERMISSIVE: Only rejects if clearly non-food or OCR fails completely
 * @param imageData - Base64 image data
 * @returns True if food product detected
 */
export async function detectFoodInImage(imageData: string): Promise<boolean> {
  try {
    // Extract text from image using real OCR
    const { text, confidence } = await extractTextFromImage(imageData);
    
    // If OCR completely failed (no text at all), reject
    if (!text || text.trim().length < 5) {
      console.log('OCR failed - no text extracted');
      return false;
    }
    
    // If confidence is extremely low, reject
    if (confidence < 20) {
      console.log('OCR confidence too low:', confidence);
      return false;
    }
    
    const lowerText = text.toLowerCase();
    
    // Check for EXPLICIT non-food indicators (very strict - only obvious non-food items)
    const explicitNonFood = [
      'shampoo', 'conditioner', 'body wash', 'hand soap', 'face wash',
      'detergent', 'bleach', 'floor cleaner', 'toilet cleaner', 'disinfectant',
      'battery', 'lithium-ion', 'rechargeable battery', 'electronic device',
      'machine washable', 'tumble dry', 'polyester fabric', 'cotton fabric',
      'nail polish', 'lipstick', 'mascara', 'foundation', 'perfume', 'cologne',
      'motor oil', 'engine oil', 'gasoline', 'antifreeze', 'brake fluid',
      'printer paper', 'copy paper', 'office supplies',
    ];
    
    const hasExplicitNonFood = explicitNonFood.some(indicator => 
      lowerText.includes(indicator)
    );
    
    if (hasExplicitNonFood) {
      console.log('Explicit non-food item detected');
      return false;
    }
    
    // PERMISSIVE APPROACH: If no explicit non-food indicators, assume it's food
    // This means we accept:
    // - All ingredient lists (even with chemical names)
    // - All nutrition labels
    // - Any text that could be food-related
    // - Even uncertain cases
    
    console.log('No non-food indicators found - treating as food (permissive approach)');
    return true;
    
  } catch (error) {
    console.error('Food detection error:', error);
    // On error, still try to be permissive - return true unless it's a critical error
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
 * Uses multiple strategies to find ingredient lists
 * @param text - OCR extracted text
 * @returns Ingredient list string or null
 */
export function extractIngredients(text: string): string | null {
  if (!text || text.trim().length < 10) {
    return null;
  }
  
  const lowerText = text.toLowerCase();
  
  // Strategy 1: Look for "ingredients:" or "ingredient list:" pattern
  const ingredientsPatterns = [
    /ingredients?\s*:?\s*([^\n.]+(?:[^\n.]+)*)/i,
    /ingredient\s+list\s*:?\s*([^\n.]+(?:[^\n.]+)*)/i,
  ];
  
  for (const pattern of ingredientsPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].trim();
      // Make sure it's not too short and has some commas
      if (extracted.length > 20 && extracted.includes(',')) {
        return extracted;
      }
    }
  }
  
  // Strategy 2: Look for "contains:" pattern
  const containsMatch = text.match(/contains\s*:?\s*([^\n.]+(?:[^\n.]+)*)/i);
  if (containsMatch && containsMatch[1]) {
    const extracted = containsMatch[1].trim();
    if (extracted.length > 20 && extracted.includes(',')) {
      return extracted;
    }
  }
  
  // Strategy 3: Look for "made with:" or "made from:" pattern
  const madeWithMatch = text.match(/made\s+(?:with|from)\s*:?\s*([^\n.]+(?:[^\n.]+)*)/i);
  if (madeWithMatch && madeWithMatch[1]) {
    const extracted = madeWithMatch[1].trim();
    if (extracted.length > 20 && extracted.includes(',')) {
      return extracted;
    }
  }
  
  // Strategy 4: Find lines with multiple commas (likely ingredient lists)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines) {
    const commaCount = (line.match(/,/g) || []).length;
    
    // If line has 3+ commas and is reasonably long, it's likely an ingredient list
    if (commaCount >= 3 && line.length > 30) {
      // Check if it contains food-related words
      const foodWords = ['flour', 'sugar', 'salt', 'oil', 'water', 'milk', 'egg', 
                         'wheat', 'corn', 'soy', 'protein', 'starch', 'yeast',
                         'flavor', 'preservative', 'acid', 'color'];
      
      const hasFoodWords = foodWords.some(word => line.toLowerCase().includes(word));
      
      if (hasFoodWords) {
        return line;
      }
    }
  }
  
  // Strategy 5: Look for text between "ingredients" and "nutrition facts"
  if (lowerText.includes('ingredients') && lowerText.includes('nutrition')) {
    const ingredientsIndex = lowerText.indexOf('ingredients');
    const nutritionIndex = lowerText.indexOf('nutrition');
    
    if (ingredientsIndex < nutritionIndex) {
      const between = text.substring(ingredientsIndex, nutritionIndex).trim();
      // Remove the word "ingredients" itself
      const cleaned = between.replace(/ingredients?\s*:?\s*/i, '').trim();
      
      if (cleaned.length > 30 && cleaned.includes(',')) {
        return cleaned;
      }
    }
  }
  
  // If no clear pattern found, return null
  return null;
}
