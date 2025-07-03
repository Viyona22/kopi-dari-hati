
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeSVG from 'react-qr-code';
import { CreditCard, Smartphone, Building } from 'lucide-react';

interface PaymentMethodDisplayProps {
  paymentMethod: string;
}

export function PaymentMethodDisplay({ paymentMethod }: PaymentMethodDisplayProps) {
  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'qris':
        return {
          title: 'Pembayaran QRIS',
          icon: <Smartphone className="w-5 h-5" />,
          content: (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCodeSVG 
                  value="00020101021226280010A000000152043211000694050100519500539760054045000620705N/A6304A7B3"
                  size={200}
                  level="M"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Langkah Pembayaran:</p>
                <ol className="text-left space-y-1">
                  <li>1. Buka aplikasi e-wallet atau mobile banking</li>
                  <li>2. Pilih menu QRIS/Scan QR</li>
                  <li>3. Scan QR Code di atas</li>
                  <li>4. Masukkan nominal sesuai total tagihan</li>
                  <li>5. Konfirmasi pembayaran</li>
                  <li>6. Screenshot bukti pembayaran</li>
                </ol>
              </div>
            </div>
          )
        };
      case 'transfer':
        return {
          title: 'Transfer Bank',
          icon: <Building className="w-5 h-5" />,
          content: (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Detail Rekening:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span className="font-medium">BCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. Rekening:</span>
                    <span className="font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atas Nama:</span>
                    <span className="font-medium">Kopi dari Hati Bangka</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Langkah Pembayaran:</p>
                <ol className="space-y-1">
                  <li>1. Transfer ke rekening di atas</li>
                  <li>2. Masukkan nominal sesuai total tagihan</li>
                  <li>3. Simpan bukti transfer</li>
                  <li>4. Upload bukti transfer di bawah ini</li>
                </ol>
              </div>
            </div>
          )
        };
      default:
        return {
          title: 'Cash on Delivery',
          icon: <CreditCard className="w-5 h-5" />,
          content: (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Anda akan membayar tunai saat pesanan diantar.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Siapkan uang pas sesuai total tagihan untuk memudahkan proses pembayaran.
                </p>
              </div>
            </div>
          )
        };
    }
  };

  const paymentDetails = getPaymentDetails();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#d4462d] flex items-center gap-2">
          {paymentDetails.icon}
          {paymentDetails.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentDetails.content}
      </CardContent>
    </Card>
  );
}
