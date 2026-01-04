import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { extractTextFromImage, detectFoodInImage, extractProductName, extractIngredients } from '@/services/ocrService';
import { searchFoodProduct } from '@/services/foodDataService';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onCapture: (ingredientText: string, productName?: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [productName, setProductName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [noFoodDetected, setNoFoodDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

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
    setProcessingStep('Scanning image...');

    try {
      // Step 1: Detect if food item is present using real OCR
      setProcessingStep('Analyzing image with OCR...');
      const isFood = await detectFoodInImage(imageData);
      
      if (!isFood) {
        setNoFoodDetected(true);
        setError('No food item detected. Please scan a food product label with visible ingredients or nutrition facts.');
        setIsProcessing(false);
        setProcessingStep('');
        return;
      }

      // Step 2: Extract text using real OCR
      setProcessingStep('Extracting text from label...');
      const ocrResult = await extractTextFromImage(imageData);
      
      if (!ocrResult.text || ocrResult.text.trim().length < 10) {
        setError('Could not extract enough text from image. Please try again with better lighting and focus.');
        setIsProcessing(false);
        setProcessingStep('');
        return;
      }

      console.log('OCR Result:', {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        length: ocrResult.text.length
      });

      // Step 3: Extract product name
      setProcessingStep('Identifying product...');
      const detectedProductName = extractProductName(ocrResult.text);
      if (detectedProductName) {
        setProductName(detectedProductName);
        console.log('Detected product name:', detectedProductName);
      }

      // Step 4: Extract ingredient list
      setProcessingStep('Extracting ingredients...');
      const ingredients = extractIngredients(ocrResult.text);
      
      console.log('Extracted ingredients:', ingredients);
      
      if (ingredients && ingredients.length > 30) {
        setExtractedText(ingredients);
      } else {
        // If no clear ingredient list found, use full text
        console.log('No clear ingredient list found, using full OCR text');
        setExtractedText(ocrResult.text);
      }

      // Step 5: Try to fetch additional data from food databases
      if (detectedProductName) {
        setProcessingStep('Fetching product data from database...');
        try {
          const productData = await searchFoodProduct(detectedProductName);
          
          if (productData && productData.ingredients) {
            console.log('Found product in database:', productData.name);
            // Use database ingredients if available and more complete
            if (productData.ingredients.length > (ingredients?.length || 0)) {
              setExtractedText(productData.ingredients);
              console.log('Using database ingredients (more complete)');
            }
          }
        } catch (dbError) {
          console.log('Database lookup failed, using OCR data:', dbError);
          // Continue with OCR data if database lookup fails
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
    setProductName('');
    setNoFoodDetected(false);
    setError(null);
    setProcessingStep('');
    startCamera();
  };

  const handleConfirm = () => {
    if (extractedText.trim()) {
      onCapture(extractedText, productName || undefined);
    }
  };

  return (
    <div className="space-y-4">
      {!capturedImage ? (
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
          <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
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

      {productName && !isProcessing && (
        <div className="rounded-lg border border-border bg-primary/5 p-3">
          <p className="text-xs font-medium text-muted-foreground">Detected Product:</p>
          <p className="text-sm font-semibold text-foreground">{productName}</p>
        </div>
      )}

      {extractedText && !isProcessing && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Extracted ingredients (you can edit):</label>
          <Textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>
      )}

      <div className="flex gap-3">
        {!capturedImage ? (
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
            <Button variant="outline" onClick={retake} className="flex-1">
              Retake
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!extractedText.trim() || isProcessing}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
