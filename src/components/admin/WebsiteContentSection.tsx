
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Globe, Save, Clock, Image as ImageIcon, X, Edit } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageEditor } from './ImageEditor';

const atmosphereAspectRatios = [
  { label: 'Landscape (4:3)', value: 4/3 },
  { label: 'Wide (16:9)', value: 16/9 },
  { label: 'Square (1:1)', value: 1 },
  { label: 'Original', value: 0 },
];

const operationalDays = [
  { id: 'monday', label: 'Senin' },
  { id: 'tuesday', label: 'Selasa' },
  { id: 'wednesday', label: 'Rabu' },
  { id: 'thursday', label: 'Kamis' },
  { id: 'friday', label: 'Jumat' },
  { id: 'saturday', label: 'Sabtu' },
  { id: 'sunday', label: 'Minggu' },
];

export function WebsiteContentSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  
  const [openTime, setOpenTime] = useState(getSetting('operational_hours_open', '08:00'));
  const [closeTime, setCloseTime] = useState(getSetting('operational_hours_close', '22:00'));
  const [isOpen, setIsOpen] = useState(getSetting('operational_is_open', true));
  const [operationalDaysState, setOperationalDaysState] = useState(
    getSetting('operational_days', {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    })
  );
  const [atmosphereImages, setAtmosphereImages] = useState(getSetting('atmosphere_images', []));
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const handleDayChange = (dayId: string, checked: boolean) => {
    setOperationalDaysState(prev => ({
      ...prev,
      [dayId]: checked
    }));
  };

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
      
      // Auto-save when image is uploaded
      await updateSetting('atmosphere_images', newImages, 'content');
      toast.success('Gambar berhasil diunggah dan disimpan');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengunggah gambar');
    }
  };

  const handleImageRemove = async (index: number) => {
    const newImages = atmosphereImages.filter((_, i) => i !== index);
    setAtmosphereImages(newImages);
    
    // Auto-save when image is removed
    await updateSetting('atmosphere_images', newImages, 'content');
    toast.success('Gambar berhasil dihapus');
  };

  const handleImageEdit = async (index: number, editedBlob: Blob) => {
    try {
      const fileName = `atmosphere-edited-${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('cafe-assets')
        .upload(fileName, editedBlob);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('cafe-assets')
        .getPublicUrl(fileName);

      const newImages = [...atmosphereImages];
      newImages[index] = publicUrlData.publicUrl;
      setAtmosphereImages(newImages);
      
      // Auto-save the updated images
      await updateSetting('atmosphere_images', newImages, 'content');
      toast.success('Gambar berhasil diedit dan disimpan');
    } catch (error) {
      console.error('Error saving edited image:', error);
      toast.error('Gagal menyimpan gambar yang sudah diedit');
    }
  };

  const handleSave = async () => {
    const success = await Promise.all([
      updateSetting('operational_hours_open', openTime, 'operations'),
      updateSetting('operational_hours_close', closeTime, 'operations'),
      updateSetting('operational_is_open', isOpen, 'operations'),
      updateSetting('operational_days', operationalDaysState, 'operations'),
      updateSetting('atmosphere_images', atmosphereImages, 'content')
    ]);

    if (success.every(Boolean)) {
      toast.success('Konten website berhasil disimpan');
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('settings-updated'));
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
            <Checkbox
              id="is-open"
              checked={isOpen}
              onCheckedChange={(checked) => setIsOpen(checked as boolean)}
            />
            <Label htmlFor="is-open">Cafe sedang buka</Label>
          </div>

          {/* Operational Days */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Hari Operasional</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {operationalDays.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    checked={operationalDaysState[day.id as keyof typeof operationalDaysState]}
                    onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                  />
                  <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                </div>
              ))}
            </div>
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

        {/* Atmosphere Images with Editor */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-5 w-5" />
            <Label className="text-base font-medium">Gambar Suasana Cafe</Label>
          </div>
          
          {/* Current Images */}
          {atmosphereImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {atmosphereImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Suasana ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setEditingImageIndex(index)}
                    title="Edit Gambar"
                  >
                    <Edit className="h-3 w-3" />
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
            editorConfig={{
              aspectRatios: atmosphereAspectRatios,
              maxWidth: 600,
              maxHeight: 400
            }}
          />
          
          <p className="text-sm text-gray-500">
            Gambar akan otomatis disimpan setelah diunggah. Klik tombol edit (✏️) pada gambar untuk mengubah ukuran, memutar, atau memotong gambar.
          </p>
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

      {/* Image Editor for Atmosphere Images */}
      {editingImageIndex !== null && (
        <ImageEditor
          imageUrl={atmosphereImages[editingImageIndex]}
          isOpen={editingImageIndex !== null}
          onClose={() => setEditingImageIndex(null)}
          onSave={(blob) => {
            handleImageEdit(editingImageIndex, blob);
            setEditingImageIndex(null);
          }}
          aspectRatios={atmosphereAspectRatios}
          maxWidth={600}
          maxHeight={400}
        />
      )}
    </Card>
  );
}
