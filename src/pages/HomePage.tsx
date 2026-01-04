import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router';
import { Camera, Edit3, Beaker, ChevronDown, ChevronUp } from 'lucide-react';
import { sampleProducts } from '@/utils/mockData';
import CameraCapture from '@/components/CameraCapture';
import AppHeader from '@/components/AppHeader';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleCameraCapture = (ingredientText: string, productName?: string) => {
    setShowCamera(false);
    navigate('/results', { state: { ingredientList: ingredientText, productName } });
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setShowTextInput(false);
      navigate('/results', { state: { ingredientList: textInput } });
    }
  };

  const handleSampleSelect = (ingredientList: string) => {
    setShowSamples(false);
    navigate('/results', { state: { ingredientList } });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background to-secondary">
      <AppHeader />
      
      <div className="mx-auto w-full max-w-2xl space-y-8 p-4 py-8 xl:p-8 xl:py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
            Understand what's really in your food
          </h1>
          <p className="text-base text-muted-foreground xl:text-lg">
            Get clear, honest ingredient insights — in seconds.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-auto py-6 text-lg"
            onClick={() => setShowCamera(true)}
          >
            <Camera className="mr-3 h-6 w-6" />
            Scan Food Label
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-auto py-6 text-lg"
            onClick={() => setShowTextInput(true)}
          >
            <Edit3 className="mr-3 h-6 w-6" />
            Paste / Type Ingredients
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-auto py-6 text-lg"
            onClick={() => setShowSamples(true)}
          >
            <Beaker className="mr-3 h-6 w-6" />
            Try a Sample Label
          </Button>
        </div>

        <Card className="p-6">
          <Collapsible open={showHowItWorks} onOpenChange={setShowHowItWorks}>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <h3 className="text-lg font-semibold">How it works</h3>
              {showHowItWorks ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>
                1. <strong>Scan or input</strong> the ingredient list from any food product
              </p>
              <p>
                2. <strong>AI analyzes</strong> each ingredient and classifies it as natural, processed, or synthetic
              </p>
              <p>
                3. <strong>Get insights</strong> tailored to your goals and preferences
              </p>
              <p>
                4. <strong>Make informed choices</strong> about what you eat
              </p>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          This app summarizes public research and regulatory guidance. It does not provide medical advice.
        </p>
      </div>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Food Label</DialogTitle>
          </DialogHeader>
          <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />
        </DialogContent>
      </Dialog>

      {/* Text Input Dialog */}
      <Dialog open={showTextInput} onOpenChange={setShowTextInput}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enter Ingredients</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste or type the ingredient list here... (e.g., flour, sugar, salt, yeast, water)"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowTextInput(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleTextSubmit} disabled={!textInput.trim()} className="flex-1">
                Analyze
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sample Products Dialog */}
      <Dialog open={showSamples} onOpenChange={setShowSamples}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Try a Sample Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {sampleProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer p-4 transition-colors hover:bg-accent"
                onClick={() => handleSampleSelect(product.ingredientList)}
              >
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
