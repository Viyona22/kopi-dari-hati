
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Instagram, Facebook, Save } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

export function ContactInfoSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  
  const [contactEmail, setContactEmail] = useState(getSetting('contact_email', 'admin@kopidarhati.com'));
  const [contactWhatsapp, setContactWhatsapp] = useState(getSetting('contact_whatsapp', '+62812345678'));
  const [contactInstagram, setContactInstagram] = useState(getSetting('contact_instagram', '@kopidarhati'));
  const [contactFacebook, setContactFacebook] = useState(getSetting('contact_facebook', 'Kopi dari Hati Bangka'));

  const handleSave = async () => {
    const success = await Promise.all([
      updateSetting('contact_email', contactEmail, 'contact'),
      updateSetting('contact_whatsapp', contactWhatsapp, 'contact'),
      updateSetting('contact_instagram', contactInstagram, 'contact'),
      updateSetting('contact_facebook', contactFacebook, 'contact')
    ]);

    if (success.every(Boolean)) {
      toast.success('Informasi kontak berhasil disimpan');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Informasi Kontak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Kontak
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="admin@kopidarhati.com"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="contact-whatsapp" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Nomor WhatsApp
            </Label>
            <Input
              id="contact-whatsapp"
              value={contactWhatsapp}
              onChange={(e) => setContactWhatsapp(e.target.value)}
              placeholder="+62812345678"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="contact-instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
            <Input
              id="contact-instagram"
              value={contactInstagram}
              onChange={(e) => setContactInstagram(e.target.value)}
              placeholder="@kopidarhati"
            />
          </div>

          {/* Facebook */}
          <div className="space-y-2">
            <Label htmlFor="contact-facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </Label>
            <Input
              id="contact-facebook"
              value={contactFacebook}
              onChange={(e) => setContactFacebook(e.target.value)}
              placeholder="Kopi dari Hati Bangka"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updating}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updating ? 'Menyimpan...' : 'Simpan Kontak'}
        </Button>
      </CardContent>
    </Card>
  );
}
