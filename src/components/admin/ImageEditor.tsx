
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
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
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [currentImage, setCurrentImage] = useState<FabricImage | null>(null);
  const [quality, setQuality] = useState([0.9]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    console.log('Initializing canvas...');
    const canvas = new FabricCanvas(canvasRef.current, {
      width: maxWidth,
      height: maxHeight,
      backgroundColor: '#f8f9fa',
    });

    setFabricCanvas(canvas);
    console.log('Canvas initialized:', canvas);

    return () => {
      console.log('Disposing canvas...');
      canvas.dispose();
    };
  }, [isOpen, maxWidth, maxHeight]);

  // Load image into canvas
  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    console.log('Loading image:', imageUrl);
    setIsLoading(true);
    setLoadingError(null);

    // Create image element directly instead of using util.loadImage
    const imgElement = new Image();
    
    imgElement.onload = () => {
      console.log('Image loaded successfully:', imgElement.width, 'x', imgElement.height);
      
      try {
        const fabricImg = new FabricImage(imgElement, {
          left: 0,
          top: 0,
          selectable: true,
          evented: true,
        });

        // Calculate scale to fit canvas while maintaining aspect ratio
        const imgWidth = imgElement.width;
        const imgHeight = imgElement.height;
        
        const scaleX = (maxWidth * 0.9) / imgWidth; // Use 90% of canvas width
        const scaleY = (maxHeight * 0.9) / imgHeight; // Use 90% of canvas height
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
        
        console.log('Calculated scale:', scale);
        
        if (scale < 1) {
          fabricImg.scale(scale);
        }

        // Center the image on canvas
        const canvasWidth = fabricCanvas.getWidth();
        const canvasHeight = fabricCanvas.getHeight();
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        fabricImg.set({
          left: (canvasWidth - scaledWidth) / 2,
          top: (canvasHeight - scaledHeight) / 2
        });

        // Clear canvas and add image
        fabricCanvas.clear();
        fabricCanvas.add(fabricImg);
        fabricCanvas.setActiveObject(fabricImg);
        fabricCanvas.renderAll();

        setOriginalImage(fabricImg);
        setCurrentImage(fabricImg);
        setIsLoading(false);
        
        console.log('Image added to canvas successfully');
      } catch (error) {
        console.error('Error creating fabric image:', error);
        setLoadingError('Gagal memproses gambar');
        setIsLoading(false);
      }
    };

    imgElement.onerror = (error) => {
      console.error('Error loading image:', error);
      setLoadingError('Gagal memuat gambar. Pastikan URL gambar valid.');
      setIsLoading(false);
    };

    // Set image source (remove crossOrigin for Supabase storage)
    imgElement.src = imageUrl;
    
  }, [fabricCanvas, imageUrl, maxWidth, maxHeight]);

  const rotateImage = (degrees: number) => {
    if (!currentImage || !fabricCanvas) return;
    
    console.log(`Rotating image by ${degrees} degrees`);
    const currentAngle = currentImage.angle || 0;
    currentImage.set('angle', currentAngle + degrees);
    fabricCanvas.renderAll();
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!currentImage || !fabricCanvas) return;

    console.log(`Flipping image ${direction}`);
    if (direction === 'horizontal') {
      currentImage.set('flipX', !currentImage.flipX);
    } else {
      currentImage.set('flipY', !currentImage.flipY);
    }
    
    fabricCanvas.renderAll();
  };

  const resetImage = async () => {
    if (!originalImage || !fabricCanvas || !imageUrl) return;

    console.log('Resetting image to original state');
    setIsLoading(true);
    
    try {
      // Recreate image from original URL
      const imgElement = new Image();
      
      imgElement.onload = () => {
        const newImg = new FabricImage(imgElement, {
          left: 0,
          top: 0,
          selectable: true,
          evented: true,
          angle: 0,
          flipX: false,
          flipY: false,
        });
        
        // Apply same scaling as initial load
        const imgWidth = imgElement.width;
        const imgHeight = imgElement.height;
        const scaleX = (maxWidth * 0.9) / imgWidth;
        const scaleY = (maxHeight * 0.9) / imgHeight;
        const scale = Math.min(scaleX, scaleY, 1);
        
        if (scale < 1) {
          newImg.scale(scale);
        }

        // Center the image
        const canvasWidth = fabricCanvas.getWidth();
        const canvasHeight = fabricCanvas.getHeight();
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        newImg.set({
          left: (canvasWidth - scaledWidth) / 2,
          top: (canvasHeight - scaledHeight) / 2
        });

        fabricCanvas.clear();
        fabricCanvas.add(newImg);
        fabricCanvas.setActiveObject(newImg);
        fabricCanvas.renderAll();
        
        setCurrentImage(newImg);
        setSelectedAspectRatio('0');
        setIsLoading(false);
      };

      imgElement.src = imageUrl;
    } catch (error) {
      console.error('Error resetting image:', error);
      toast.error('Gagal reset gambar');
      setIsLoading(false);
    }
  };

  const applyAspectRatio = (ratio: number) => {
    if (!currentImage || !fabricCanvas || ratio === 0) return;

    console.log('Applying aspect ratio:', ratio);
    
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
    
    const scaleX = newWidth / currentImage.width!;
    const scaleY = newHeight / currentImage.height!;
    const scale = Math.min(scaleX, scaleY);
    
    currentImage.scale(scale);
    
    // Re-center the image
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    
    currentImage.set({
      left: (canvasWidth - newWidth) / 2,
      top: (canvasHeight - newHeight) / 2
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

    console.log('Saving edited image...');
    setIsLoading(true);
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: quality[0],
        multiplier: 1,
      });

      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      console.log('Image saved successfully');
      onSave(blob);
      toast.success('Gambar berhasil diedit');
      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Gagal menyimpan gambar');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    console.log('Closing image editor');
    setLoadingError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Edit Gambar
          </DialogTitle>
          <DialogDescription>
            Gunakan tools di bawah untuk mengedit gambar Anda. Anda dapat memutar, membalik, mengubah rasio aspek, dan mengatur kualitas gambar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat gambar...</span>
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
                Muat Ulang
              </Button>
            </div>
          )}

          {/* Toolbar */}
          {!isLoading && !loadingError && (
            <>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(-90)}
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Putar Kiri
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(90)}
                  disabled={isLoading}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Putar Kanan
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('horizontal')}
                  disabled={isLoading}
                >
                  <FlipHorizontal className="h-4 w-4 mr-1" />
                  Balik H
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => flipImage('vertical')}
                  disabled={isLoading}
                >
                  <FlipVertical className="h-4 w-4 mr-1" />
                  Balik V
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImage}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Rasio Aspek</Label>
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
                  <Label>Kualitas: {Math.round(quality[0] * 100)}%</Label>
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
                  className="border border-gray-300 rounded shadow-sm max-w-full max-h-[400px]"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Batal
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !!loadingError} 
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Download className="h-4 w-4 mr-1" />
              {isLoading ? 'Menyimpan...' : 'Simpan Gambar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
