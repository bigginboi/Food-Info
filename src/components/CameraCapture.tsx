import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, X, Check } from 'lucide-react';
import { extractTextFromImage, detectFoodItem, validateExtractedText } from '@/utils/ingredientAnalysis';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onCapture: (ingredientText: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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

    try {
      // Detect if food item is present (this now extracts text and validates it)
      const hasFoodItem = await detectFoodItem(imageData);
      
      if (!hasFoodItem) {
        setNoFoodDetected(true);
        setError('No food item detected. Please scan a food product label.');
        setIsProcessing(false);
        return;
      }

      // Extract text again for user to edit (already validated as food)
      const text = await extractTextFromImage(imageData);
      setExtractedText(text);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setExtractedText('');
    setNoFoodDetected(false);
    setError(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (extractedText.trim()) {
      onCapture(extractedText);
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
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Processing image...</p>
        </div>
      )}

      {extractedText && (
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
