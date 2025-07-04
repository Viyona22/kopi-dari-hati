
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Crop,
  Download,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageBlob: Blob) => void;
  aspectRatios?: { label: string; value: number }[];
  maxWidth?: number;
  maxHeight?: number;
}

const defaultAspectRatios = [
  { label: 'Original', value: 0 },
  { label: 'Square (1:1)', value: 1 },
  { label: 'Landscape (4:3)', value: 4/3 },
  { label: 'Portrait (3:4)', value: 3/4 },
  { label: 'Wide (16:9)', value: 16/9 },
];

export function ImageEditor({ 
  imageUrl, 
  isOpen, 
  onClose, 
  onSave,
  aspectRatios = defaultAspectRatios,
  maxWidth = 800,
  maxHeight = 600
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentImage, setCurrentImage] = useState<FabricImage | null>(null);
  const [quality, setQuality] = useState([0.9]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    console.log('Initializing canvas...');
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: maxWidth,
      height: maxHeight,
      backgroundColor: '#ffffff',
    });

    setFabricCanvas(canvas);
    console.log('Canvas initialized successfully');

    return () => {
      console.log('Disposing canvas...');
      canvas.dispose();
    };
  }, [isOpen, maxWidth, maxHeight]);

  // Load image
  useEffect(() => {
    if (!fabricCanvas || !imageUrl || !isOpen) return;

    console.log('Loading image:', imageUrl);
    setIsLoading(true);
    setError(null);

    const loadImage = async () => {
      try {
        // Simple approach - just use FabricImage.fromURL
        const img = await FabricImage.fromURL(imageUrl);
        
        console.log('Image loaded successfully');
        
        // Scale image to fit canvas
        const imgWidth = img.width || 100;
        const imgHeight = img.height || 100;
        const scale = Math.min(
          (maxWidth * 0.8) / imgWidth,
          (maxHeight * 0.8) / imgHeight,
          1
        );
        
        img.scale(scale);
        
        // Center the image
        img.set({
          left: (maxWidth - imgWidth * scale) / 2,
          top: (maxHeight - imgHeight * scale) / 2,
        });

        // Clear canvas and add image
        fabricCanvas.clear();
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        
        setCurrentImage(img);
        setIsLoading(false);
        
        console.log('Image added to canvas successfully');
        
      } catch (err) {
        console.error('Error loading image:', err);
        setError('Failed to load image. Please try again.');
        setIsLoading(false);
      }
    };

    loadImage();
  }, [fabricCanvas, imageUrl, isOpen, maxWidth, maxHeight]);

  const rotateImage = (degrees: number) => {
    if (!currentImage || !fabricCanvas) return;
    
    const currentAngle = currentImage.angle || 0;
    currentImage.set('angle', currentAngle + degrees);
    fabricCanvas.renderAll();
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!currentImage || !fabricCanvas) return;

    if (direction === 'horizontal') {
      currentImage.set('flipX', !currentImage.flipX);
    } else {
      currentImage.set('flipY', !currentImage.flipY);
    }
    
    fabricCanvas.renderAll();
  };

  const resetImage = () => {
    if (!fabricCanvas || !imageUrl) return;
    
    // Simply reload the image
    setCurrentImage(null);
    setSelectedAspectRatio('0');
    
    // Trigger image reload
    const canvas = fabricCanvas;
    setFabricCanvas(null);
    setTimeout(() => setFabricCanvas(canvas), 100);
  };

  const applyAspectRatio = (ratio: number) => {
    if (!currentImage || !fabricCanvas || ratio === 0) return;

    const currentWidth = currentImage.getScaledWidth();
    const currentHeight = currentImage.getScaledHeight();
    
    let newWidth, newHeight;
    
    if (currentWidth / currentHeight > ratio) {
      newHeight = currentHeight;
      newWidth = newHeight * ratio;
    } else {
      newWidth = currentWidth;
      newHeight = newWidth / ratio;
    }
    
    const scaleX = newWidth / (currentImage.width || 1);
    const scaleY = newHeight / (currentImage.height || 1);
    const scale = Math.min(scaleX, scaleY);
    
    currentImage.scale(scale);
    
    // Re-center the image
    currentImage.set({
      left: (maxWidth - newWidth) / 2,
      top: (maxHeight - newHeight) / 2
    });
    
    fabricCanvas.renderAll();
  };

  const handleAspectRatioChange = (value: string) => {
    setSelectedAspectRatio(value);
    const ratio = parseFloat(value);
    if (ratio > 0) {
      applyAspectRatio(ratio);
    }
  };

  const handleSave = async () => {
    if (!fabricCanvas) return;

    setIsLoading(true);
    
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: quality[0],
      });

      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      onSave(blob);
      toast.success('Image saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Edit Image
          </DialogTitle>
          <DialogDescription>
            Use the tools below to edit your image. You can rotate, flip, change aspect ratio, and adjust image quality.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading image...</span>
            </div>
          )}

          {/* Canvas */}
          <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded shadow-sm bg-white"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </div>

          {/* Toolbar */}
          {currentImage && !isLoading && (
            <>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(-90)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Rotate Left
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(90)}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate Right
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('horizontal')}
                >
                  <FlipHorizontal className="h-4 w-4 mr-1" />
                  Flip H
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('vertical')}
                >
                  <FlipVertical className="h-4 w-4 mr-1" />
                  Flip V
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImage}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select value={selectedAspectRatio} onValueChange={handleAspectRatioChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value.toString()}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Quality: {Math.round(quality[0] * 100)}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={0.1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !!error || !currentImage} 
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Download className="h-4 w-4 mr-1" />
              {isLoading ? 'Saving...' : 'Save Image'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
