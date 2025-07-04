
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentMethodDisplay } from './PaymentMethodDisplay';
import { Edit2 } from 'lucide-react';

interface PaymentMethodChangeModalProps {
  currentPaymentMethod: string;
  onPaymentMethodChange: (newMethod: string) => Promise<void>;
  disabled?: boolean;
}

export function PaymentMethodChangeModal({ 
  currentPaymentMethod, 
  onPaymentMethodChange,
  disabled = false 
}: PaymentMethodChangeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(currentPaymentMethod);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (selectedMethod === currentPaymentMethod) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onPaymentMethodChange(selectedMethod);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating payment method:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setSelectedMethod(currentPaymentMethod);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Edit2 className="h-4 w-4" />
          Ubah Metode Pembayaran
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ubah Metode Pembayaran</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pilih metode pembayaran baru untuk pesanan Anda:
          </p>
          
          <PaymentMethodDisplay
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-[#d4462d] hover:bg-[#b33a25]"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
