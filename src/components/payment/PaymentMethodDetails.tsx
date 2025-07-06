
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
  console.log('PaymentMethodDetails - Selected method:', selectedMethod);
  console.log('PaymentMethodDetails - Payment methods:', paymentMethods);
  console.log('PaymentMethodDetails - QRIS value check:', paymentMethods?.qris?.value);
  
  if (!selectedMethod) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detail Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* QRIS Details */}
        {selectedMethod === PAYMENT_METHODS.QRIS && (
          <div>
            {paymentMethods?.qris?.value ? (
              <QRISDetails qrisValue={paymentMethods.qris.value} />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  QRIS belum dikonfigurasi oleh admin. Silakan hubungi admin untuk mengaktifkan QRIS.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Debug: qrisValue = {JSON.stringify(paymentMethods?.qris)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bank Transfer Details */}
        {selectedMethod === PAYMENT_METHODS.BANK_TRANSFER && (
          <div>
            {paymentMethods?.bank?.account ? (
              <BankTransferDetails bankAccount={paymentMethods.bank.account} />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Transfer bank belum dikonfigurasi oleh admin. Silakan hubungi admin untuk mengaktifkan transfer bank.
                </p>
              </div>
            )}
          </div>
        )}

        {/* E-wallet Details */}
        {selectedMethod === PAYMENT_METHODS.EWALLET && (
          <div>
            {paymentMethods?.ewallet?.options && Object.values(paymentMethods.ewallet.options).some(enabled => enabled) ? (
              <EWalletDetails 
                ewalletOptions={paymentMethods.ewallet.options || {}}
                ewalletContacts={paymentMethods.ewallet.contacts || {}}
              />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  E-wallet belum dikonfigurasi oleh admin. Silakan hubungi admin untuk mengaktifkan e-wallet.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
