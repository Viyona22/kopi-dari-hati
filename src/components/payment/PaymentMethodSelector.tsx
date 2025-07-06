
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Building, Smartphone } from 'lucide-react';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from './PaymentConstants';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  methodsToShow: string[];
  paymentMethods: any;
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange, 
  methodsToShow, 
  paymentMethods 
}: PaymentMethodSelectorProps) {
  const getMethodOptions = () => {
    const options = [];

    if (methodsToShow.includes(PAYMENT_METHODS.QRIS)) {
      options.push({
        id: PAYMENT_METHODS.QRIS,
        title: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.QRIS],
        icon: QrCode,
        description: 'Scan QR Code untuk pembayaran'
      });
    }

    if (methodsToShow.includes(PAYMENT_METHODS.BANK_TRANSFER)) {
      options.push({
        id: PAYMENT_METHODS.BANK_TRANSFER,
        title: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BANK_TRANSFER],
        icon: Building,
        description: 'Transfer ke rekening bank'
      });
    }

    if (methodsToShow.includes(PAYMENT_METHODS.EWALLET)) {
      const enabledWallets = Object.entries(paymentMethods?.ewallet?.options || {})
        .filter(([_, enabled]) => enabled);
      
      options.push({
        id: PAYMENT_METHODS.EWALLET,
        title: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.EWALLET],
        icon: Smartphone,
        description: `${enabledWallets.map(([wallet, _]) => wallet.toUpperCase()).join(', ')}`
      });
    }

    return options;
  };

  const methodOptions = getMethodOptions();

  if (methodOptions.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Belum ada metode pembayaran yang tersedia. Silakan hubungi admin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {methodOptions.map((method) => {
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
  );
}
