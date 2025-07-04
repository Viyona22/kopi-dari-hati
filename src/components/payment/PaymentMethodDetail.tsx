
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Building, Smartphone, Copy } from 'lucide-react';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { toast } from 'sonner';

interface PaymentMethodDetailProps {
  paymentMethod: string;
}

export function PaymentMethodDetail({ paymentMethod }: PaymentMethodDetailProps) {
  const { paymentMethods } = useCafeSettings();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const getMethodInfo = () => {
    switch (paymentMethod) {
      case 'qris':
        return {
          title: 'QRIS',
          icon: QrCode,
          description: 'Scan QR Code untuk pembayaran'
        };
      case 'bank_transfer':
        return {
          title: 'Transfer Bank',
          icon: Building,
          description: 'Transfer ke rekening bank'
        };
      case 'ewallet':
        return {
          title: 'E-Wallet',
          icon: Smartphone,
          description: 'Pembayaran melalui e-wallet'
        };
      default:
        return {
          title: 'Metode Pembayaran',
          icon: QrCode,
          description: 'Detail pembayaran'
        };
    }
  };

  const methodInfo = getMethodInfo();
  const Icon = methodInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#d4462d] flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {methodInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{methodInfo.description}</p>
        
        {/* QRIS Details */}
        {paymentMethod === 'qris' && paymentMethods.qris.enabled && paymentMethods.qris.value && (
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
        {paymentMethod === 'bank_transfer' && paymentMethods.bank.enabled && paymentMethods.bank.account && (
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
        {paymentMethod === 'ewallet' && paymentMethods.ewallet.enabled && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Metode e-wallet yang tersedia:
            </p>
            <div className="grid gap-2">
              {Object.entries(paymentMethods.ewallet.options)
                .filter(([_, enabled]) => enabled)
                .map(([wallet, _]) => {
                  const contactNumber = paymentMethods.ewallet.contacts?.[wallet] || '';
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
  );
}
