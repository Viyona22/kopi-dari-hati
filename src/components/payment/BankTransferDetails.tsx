
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface BankTransferDetailsProps {
  bankAccount: {
    bank?: string;
    account_number?: string;
    account_name?: string;
  };
}

export function BankTransferDetails({ bankAccount }: BankTransferDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Transfer ke rekening berikut:
      </p>
      <div className="space-y-2">
        {bankAccount.bank && (
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Bank:</span>
            <span className="text-sm">{bankAccount.bank}</span>
          </div>
        )}
        {bankAccount.account_number && (
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">No. Rekening:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{bankAccount.account_number}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(bankAccount.account_number!, 'Nomor rekening')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {bankAccount.account_name && (
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Atas Nama:</span>
            <span className="text-sm">{bankAccount.account_name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
