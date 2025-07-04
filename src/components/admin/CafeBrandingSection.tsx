
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Building2, Save } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function CafeBrandingSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  const [cafeName, setCafeName] = useState(getSetting('cafe_name', 'Kopi dari Hati'));
  const [cafeTagline, setCafeTagline] = useState(getSetting('cafe_tagline', 'Kamu Obsesi Paling Indah dari Hati'));
  const [cafeDescription, setCafeDescription] = useState(getSetting('cafe_description', 'Pengalaman kopi dan camilan autentik dengan cita rasa Bangka yang tak terlupakan'));
  const [logoUrl, setLogoUrl] = useState(getSetting('cafe_logo', null));

  const handleLogoUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('cafe-assets')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('cafe-assets')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrlData.publicUrl);
      toast.success('Logo berhasil diunggah');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Gagal mengunggah logo');
    }
  };

  const handleLogoRemove = () => {
    setLogoUrl(null);
  };

  const handleSave = async () => {
    const success = await Promise.all([
      updateSetting('cafe_name', cafeName, 'branding'),
      updateSetting('cafe_tagline', cafeTagline, 'branding'),
      updateSetting('cafe_description', cafeDescription, 'branding'),
      updateSetting('cafe_logo', logoUrl, 'branding')
    ]);

    if (success.every(Boolean)) {
      toast.success('Informasi branding berhasil disimpan');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Branding & Identitas Cafe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo Cafe</Label>
          <ImageUpload
            currentImage={logoUrl}
            onImageChange={handleLogoUpload}
            onImageRemove={handleLogoRemove}
          />
        </div>

        {/* Cafe Name */}
        <div className="space-y-2">
          <Label htmlFor="cafe-name">Nama Cafe</Label>
          <Input
            id="cafe-name"
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            placeholder="Masukkan nama cafe"
          />
        </div>

        {/* Cafe Tagline */}
        <div className="space-y-2">
          <Label htmlFor="cafe-tagline">Tagline/Slogan</Label>
          <Input
            id="cafe-tagline"
            value={cafeTagline}
            onChange={(e) => setCafeTagline(e.target.value)}
            placeholder="Masukkan tagline cafe"
          />
        </div>

        {/* Cafe Description */}
        <div className="space-y-2">
          <Label htmlFor="cafe-description">Deskripsi Cafe</Label>
          <Textarea
            id="cafe-description"
            value={cafeDescription}
            onChange={(e) => setCafeDescription(e.target.value)}
            placeholder="Masukkan deskripsi cafe"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updating}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updating ? 'Menyimpan...' : 'Simpan Branding'}
        </Button>
      </CardContent>
    </Card>
  );
}
