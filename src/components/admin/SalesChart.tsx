
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function SalesChart() {
  const { purchases } = usePurchaseData();
  const [period, setPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('line');

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getSalesData = () => {
    if (!purchases.length) return [];

    const now = new Date();
    let startDate = new Date();
    let dateFormat: string;
    let groupBy: string;

    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - 7);
        dateFormat = 'DD/MM';
        groupBy = 'day';
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 28);
        dateFormat = 'DD/MM';
        groupBy = 'week';
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 6);
        dateFormat = 'MM/YYYY';
        groupBy = 'month';
        break;
      default:
        startDate.setDate(now.getDate() - 28);
        dateFormat = 'DD/MM';
        groupBy = 'week';
    }

    const filteredPurchases = purchases.filter(purchase => {
      if (!purchase.created_at) return false;
      const purchaseDate = new Date(purchase.created_at);
      return purchaseDate >= startDate && purchase.status === 'Selesai';
    });

    const groupedData: { [key: string]: number } = {};

    filteredPurchases.forEach(purchase => {
      const date = new Date(purchase.created_at!);
      let key: string;

      if (groupBy === 'day') {
        key = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        key = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      }

      groupedData[key] = (groupedData[key] || 0) + purchase.total_amount;
    });

    return Object.entries(groupedData)
      .map(([date, total]) => ({
        date,
        total,
        formattedTotal: formatCurrency(total)
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });
  };

  const salesData = getSalesData();

  const chartConfig = {
    total: {
      label: "Penjualan",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grafik Performa Penjualan</CardTitle>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {salesData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada data penjualan untuk periode ini
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-80">
            {chartType === 'line' ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--color-total)" 
                  strokeWidth={2}
                  name="Penjualan"
                />
              </LineChart>
            ) : (
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar 
                  dataKey="total" 
                  fill="var(--color-total)" 
                  name="Penjualan"
                />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
