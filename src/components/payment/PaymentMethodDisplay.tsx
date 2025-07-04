
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Building, Smartphone, Copy, CreditCard } from 'lucide-react';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { toast } from 'sonner';

interface PaymentMethodDisplayProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export function PaymentMethodDisplay({ selectedMethod, onMethodChange }: PaymentMethodDisplayProps) {
  const { paymentMethods, loading } = useCafeSettings();

  console.log('PaymentMethodDisplay - Payment methods data:', paymentMethods);
  console.log('PaymentMethodDisplay - Loading state:', loading);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const availableMethods = [];

  // Add COD as always available
  availableMethods.push({
    id: 'cod',
    title: 'Cash on Delivery (COD)',
    icon: CreditCard,
    description: 'Bayar saat pesanan diterima'
  });

  // Add QRIS if enabled and has value
  if (paymentMethods.qris.enabled && paymentMethods.qris.value) {
    console.log('Adding QRIS method:', paymentMethods.qris);
    availableMethods.push({
      id: 'qris',
      title: 'QRIS',
      icon: QrCode,
      description: 'Scan QR Code untuk pembayaran'
    });
  }

  // Add Bank Transfer if enabled and has account details
  if (paymentMethods.bank.enabled && paymentMethods.bank.account) {
    console.log('Adding Bank Transfer method:', paymentMethods.bank);
    availableMethods.push({
      id: 'bank_transfer',
      title: 'Transfer Bank',
      icon: Building,
      description: 'Transfer ke rekening bank'
    });
  }

  // Add E-wallet if enabled and has enabled options
  if (paymentMethods.ewallet.enabled) {
    console.log('E-wallet settings:', paymentMethods.ewallet);
    const enabledWallets = Object.entries(paymentMethods.ewallet.options)
      .filter(([_, enabled]) => enabled);
    
    console.log('Enabled wallets:', enabledWallets);
    
    if (enabledWallets.length > 0) {
      availableMethods.push({
        id: 'ewallet',
        title: 'E-Wallet',
        icon: Smartphone,
        description: `${enabledWallets.map(([wallet, _]) => wallet.toUpperCase()).join(', ')}`
      });
    }
  }

  console.log('Available payment methods:', availableMethods);

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Memuat metode pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <div className="grid gap-3">
        {availableMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-[#d4462d] bg-red-50' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <CardContent className="flex items-center space-x-3 p-4">
                <Icon className="h-5 w-5 text-[#d4462d]" />
                <div className="flex-1">
                  <h4 className="font-medium">{method.title}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === method.id 
                    ? 'border-[#d4462d] bg-[#d4462d]' 
                    : 'border-gray-300'
                }`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availableMethods.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Belum ada metode pembayaran yang diaktifkan. Silakan hubungi admin.
          </p>
        </div>
      )}

      {/* Payment Details */}
      {selectedMethod && selectedMethod !== 'cod' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detail Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* QRIS Details */}
            {selectedMethod === 'qris' && paymentMethods.qris.value && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Scan QR Code di bawah atau gunakan link QRIS:
                </p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono break-all">
                      {paymentMethods.qris.value}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(paymentMethods.qris.value, 'Link QRIS')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {selectedMethod === 'bank_transfer' && paymentMethods.bank.account && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Transfer ke rekening berikut:
                </p>
                <div className="space-y-2">
                  {paymentMethods.bank.account.bank && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Bank:</span>
                      <span className="text-sm">{paymentMethods.bank.account.bank}</span>
                    </div>
                  )}
                  {paymentMethods.bank.account.account_number && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">No. Rekening:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{paymentMethods.bank.account.account_number}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(paymentMethods.bank.account.account_number, 'Nomor rekening')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {paymentMethods.bank.account.account_name && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Atas Nama:</span>
                      <span className="text-sm">{paymentMethods.bank.account.account_name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* E-wallet Details */}
            {selectedMethod === 'ewallet' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Metode e-wallet yang tersedia:
                </p>
                <div className="grid gap-2">
                  {Object.entries(paymentMethods.ewallet.options)
                    .filter(([_, enabled]) => enabled)
                    .map(([wallet, _]) => {
                      const contactNumber = paymentMethods.ewallet.contacts?.[wallet] || '';
                      console.log(`E-wallet ${wallet}:`, { enabled: true, contact: contactNumber });
                      return (
                        <div key={wallet} className="p-3 bg-gray-50 rounded space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{wallet.toUpperCase()}</span>
                            {contactNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(contactNumber, `Nomor ${wallet.toUpperCase()}`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {contactNumber && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Nomor: </span>
                              <span className="font-mono">{contactNumber}</span>
                            </div>
                          )}
                          {!contactNumber && (
                            <div className="text-sm text-yellow-600">
                              Nomor kontak belum diatur
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                {!Object.entries(paymentMethods.ewallet.options).some(([_, enabled]) => enabled) && (
                  <p className="text-xs text-gray-500">
                    Belum ada e-wallet yang diaktifkan
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMethod === 'cod' && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              Pembayaran akan dilakukan saat pesanan diterima. Pastikan Anda menyiapkan uang tunai sesuai dengan total pesanan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
