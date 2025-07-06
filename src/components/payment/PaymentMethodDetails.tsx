
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRISDetails } from './QRISDetails';
import { BankTransferDetails } from './BankTransferDetails';
import { EWalletDetails } from './EWalletDetails';
import { PAYMENT_METHODS } from './PaymentConstants';

interface PaymentMethodDetailsProps {
  selectedMethod: string;
  paymentMethods: any;
}

export function PaymentMethodDetails({ selectedMethod, paymentMethods }: PaymentMethodDetailsProps) {
  if (!selectedMethod) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detail Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* QRIS Details */}
        {selectedMethod === PAYMENT_METHODS.QRIS && paymentMethods?.qris?.value && (
          <QRISDetails qrisValue={paymentMethods.qris.value} />
        )}

        {/* Bank Transfer Details */}
        {selectedMethod === PAYMENT_METHODS.BANK_TRANSFER && paymentMethods?.bank?.account && (
          <BankTransferDetails bankAccount={paymentMethods.bank.account} />
        )}

        {/* E-wallet Details */}
        {selectedMethod === PAYMENT_METHODS.EWALLET && (
          <EWalletDetails 
            ewalletOptions={paymentMethods?.ewallet?.options || {}}
            ewalletContacts={paymentMethods?.ewallet?.contacts || {}}
          />
        )}
      </CardContent>
    </Card>
  );
}
