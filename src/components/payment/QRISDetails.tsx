
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

interface QRISDetailsProps {
  qrisValue: string;
}

export function QRISDetails({ qrisValue }: QRISDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  console.log('QRISDetails - QRIS Value:', qrisValue);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Scan QR Code di bawah atau gunakan link QRIS:
      </p>
      
      {/* QR Code Visual */}
      <div className="flex justify-center p-6 bg-white border rounded-lg shadow-sm">
        <div className="bg-white p-4 rounded-lg">
          <QRCode 
            value={qrisValue} 
            size={200}
            level="M"
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-mono break-all flex-1">
            {qrisValue}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(qrisValue, 'Link QRIS')}
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
