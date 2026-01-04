import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { extractTextFromImage, detectFoodInImage, extractIngredients } from '@/services/ocrService';
import { searchFoodProduct } from '@/services/foodDataService';
import { analyzeImageVisually } from '@/services/visualAnalysisService';
import { searchProductKeywords } from '@/services/keywordDatabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onCapture: (ingredientText: string) => void;
  onCancel: () => void;
  uploadedImage?: string;
}

export default function CameraCapture({ onCapture, onCancel, uploadedImage }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(uploadedImage || null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrConfidence, setOcrConfidence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [noFoodDetected, setNoFoodDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // If uploadedImage is provided, process it immediately
    if (uploadedImage) {
      processImage(uploadedImage);
    } else {
      // Otherwise start camera
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [uploadedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);
    setNoFoodDetected(false);
    setProcessingStep('Analyzing image...');

    try {
      // PARALLEL PROCESSING: Run OCR and Visual Analysis simultaneously for speed
      setProcessingStep('Running OCR and visual analysis...');
      
      const [visualResult, ocrResult, foodDetected] = await Promise.all([
        analyzeImageVisually(imageData),
        extractTextFromImage(imageData),
        detectFoodInImage(imageData),
      ]);
      
      console.log('Visual Analysis Result:', visualResult);
      console.log('OCR Result:', ocrResult);
      console.log('Food Detected:', foodDetected);
      
      // Check if food was detected
      if (!foodDetected) {
        setNoFoodDetected(true);
        setError('No food item detected. Please scan a food product label with visible ingredients or nutrition facts.');
        setIsProcessing(false);
        setProcessingStep('');
        return;
      }
      
      // Check OCR quality
      if (!ocrResult.text || ocrResult.text.trim().length < 10) {
        // If OCR failed but visual analysis succeeded, use predicted ingredients
        if (visualResult.predictedIngredients.length > 0) {
          console.log('OCR failed, using visual analysis predictions');
          setExtractedText(visualResult.predictedIngredients.join(', '));
          setProcessingStep('');
          setIsProcessing(false);
          return;
        }
        
        setError('Could not extract enough text from image. Please try again with better lighting and focus.');
        setIsProcessing(false);
        setProcessingStep('');
        return;
      }

      // STEP 1: Search for product keywords in OCR text
      setProcessingStep('Searching for product keywords...');
      const keywordMatch = searchProductKeywords(ocrResult.text);
      
      if (keywordMatch) {
        // Found a keyword match! Use predefined ingredients
        console.log('✓ Keyword match found:', keywordMatch.productName);
        console.log('Using predefined ingredients from database');
        setExtractedText(keywordMatch.ingredients);
        setProcessingStep('');
        setIsProcessing(false);
        return;
      }
      
      console.log('No keyword match found, proceeding with OCR extraction');

      // STEP 2: Extract ingredient list from OCR
      setProcessingStep('Extracting ingredients from text...');
      const ocrIngredients = extractIngredients(ocrResult.text);
      
      console.log('OCR extracted ingredients:', ocrIngredients);
      console.log('OCR confidence:', ocrResult.confidence.toFixed(2) + '%');
      console.log('Visual predicted ingredients:', visualResult.predictedIngredients);
      
      // Store OCR confidence
      setOcrConfidence(ocrResult.confidence);
      
      // Combine OCR and visual analysis
      let finalIngredients = '';
      
      if (ocrIngredients && ocrIngredients.length > 30) {
        // OCR found good ingredient list
        finalIngredients = ocrIngredients;
        
        // Add visual predictions if they're not already in OCR text
        const visualPredictions = visualResult.predictedIngredients.filter(
          ing => !ocrIngredients.toLowerCase().includes(ing.toLowerCase())
        );
        
        if (visualPredictions.length > 0) {
          finalIngredients += '. Visual analysis suggests: ' + visualPredictions.join(', ');
        }
      } else if (visualResult.predictedIngredients.length > 0) {
        // OCR failed, use visual predictions
        finalIngredients = 'Based on visual analysis: ' + visualResult.predictedIngredients.join(', ');
        
        if (ocrResult.text) {
          finalIngredients += '. OCR text: ' + ocrResult.text;
        }
      } else {
        // Use whatever we have
        finalIngredients = ocrResult.text;
      }
      
      setExtractedText(finalIngredients);

      // STEP 3: Try to fetch additional data from FDA database (optional enhancement)
      if (visualResult.predictedFoodType && visualResult.predictedFoodType !== 'Unknown') {
        setProcessingStep('Checking FDA database...');
        try {
          const productData = await searchFoodProduct(visualResult.predictedFoodType);
          
          if (productData && productData.ingredients && productData.ingredients.length > 50) {
            console.log('Found additional data in FDA database');
            // Use database ingredients if available and more complete
            if (productData.ingredients.length > finalIngredients.length) {
              setExtractedText(productData.ingredients);
              console.log('Using FDA database ingredients (more complete)');
            }
          }
        } catch (dbError) {
          console.log('FDA database lookup failed, using extracted data:', dbError);
        }
      }

      setProcessingStep('');
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process image. Please try again with a clearer photo of the food label.');
      setProcessingStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setExtractedText('');
    setNoFoodDetected(false);
    setError(null);
    setProcessingStep('');
    startCamera();
  };

  const handleConfirm = () => {
    if (extractedText.trim()) {
      onCapture(extractedText);
    }
  };

  return (
    <div className="space-y-4">
      {/* Scanning Tips */}
      {!capturedImage && !isProcessing && !uploadedImage && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">📸 Tips for Best Results:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Ensure good lighting on the label</li>
                <li>• Focus on the ingredient section</li>
                <li>• Hold camera steady and avoid blur</li>
                <li>• Make sure text is clearly visible</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!capturedImage && !uploadedImage ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img src={capturedImage || ''} alt="Captured" className="h-full w-full object-cover" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {noFoodDetected && (
        <Alert>
          <AlertDescription>
            No food item detected. Please capture an image of a food label and try again.
          </AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm font-medium">{processingStep || 'Processing image...'}</p>
        </div>
      )}


      {extractedText && !isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Extracted ingredients (you can edit):</label>
            {ocrConfidence > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">OCR Confidence:</span>
                <span className={`text-xs font-semibold ${
                  ocrConfidence >= 80 ? 'text-natural' : 
                  ocrConfidence >= 60 ? 'text-processed' : 
                  'text-synthetic'
                }`}>
                  {ocrConfidence.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
          <Textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            💡 Tip: Review and correct any errors before analyzing
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {!capturedImage && !uploadedImage ? (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={captureImage} disabled={!stream} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </>
        ) : (
          <>
            {!uploadedImage && (
              <Button variant="outline" onClick={retake} className="flex-1">
                Retake
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={!extractedText.trim() || isProcessing}
              className={uploadedImage ? 'w-full' : 'flex-1'}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm & Analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
