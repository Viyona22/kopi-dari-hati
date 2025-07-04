import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, util } from 'fabric';
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
  RefreshCw
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

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: maxWidth,
      height: maxHeight,
      backgroundColor: '#f0f0f0',
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [isOpen, maxWidth, maxHeight]);

  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    setIsLoading(true);
    
    util.loadImage(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      const fabricImg = new FabricImage(img, {
        left: 0,
        top: 0,
        selectable: true,
        evented: true,
      });

      // Scale image to fit canvas
      const imgWidth = fabricImg.getScaledWidth();
      const imgHeight = fabricImg.getScaledHeight();
      
      const scale = Math.min(
        maxWidth / imgWidth,
        maxHeight / imgHeight,
        1
      );
      
      fabricImg.scaleToWidth(imgWidth * scale);
      
      // Center the image manually
      const canvasCenter = fabricCanvas.getCenterPoint();
      fabricImg.setXY(canvasCenter, 'center', 'center');

      fabricCanvas.clear();
      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.renderAll();

      setOriginalImage(fabricImg);
      setCurrentImage(fabricImg);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error loading image:', error);
      toast.error('Gagal memuat gambar');
      setIsLoading(false);
    });
  }, [fabricCanvas, imageUrl, maxWidth, maxHeight]);

  const rotateImage = (degrees: number) => {
    if (!currentImage) return;
    
    const currentAngle = currentImage.angle || 0;
    currentImage.rotate(currentAngle + degrees);
    fabricCanvas?.renderAll();
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!currentImage) return;

    if (direction === 'horizontal') {
      currentImage.set('flipX', !currentImage.flipX);
    } else {
      currentImage.set('flipY', !currentImage.flipY);
    }
    
    fabricCanvas?.renderAll();
  };

  const resetImage = async () => {
    if (!originalImage || !fabricCanvas) return;

    setIsLoading(true);
    
    try {
      // Create a new image from the original
      const originalElement = originalImage.getElement();
      const newImg = new FabricImage(originalElement, {
        left: 0,
        top: 0,
        selectable: true,
        evented: true,
        angle: 0,
        flipX: false,
        flipY: false,
      });
      
      // Scale to fit canvas
      const imgWidth = newImg.getScaledWidth();
      const imgHeight = newImg.getScaledHeight();
      
      const scale = Math.min(
        maxWidth / imgWidth,
        maxHeight / imgHeight,
        1
      );
      
      newImg.scaleToWidth(imgWidth * scale);
      
      // Center the image
      const canvasCenter = fabricCanvas.getCenterPoint();
      newImg.setXY(canvasCenter, 'center', 'center');

      fabricCanvas.clear();
      fabricCanvas.add(newImg);
      fabricCanvas.setActiveObject(newImg);
      fabricCanvas.renderAll();
      
      setCurrentImage(newImg);
      setSelectedAspectRatio('0');
    } catch (error) {
      console.error('Error resetting image:', error);
      toast.error('Gagal reset gambar');
    }
    
    setIsLoading(false);
  };

  const applyAspectRatio = (ratio: number) => {
    if (!currentImage || !fabricCanvas || ratio === 0) return;

    const imgWidth = currentImage.getScaledWidth();
    const imgHeight = currentImage.getScaledHeight();
    
    let newWidth, newHeight;
    
    if (imgWidth / imgHeight > ratio) {
      newHeight = imgHeight;
      newWidth = newHeight * ratio;
    } else {
      newWidth = imgWidth;
      newHeight = newWidth / ratio;
    }
    
    const scaleX = newWidth / currentImage.width!;
    const scaleY = newHeight / currentImage.height!;
    const scale = Math.min(scaleX, scaleY);
    
    currentImage.scaleToWidth(currentImage.width! * scale);
    
    // Center the image
    const canvasCenter = fabricCanvas.getCenterPoint();
    currentImage.setXY(canvasCenter, 'center', 'center');
    
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
        multiplier: 1,
      });

      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      onSave(blob);
      toast.success('Gambar berhasil diedit');
      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Gagal menyimpan gambar');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          {/* Toolbar */}
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
              className="border border-gray-300 rounded shadow-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
              <Download className="h-4 w-4 mr-1" />
              {isLoading ? 'Menyimpan...' : 'Simpan Gambar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
