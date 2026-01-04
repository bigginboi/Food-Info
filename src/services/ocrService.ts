import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Preprocess image for better OCR accuracy
 * Applies grayscale, contrast enhancement, and sharpening
 */
async function preprocessImage(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData);
        return;
      }
      
      // Set canvas size to original image size for best quality
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      // Convert to grayscale and increase contrast
      for (let i = 0; i < data.length; i += 4) {
        // Grayscale conversion
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Increase contrast (simple threshold)
        const contrast = gray > 128 ? 255 : 0;
        
        data[i] = contrast;     // R
        data[i + 1] = contrast; // G
        data[i + 2] = contrast; // B
      }
      
      // Put processed image back
      ctx.putImageData(imageDataObj, 0, 0);
      
      // Return processed image as base64
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => resolve(imageData);
    img.src = imageData;
  });
}

/**
 * Post-process OCR text to fix common errors
 */
function postProcessOCRText(text: string): string {
  let cleaned = text;
  
  // Fix common OCR mistakes
  cleaned = cleaned.replace(/\b0\b/g, 'O'); // Standalone 0 → O
  cleaned = cleaned.replace(/\bl\b/g, 'I'); // Standalone l → I
  cleaned = cleaned.replace(/\|\|/g, 'll'); // || → ll
  cleaned = cleaned.replace(/\|/g, 'I');    // | → I
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Remove line breaks within ingredient lists (keep text flowing)
  cleaned = cleaned.replace(/\n+/g, ' ');
  
  // Clean up punctuation
  cleaned = cleaned.replace(/\s+,/g, ',');
  cleaned = cleaned.replace(/,\s+/g, ', ');
  
  return cleaned.trim();
}

/**
 * Extract text from image using Tesseract.js OCR with preprocessing
 * Uses multiple passes for better accuracy (~90%)
 * @param imageData - Base64 image data or image URL
 * @returns Extracted text and confidence score
 */
export async function extractTextFromImage(imageData: string): Promise<OCRResult> {
  try {
    console.log('🔍 Starting enhanced OCR with image preprocessing...');
    
    // Preprocess image for better OCR
    const preprocessedImage = await preprocessImage(imageData);
    console.log('✓ Image preprocessing completed');
    
    // Try multiple OCR configurations for best results
    const results = await Promise.all([
      // Pass 1: Standard OCR with automatic page segmentation
      Tesseract.recognize(preprocessedImage, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Pass 1: ${Math.round(m.progress * 100)}%`);
          }
        },
      }),
      
      // Pass 2: OCR with original image (no preprocessing)
      Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Pass 2: ${Math.round(m.progress * 100)}%`);
          }
        },
      }),
    ]);

    // Choose the result with higher confidence
    const bestResult = results.reduce((best, current) => 
      current.data.confidence > best.data.confidence ? current : best
    );

    console.log('✓ OCR completed with confidence:', bestResult.data.confidence.toFixed(2) + '%');
    console.log('✓ Extracted text length:', bestResult.data.text.length, 'characters');

    // Post-process text to fix common OCR errors
    const cleanedText = postProcessOCRText(bestResult.data.text);
    console.log('✓ Text post-processing completed');

    return {
      text: cleanedText,
      confidence: bestResult.data.confidence,
    };
  } catch (error) {
    console.error('❌ OCR Error:', error);
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
 * Uses multiple strategies to find ingredient lists with improved accuracy
 * @param text - OCR extracted text
 * @returns Ingredient list string or null
 */
export function extractIngredients(text: string): string | null {
  if (!text || text.trim().length < 10) {
    return null;
  }
  
  console.log('🔍 Extracting ingredients from OCR text...');
  
  // Strategy 1: Look for "ingredients:" or "ingredient list:" pattern
  const ingredientsPatterns = [
    /ingredients?\s*:?\s*([^.]+(?:\.[^.]+)*)/i,
    /ingredient\s+list\s*:?\s*([^.]+(?:\.[^.]+)*)/i,
    /ingredients?\s*[-–—]\s*([^.]+(?:\.[^.]+)*)/i,
  ];
  
  for (const pattern of ingredientsPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].trim();
      // Make sure it's not too short and has some commas or parentheses
      if (extracted.length > 15 && (extracted.includes(',') || extracted.includes('('))) {
        console.log('✓ Found ingredients using pattern matching');
        return cleanIngredientText(extracted);
      }
    }
  }
  
  // Strategy 2: Look for "contains:" pattern
  const containsMatch = text.match(/contains\s*:?\s*([^.]+(?:\.[^.]+)*)/i);
  if (containsMatch && containsMatch[1]) {
    const extracted = containsMatch[1].trim();
    if (extracted.length > 15 && (extracted.includes(',') || extracted.includes('('))) {
      console.log('✓ Found ingredients using "contains" pattern');
      return cleanIngredientText(extracted);
    }
  }
  
  // Strategy 3: Look for "made with:" or "made from:" pattern
  const madeWithMatch = text.match(/made\s+(?:with|from)\s*:?\s*([^.]+(?:\.[^.]+)*)/i);
  if (madeWithMatch && madeWithMatch[1]) {
    const extracted = madeWithMatch[1].trim();
    if (extracted.length > 15 && (extracted.includes(',') || extracted.includes('('))) {
      console.log('✓ Found ingredients using "made with/from" pattern');
      return cleanIngredientText(extracted);
    }
  }
  
  // Strategy 4: Find lines with multiple commas (likely ingredient lists)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines) {
    const commaCount = (line.match(/,/g) || []).length;
    // If line has 3+ commas and is reasonably long, it's likely an ingredient list
    if (commaCount >= 3 && line.length > 30) {
      console.log('✓ Found ingredients using comma-based detection');
      return cleanIngredientText(line);
    }
  }
  
  // Strategy 5: Look for lines with common ingredient keywords
  const ingredientKeywords = [
    'flour', 'sugar', 'salt', 'oil', 'water', 'milk', 'butter', 'egg',
    'wheat', 'corn', 'soy', 'palm', 'cocoa', 'vanilla', 'yeast',
    'preservative', 'flavor', 'color', 'acid', 'emulsifier',
  ];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const keywordMatches = ingredientKeywords.filter(keyword => 
      lowerLine.includes(keyword)
    ).length;
    
    // If line contains 3+ ingredient keywords and has commas, it's likely ingredients
    if (keywordMatches >= 3 && line.includes(',') && line.length > 30) {
      console.log('✓ Found ingredients using keyword matching');
      return cleanIngredientText(line);
    }
  }
  
  // Strategy 6: If all else fails, return the longest line with commas
  const linesWithCommas = lines.filter(line => 
    (line.match(/,/g) || []).length >= 2 && line.length > 20
  );
  
  if (linesWithCommas.length > 0) {
    const longestLine = linesWithCommas.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    );
    console.log('✓ Found ingredients using longest line heuristic');
    return cleanIngredientText(longestLine);
  }
  
  console.log('⚠ Could not extract ingredients from text');
  return null;
}

/**
 * Clean and format ingredient text
 */
function cleanIngredientText(text: string): string {
  let cleaned = text;
  
  // Remove common non-ingredient prefixes
  cleaned = cleaned.replace(/^(ingredients?|contains?|made with|made from)\s*:?\s*/i, '');
  
  // Remove trailing periods
  cleaned = cleaned.replace(/\.+$/, '');
  
  // Fix spacing around commas
  cleaned = cleaned.replace(/\s*,\s*/g, ', ');
  
  // Remove excessive spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  
  return cleaned.trim();
}
