
import React from 'react';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentMethodDetails } from './PaymentMethodDetails';

interface PaymentMethodDisplayProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  availableMethods?: string[];
}

export function PaymentMethodDisplay({ selectedMethod, onMethodChange, availableMethods }: PaymentMethodDisplayProps) {
  const { paymentMethods, loading } = useCafeSettings();

  console.log('PaymentMethodDisplay - Payment methods data:', paymentMethods);
  console.log('PaymentMethodDisplay - Loading state:', loading);
  console.log('PaymentMethodDisplay - Selected method:', selectedMethod);
  console.log('PaymentMethodDisplay - Available methods from parent:', availableMethods);

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Memuat metode pembayaran...</p>
      </div>
    );
  }

  // Use availableMethods prop if provided, otherwise determine from settings
  const methodsToShow = availableMethods || [];

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={onMethodChange}
        methodsToShow={methodsToShow}
        paymentMethods={paymentMethods}
      />

      {/* Payment Details */}
      <PaymentMethodDetails
        selectedMethod={selectedMethod}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
