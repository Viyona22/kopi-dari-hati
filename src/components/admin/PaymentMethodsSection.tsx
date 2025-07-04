
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Save, QrCode, Building, Smartphone } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

export function PaymentMethodsSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  
  // QRIS Settings
  const [qrisEnabled, setQrisEnabled] = useState(getSetting('payment_qris_enabled', true));
  const [qrisValue, setQrisValue] = useState(getSetting('payment_qris_value', ''));
  
  // Bank Transfer Settings
  const [bankEnabled, setBankEnabled] = useState(getSetting('payment_bank_enabled', true));
  const [bankAccount, setBankAccount] = useState(getSetting('payment_bank_account', {
    bank: 'BCA',
    account_number: '',
    account_name: ''
  }));
  
  // E-wallet Settings
  const [ewalletEnabled, setEwalletEnabled] = useState(getSetting('payment_ewallet_enabled', false));
  const [ewalletOptions, setEwalletOptions] = useState(getSetting('payment_ewallet_options', {
    gopay: false,
    ovo: false,
    dana: false
  }));

  const handleSave = async () => {
    const success = await Promise.all([
      updateSetting('payment_qris_enabled', qrisEnabled, 'payment'),
      updateSetting('payment_qris_value', qrisValue, 'payment'),
      updateSetting('payment_bank_enabled', bankEnabled, 'payment'),
      updateSetting('payment_bank_account', bankAccount, 'payment'),
      updateSetting('payment_ewallet_enabled', ewalletEnabled, 'payment'),
      updateSetting('payment_ewallet_options', ewalletOptions, 'payment')
    ]);

    if (success.every(Boolean)) {
      toast.success('Pengaturan metode pembayaran berhasil disimpan');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Manajemen Metode Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* QRIS Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              <Label htmlFor="qris-enabled" className="text-base font-medium">QRIS</Label>
              <Badge variant={qrisEnabled ? "default" : "secondary"}>
                {qrisEnabled ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <Switch
              id="qris-enabled"
              checked={qrisEnabled}
              onCheckedChange={setQrisEnabled}
            />
          </div>
          
          {qrisEnabled && (
            <div className="space-y-2">
              <Label htmlFor="qris-value">Link atau Kode QRIS</Label>
              <Textarea
                id="qris-value"
                value={qrisValue}
                onChange={(e) => setQrisValue(e.target.value)}
                placeholder="Masukkan link QRIS atau kode QRIS"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Bank Transfer Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <Label htmlFor="bank-enabled" className="text-base font-medium">Transfer Bank</Label>
              <Badge variant={bankEnabled ? "default" : "secondary"}>
                {bankEnabled ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <Switch
              id="bank-enabled"
              checked={bankEnabled}
              onCheckedChange={setBankEnabled}
            />
          </div>
          
          {bankEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Nama Bank</Label>
                <Input
                  id="bank-name"
                  value={bankAccount.bank}
                  onChange={(e) => setBankAccount({...bankAccount, bank: e.target.value})}
                  placeholder="Contoh: BCA, Mandiri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Nomor Rekening</Label>
                <Input
                  id="account-number"
                  value={bankAccount.account_number}
                  onChange={(e) => setBankAccount({...bankAccount, account_number: e.target.value})}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-name">Nama Pemegang</Label>
                <Input
                  id="account-name"
                  value={bankAccount.account_name}
                  onChange={(e) => setBankAccount({...bankAccount, account_name: e.target.value})}
                  placeholder="Nama sesuai rekening"
                />
              </div>
            </div>
          )}
        </div>

        {/* E-wallet Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <Label htmlFor="ewallet-enabled" className="text-base font-medium">E-Wallet</Label>
              <Badge variant={ewalletEnabled ? "default" : "secondary"}>
                {ewalletEnabled ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <Switch
              id="ewallet-enabled"
              checked={ewalletEnabled}
              onCheckedChange={setEwalletEnabled}
            />
          </div>
          
          {ewalletEnabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="gopay">GoPay</Label>
                <Switch
                  id="gopay"
                  checked={ewalletOptions.gopay}
                  onCheckedChange={(checked) => setEwalletOptions({...ewalletOptions, gopay: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ovo">OVO</Label>
                <Switch
                  id="ovo"
                  checked={ewalletOptions.ovo}
                  onCheckedChange={(checked) => setEwalletOptions({...ewalletOptions, ovo: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dana">DANA</Label>
                <Switch
                  id="dana"
                  checked={ewalletOptions.dana}
                  onCheckedChange={(checked) => setEwalletOptions({...ewalletOptions, dana: checked})}
                />
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updating}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updating ? 'Menyimpan...' : 'Simpan Metode Pembayaran'}
        </Button>
      </CardContent>
    </Card>
  );
}
