
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface EWalletDetailsProps {
  ewalletOptions: Record<string, boolean>;
  ewalletContacts: Record<string, string>;
}

export function EWalletDetails({ ewalletOptions, ewalletContacts }: EWalletDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const enabledWallets = Object.entries(ewalletOptions || {})
    .filter(([_, enabled]) => enabled);

  if (enabledWallets.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        Belum ada e-wallet yang diaktifkan
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Metode e-wallet yang tersedia:
      </p>
      <div className="grid gap-2">
        {enabledWallets.map(([wallet, _]) => {
          const contactNumber = ewalletContacts?.[wallet] || '';
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
              {contactNumber ? (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Nomor: </span>
                  <span className="font-mono">{contactNumber}</span>
                </div>
              ) : (
                <div className="text-sm text-yellow-600">
                  Nomor kontak belum diatur
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
