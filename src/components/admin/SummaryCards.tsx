
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Users, TrendingUp } from 'lucide-react';

export function SummaryCards() {
  const cards = [
    {
      title: "Reservasi Hari Ini",
      value: "8",
      icon: Calendar,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Transaksi Hari Ini",
      value: "Rp 750.000",
      icon: CreditCard,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Pelanggan",
      value: "120",
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Pendapatan Bulanan",
      value: "Rp 18.500.000",
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
