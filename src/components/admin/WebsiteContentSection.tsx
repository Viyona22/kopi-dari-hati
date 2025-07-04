
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Globe, Save, Clock, Image as ImageIcon, X } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function WebsiteContentSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  
  const [openTime, setOpenTime] = useState(getSetting('operational_hours_open', '08:00'));
  const [closeTime, setCloseTime] = useState(getSetting('operational_hours_close', '22:00'));
  const [isOpen, setIsOpen] = useState(getSetting('operational_is_open', true));
  const [atmosphereImages, setAtmosphereImages] = useState(getSetting('atmosphere_images', []));

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `atmosphere-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('cafe-assets')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('cafe-assets')
        .getPublicUrl(fileName);

      const newImages = [...atmosphereImages, publicUrlData.publicUrl];
      setAtmosphereImages(newImages);
      toast.success('Gambar berhasil diunggah');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengunggah gambar');
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = atmosphereImages.filter((_, i) => i !== index);
    setAtmosphereImages(newImages);
  };

  const handleSave = async () => {
    const success = await Promise.all([
      updateSetting('operational_hours_open', openTime, 'operations'),
      updateSetting('operational_hours_close', closeTime, 'operations'),
      updateSetting('operational_is_open', isOpen, 'operations'),
      updateSetting('atmosphere_images', atmosphereImages, 'content')
    ]);

    if (success.every(Boolean)) {
      toast.success('Konten website berhasil disimpan');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Konten Website
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Operational Hours */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5" />
            <Label className="text-base font-medium">Jam Operasional</Label>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="is-open"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is-open">Cafe sedang buka</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Jam Buka</Label>
              <Input
                id="open-time"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Jam Tutup</Label>
              <Input
                id="close-time"
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Atmosphere Images */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-5 w-5" />
            <Label className="text-base font-medium">Gambar Suasana Cafe</Label>
          </div>
          
          {/* Current Images */}
          {atmosphereImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {atmosphereImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Suasana ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload New Image */}
          <ImageUpload
            onImageChange={handleImageUpload}
            onImageRemove={() => {}}
            className="border-dashed border-2 border-gray-300 p-4 rounded-lg"
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updating}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updating ? 'Menyimpan...' : 'Simpan Konten Website'}
        </Button>
      </CardContent>
    </Card>
  );
}
