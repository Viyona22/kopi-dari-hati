import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Save, QrCode, Building, Smartphone } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

export function PaymentMethodsSection() {
  const { getSetting, updateSetting, updating } = useAppSettings();
  
  // QRIS Settings with better default value
  const [qrisEnabled, setQrisEnabled] = useState(getSetting('payment_qris_enabled', true));
  const [qrisValue, setQrisValue] = useState(getSetting('payment_qris_value', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345'));
  
  // Bank Transfer Settings
  const [bankEnabled, setBankEnabled] = useState(getSetting('payment_bank_enabled', true));
  const [bankAccount, setBankAccount] = useState(getSetting('payment_bank_account', {
    bank: 'BCA',
    account_number: '1234567890',
    account_name: 'Kopi dari Hati'
  }));
  
  // E-wallet Settings
  const [ewalletEnabled, setEwalletEnabled] = useState(getSetting('payment_ewallet_enabled', false));
  const [ewalletOptions, setEwalletOptions] = useState(getSetting('payment_ewallet_options', {
    gopay: false,
    ovo: false,
    dana: false
  }));
  const [ewalletContacts, setEwalletContacts] = useState(getSetting('payment_ewallet_contacts', {
    gopay: '',
    ovo: '',
    dana: ''
  }));

  // Update state when settings change
  useEffect(() => {
    setQrisEnabled(getSetting('payment_qris_enabled', true));
    setQrisValue(getSetting('payment_qris_value', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345'));
    setBankEnabled(getSetting('payment_bank_enabled', true));
    setBankAccount(getSetting('payment_bank_account', {
      bank: 'BCA',
      account_number: '1234567890',
      account_name: 'Kopi dari Hati'
    }));
    setEwalletEnabled(getSetting('payment_ewallet_enabled', false));
    setEwalletOptions(getSetting('payment_ewallet_options', {
      gopay: false,
      ovo: false,
      dana: false
    }));
    setEwalletContacts(getSetting('payment_ewallet_contacts', {
      gopay: '',
      ovo: '',
      dana: ''
    }));
  }, [getSetting]);

  const handleSave = async () => {
    // Validation: QRIS value cannot be empty if QRIS is enabled
    if (qrisEnabled && !qrisValue.trim()) {
      toast.error('QRIS value tidak boleh kosong jika QRIS diaktifkan');
      return;
    }

    // Validation: E-wallet contacts must be filled if e-wallet options are enabled
    if (ewalletEnabled) {
      const enabledWallets = Object.entries(ewalletOptions).filter(([_, enabled]) => enabled);
      const missingContacts = enabledWallets.filter(([wallet, _]) => !ewalletContacts[wallet]?.trim());
      
      if (missingContacts.length > 0) {
        toast.error(`Nomor kontak wajib diisi untuk: ${missingContacts.map(([wallet]) => wallet.toUpperCase()).join(', ')}`);
        return;
      }
    }

    console.log('Saving payment methods:', {
      qrisEnabled,
      qrisValue,
      bankEnabled,
      bankAccount,
      ewalletEnabled,
      ewalletOptions,
      ewalletContacts
    });

    const success = await Promise.all([
      updateSetting('payment_qris_enabled', qrisEnabled, 'payment'),
      updateSetting('payment_qris_value', qrisValue, 'payment'),
      updateSetting('payment_bank_enabled', bankEnabled, 'payment'),
      updateSetting('payment_bank_account', bankAccount, 'payment'),
      updateSetting('payment_ewallet_enabled', ewalletEnabled, 'payment'),
      updateSetting('payment_ewallet_options', ewalletOptions, 'payment'),
      updateSetting('payment_ewallet_contacts', ewalletContacts, 'payment')
    ]);

    if (success.every(Boolean)) {
      toast.success('Pengaturan metode pembayaran berhasil disimpan');
      window.dispatchEvent(new CustomEvent('settings-updated'));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('storage', { detail: 'payment-methods-updated' }));
      }, 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qris-value">Link atau Kode QRIS *</Label>
                <Textarea
                  id="qris-value"
                  value={qrisValue}
                  onChange={(e) => setQrisValue(e.target.value)}
                  placeholder="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345"
                  rows={2}
                  className={!qrisValue.trim() ? 'border-red-300' : ''}
                />
                {!qrisValue.trim() && (
                  <p className="text-sm text-red-600">QRIS value wajib diisi</p>
                )}
              </div>
              
              {/* QR Code Preview */}
              {qrisValue && (
                <div className="space-y-2">
                  <Label>Preview QR Code:</Label>
                  <div className="flex justify-center p-4 bg-white border rounded-lg">
                    <QRCode 
                      value={qrisValue} 
                      size={150}
                      level="M"
                      title="QRIS Preview"
                    />
                  </div>
                </div>
              )}
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
                  value={bankAccount.bank || ''}
                  onChange={(e) => setBankAccount({...bankAccount, bank: e.target.value})}
                  placeholder="Contoh: BCA, Mandiri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Nomor Rekening</Label>
                <Input
                  id="account-number"
                  value={bankAccount.account_number || ''}
                  onChange={(e) => setBankAccount({...bankAccount, account_number: e.target.value})}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-name">Nama Pemegang</Label>
                <Input
                  id="account-name"
                  value={bankAccount.account_name || ''}
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
            <div className="space-y-4">
              {(['gopay', 'ovo', 'dana'] as const).map((wallet) => (
                <div key={wallet} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={wallet} className="text-base font-medium capitalize">{wallet.toUpperCase()}</Label>
                    <Switch
                      id={wallet}
                      checked={ewalletOptions[wallet] || false}
                      onCheckedChange={(checked) => {
                        console.log(`Setting ${wallet} to ${checked}`);
                        setEwalletOptions({...ewalletOptions, [wallet]: checked});
                      }}
                    />
                  </div>
                  {ewalletOptions[wallet] && (
                    <div className="space-y-2">
                      <Label htmlFor={`${wallet}-contact`}>Nomor {wallet.toUpperCase()} *</Label>
                      <Input
                        id={`${wallet}-contact`}
                        value={ewalletContacts[wallet] || ''}
                        onChange={(e) => {
                          console.log(`Setting ${wallet} contact to ${e.target.value}`);
                          setEwalletContacts({...ewalletContacts, [wallet]: e.target.value});
                        }}
                        placeholder={`Masukkan nomor ${wallet.toUpperCase()}`}
                        className={ewalletOptions[wallet] && !ewalletContacts[wallet]?.trim() ? 'border-red-300' : ''}
                      />
                      {ewalletOptions[wallet] && !ewalletContacts[wallet]?.trim() && (
                        <p className="text-sm text-red-600">Nomor kontak wajib diisi</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
