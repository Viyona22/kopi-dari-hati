
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, X, Image as ImageIcon, Save, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageEditor } from './ImageEditor';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  onSave?: () => void;
  className?: string;
  editorConfig?: {
    aspectRatios?: { label: string; value: number }[];
    maxWidth?: number;
    maxHeight?: number;
  };
}

export function ImageUpload({ 
  currentImage, 
  onImageChange, 
  onImageRemove, 
  onSave, 
  className,
  editorConfig 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

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

  const handleEditSave = (editedBlob: Blob) => {
    // Convert blob to file
    const file = new File([editedBlob], 'edited-image.jpg', { type: 'image/jpeg' });
    handleFileSelect(file);
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
            alt="Uploaded image"
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
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={() => setShowEditor(true)}
            title="Edit Gambar"
          >
            <Edit className="h-3 w-3" />
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

      {/* Image Editor */}
      {currentImage && (
        <ImageEditor
          imageUrl={currentImage}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleEditSave}
          aspectRatios={editorConfig?.aspectRatios}
          maxWidth={editorConfig?.maxWidth}
          maxHeight={editorConfig?.maxHeight}
        />
      )}
    </div>
  );
}
