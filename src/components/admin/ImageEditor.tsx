
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
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    console.log('🎨 Initializing canvas...');
    setDebugInfo('Initializing canvas...');
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: maxWidth,
        height: maxHeight,
        backgroundColor: '#f8f9fa',
        selection: true,
      });

      // Add grid pattern for better visibility
      const gridSize = 20;
      const grid = [];
      for (let i = 0; i < maxWidth / gridSize; i++) {
        grid.push(`M${i * gridSize},0 L${i * gridSize},${maxHeight}`);
      }
      for (let i = 0; i < maxHeight / gridSize; i++) {
        grid.push(`M0,${i * gridSize} L${maxWidth},${i * gridSize}`);
      }

      canvas.renderAll();
      
      setFabricCanvas(canvas);
      setCanvasReady(true);
      setDebugInfo('Canvas ready');
      console.log('✅ Canvas initialized successfully');

      return () => {
        console.log('🗑️ Disposing canvas...');
        setCanvasReady(false);
        setDebugInfo('Canvas disposed');
        canvas.dispose();
      };
    } catch (error) {
      console.error('❌ Error initializing canvas:', error);
      setLoadingError('Failed to initialize canvas');
      setDebugInfo(`Canvas error: ${error}`);
    }
  }, [isOpen, maxWidth, maxHeight]);

  // Load image with multiple strategies
  useEffect(() => {
    if (!fabricCanvas || !imageUrl || !canvasReady) {
      console.log('⏳ Waiting for canvas or image URL...');
      return;
    }

    console.log('🖼️ Starting image load process:', imageUrl);
    setIsLoading(true);
    setLoadingError(null);
    setDebugInfo(`Loading image: ${imageUrl}`);

    const loadImageWithStrategies = async () => {
      try {
        // Strategy 1: Direct URL loading with FabricImage.fromURL
        console.log('📥 Attempting Strategy 1: FabricImage.fromURL');
        setDebugInfo('Strategy 1: Direct URL loading...');
        
        const fabricImg = await FabricImage.fromURL(imageUrl);
        
        if (!fabricImg) {
          throw new Error('FabricImage.fromURL returned null');
        }

        console.log('✅ Image loaded successfully with Strategy 1');
        setDebugInfo('Image loaded successfully');
        
        // Calculate scale to fit canvas
        const imgWidth = fabricImg.width || 100;
        const imgHeight = fabricImg.height || 100;
        const canvasWidth = fabricCanvas.getWidth();
        const canvasHeight = fabricCanvas.getHeight();
        
        const maxImgWidth = canvasWidth * 0.8;
        const maxImgHeight = canvasHeight * 0.8;
        
        const scaleX = maxImgWidth / imgWidth;
        const scaleY = maxImgHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY, 1);
        
        console.log('📏 Calculated scaling:', { scaleX, scaleY, finalScale: scale });
        setDebugInfo(`Scaling image: ${scale.toFixed(2)}x`);

        // Apply scaling and positioning
        fabricImg.scale(scale);
        
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        fabricImg.set({
          left: (canvasWidth - scaledWidth) / 2,
          top: (canvasHeight - scaledHeight) / 2,
          selectable: true,
          evented: true,
        });

        console.log('📍 Image positioned at:', {
          left: fabricImg.left,
          top: fabricImg.top,
          scaledWidth,
          scaledHeight
        });

        // Clear canvas and add image
        fabricCanvas.clear();
        fabricCanvas.add(fabricImg);
        fabricCanvas.setActiveObject(fabricImg);
        fabricCanvas.requestRenderAll();
        
        console.log('🎯 Canvas objects after adding image:', fabricCanvas.getObjects().length);

        setCurrentImage(fabricImg);
        setIsLoading(false);
        setDebugInfo('Image ready for editing');
        
        console.log('✅ Image successfully added to canvas');

      } catch (error) {
        console.error('❌ Strategy 1 failed, trying Strategy 2:', error);
        setDebugInfo('Strategy 1 failed, trying alternative...');
        
        try {
          // Strategy 2: Using HTML Image element
          console.log('📥 Attempting Strategy 2: HTML Image element');
          
          const imgElement = new Image();
          
          const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            imgElement.onload = () => {
              console.log('✅ Image element loaded successfully');
              resolve(imgElement);
            };
            
            imgElement.onerror = (error) => {
              console.error('❌ Image element failed to load:', error);
              reject(new Error('Failed to load image element'));
            };
          });

          // Remove CORS restrictions for internal images
          if (imageUrl.includes(window.location.origin) || imageUrl.includes('supabase')) {
            console.log('🔓 Using same-origin image, no CORS needed');
          } else {
            imgElement.crossOrigin = 'anonymous';
          }
          
          imgElement.src = imageUrl;
          
          const loadedImgElement = await imageLoadPromise;
          console.log('🔄 Converting to FabricImage...');
          
          const fabricImg = await FabricImage.fromElement(loadedImgElement);
          
          if (!fabricImg) {
            throw new Error('Failed to create FabricImage from element');
          }

          console.log('✅ FabricImage created successfully with Strategy 2');
          
          // Apply same scaling and positioning logic
          const imgWidth = fabricImg.width || 100;
          const imgHeight = fabricImg.height || 100;
          const canvasWidth = fabricCanvas.getWidth();
          const canvasHeight = fabricCanvas.getHeight();
          
          const maxImgWidth = canvasWidth * 0.8;
          const maxImgHeight = canvasHeight * 0.8;
          
          const scaleX = maxImgWidth / imgWidth;
          const scaleY = maxImgHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1);
          
          fabricImg.scale(scale);
          
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;
          
          fabricImg.set({
            left: (canvasWidth - scaledWidth) / 2,
            top: (canvasHeight - scaledHeight) / 2,
            selectable: true,
            evented: true,
          });

          fabricCanvas.clear();
          fabricCanvas.add(fabricImg);
          fabricCanvas.setActiveObject(fabricImg);
          fabricCanvas.requestRenderAll();
          
          setCurrentImage(fabricImg);
          setIsLoading(false);
          setDebugInfo('Image loaded with fallback method');
          
          console.log('✅ Image successfully loaded with Strategy 2');
          
        } catch (fallbackError) {
          console.error('❌ All strategies failed:', fallbackError);
          setLoadingError('Failed to load image. Please try a different image.');
          setDebugInfo(`All loading strategies failed: ${fallbackError}`);
          setIsLoading(false);
        }
      }
    };

    // Add timeout for loading
    const timeout = setTimeout(() => {
      console.error('⏰ Image loading timeout');
      setLoadingError('Image loading timeout');
      setDebugInfo('Loading timeout');
      setIsLoading(false);
    }, 10000);

    loadImageWithStrategies().finally(() => {
      clearTimeout(timeout);
    });
    
  }, [fabricCanvas, imageUrl, maxWidth, maxHeight, canvasReady]);

  const rotateImage = (degrees: number) => {
    if (!currentImage || !fabricCanvas) return;
    
    console.log(`🔄 Rotating image by ${degrees} degrees`);
    const currentAngle = currentImage.angle || 0;
    currentImage.set('angle', currentAngle + degrees);
    fabricCanvas.requestRenderAll();
    setDebugInfo(`Rotated ${degrees}°`);
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!currentImage || !fabricCanvas) return;

    console.log(`🔄 Flipping image ${direction}`);
    if (direction === 'horizontal') {
      currentImage.set('flipX', !currentImage.flipX);
    } else {
      currentImage.set('flipY', !currentImage.flipY);
    }
    
    fabricCanvas.requestRenderAll();
    setDebugInfo(`Flipped ${direction}`);
  };

  const resetImage = async () => {
    if (!fabricCanvas || !imageUrl) return;

    console.log('🔄 Resetting image to original state');
    setIsLoading(true);
    setLoadingError(null);
    setDebugInfo('Resetting image...');
    
    try {
      const fabricImg = await FabricImage.fromURL(imageUrl);
      
      if (!fabricImg) {
        throw new Error('Failed to reset image');
      }
      
      // Apply original scaling and positioning
      const imgWidth = fabricImg.width || 100;
      const imgHeight = fabricImg.height || 100;
      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      
      const maxImgWidth = canvasWidth * 0.8;
      const maxImgHeight = canvasHeight * 0.8;
      
      const scaleX = maxImgWidth / imgWidth;
      const scaleY = maxImgHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      
      fabricImg.scale(scale);
      
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      
      fabricImg.set({
        left: (canvasWidth - scaledWidth) / 2,
        top: (canvasHeight - scaledHeight) / 2,
        selectable: true,
        evented: true,
        angle: 0,
        flipX: false,
        flipY: false,
      });

      fabricCanvas.clear();
      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.requestRenderAll();
      
      setCurrentImage(fabricImg);
      setSelectedAspectRatio('0');
      setIsLoading(false);
      setDebugInfo('Image reset complete');
      
      console.log('✅ Image reset successful');
    } catch (error) {
      console.error('❌ Error resetting image:', error);
      toast.error('Failed to reset image');
      setDebugInfo(`Reset failed: ${error}`);
      setIsLoading(false);
    }
  };

  const applyAspectRatio = (ratio: number) => {
    if (!currentImage || !fabricCanvas || ratio === 0) return;

    console.log('📐 Applying aspect ratio:', ratio);
    setDebugInfo(`Applying aspect ratio: ${ratio}`);
    
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
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    
    currentImage.set({
      left: (canvasWidth - newWidth) / 2,
      top: (canvasHeight - newHeight) / 2
    });
    
    fabricCanvas.requestRenderAll();
    setDebugInfo(`Aspect ratio applied: ${ratio}`);
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

    console.log('💾 Saving edited image...');
    setIsLoading(true);
    setDebugInfo('Saving image...');
    
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: quality[0],
        multiplier: 1,
      });

      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      console.log('✅ Image saved successfully, blob size:', blob.size);
      setDebugInfo(`Saved: ${(blob.size / 1024).toFixed(1)}KB`);
      onSave(blob);
      toast.success('Image successfully edited');
      onClose();
    } catch (error) {
      console.error('❌ Error saving image:', error);
      toast.error('Failed to save image');
      setDebugInfo(`Save failed: ${error}`);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    console.log('🚪 Closing image editor');
    setLoadingError(null);
    setCanvasReady(false);
    setDebugInfo('');
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
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div>Canvas: {canvasReady ? '✅' : '❌'} | Objects: {fabricCanvas?.getObjects().length || 0}</div>
              <div>URL: {imageUrl ? imageUrl.substring(0, 50) + '...' : '❌'}</div>
              <div>Status: {debugInfo}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading image...</span>
            </div>
          )}

          {/* Error State */}
          {loadingError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p>{loadingError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            </div>
          )}

          {/* Toolbar */}
          {canvasReady && !isLoading && !loadingError && (
            <>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(-90)}
                  disabled={isLoading || !currentImage}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Rotate Left
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(90)}
                  disabled={isLoading || !currentImage}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate Right
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('horizontal')}
                  disabled={isLoading || !currentImage}
                >
                  <FlipHorizontal className="h-4 w-4 mr-1" />
                  Flip H
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('vertical')}
                  disabled={isLoading || !currentImage}
                >
                  <FlipVertical className="h-4 w-4 mr-1" />
                  Flip V
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImage}
                  disabled={isLoading || !currentImage}
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

              {/* Canvas */}
              <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-gray-300 rounded shadow-sm max-w-full max-h-[400px] bg-white"
                  style={{ display: canvasReady ? 'block' : 'none' }}
                />
                {!canvasReady && (
                  <div className="w-full h-[400px] bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">Initializing canvas...</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !!loadingError || !currentImage} 
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
