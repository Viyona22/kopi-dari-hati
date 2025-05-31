
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, X, Image as ImageIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  onSave?: () => void;
  className?: string;
}

export function ImageUpload({ currentImage, onImageChange, onImageRemove, onSave, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      onImageChange(file);
    } catch (error) {
      console.error('Error handling file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } catch (error) {
        console.error('Error saving:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Hidden file inputs */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <Input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Current Image Display */}
      {currentImage && (
        <div className="relative inline-block">
          <img 
            src={currentImage} 
            alt="Menu item"
            className="w-20 h-20 object-cover rounded-md border"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={onImageRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerCameraInput}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Camera className="h-4 w-4" />
          Camera
        </Button>

        {onSave && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        )}
      </div>

      {/* Placeholder when no image */}
      {!currentImage && (
        <div className="w-20 h-20 bg-gray-200 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
          <ImageIcon className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}
