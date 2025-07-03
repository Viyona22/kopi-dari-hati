
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';

interface PaymentTimerProps {
  deadline: string;
}

export function PaymentTimer({ deadline }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setIsExpired(false);
      } else {
        setTimeLeft('00:00:00');
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <Card className={`${isExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <Clock className="w-5 h-5 text-orange-500" />
            )}
            <span className={`font-medium ${isExpired ? 'text-red-700' : 'text-orange-700'}`}>
              {isExpired ? 'Waktu Pembayaran Habis' : 'Batas Waktu Pembayaran'}
            </span>
          </div>
          <div className={`text-xl font-bold ${isExpired ? 'text-red-700' : 'text-orange-700'}`}>
            {timeLeft}
          </div>
        </div>
        {isExpired && (
          <p className="text-sm text-red-600 mt-2">
            Silakan hubungi admin untuk perpanjangan waktu pembayaran.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
