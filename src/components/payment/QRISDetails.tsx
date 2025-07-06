
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Scan QR Code di bawah atau gunakan link QRIS:
      </p>
      
      {/* QR Code Visual */}
      <div className="flex justify-center p-4 bg-white border rounded-lg">
        <QRCode 
          value={qrisValue} 
          size={200}
          level="M"
        />
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono break-all">
            {qrisValue}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(qrisValue, 'Link QRIS')}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
