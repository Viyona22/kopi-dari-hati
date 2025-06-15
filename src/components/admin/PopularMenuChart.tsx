
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function PopularMenuChart() {
  const { purchases } = usePurchaseData();

  const getMenuData = () => {
    if (!purchases.length) return [];

    const menuCount: { [key: string]: { count: number; revenue: number } } = {};

    purchases
      .filter(purchase => purchase.status === 'Selesai')
      .forEach(purchase => {
        if (Array.isArray(purchase.order_items)) {
          purchase.order_items.forEach((item: any) => {
            const menuName = item.name || 'Unknown Item';
            const quantity = item.quantity || 1;
            const price = item.price || 0;

            if (!menuCount[menuName]) {
              menuCount[menuName] = { count: 0, revenue: 0 };
            }
            menuCount[menuName].count += quantity;
            menuCount[menuName].revenue += price * quantity;
          });
        }
      });

    return Object.entries(menuCount)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
        percentage: 0 // Will be calculated after sorting
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 menu items
      .map((item, index, array) => {
        const totalCount = array.reduce((sum, i) => sum + i.count, 0);
        return {
          ...item,
          percentage: Math.round((item.count / totalCount) * 100)
        };
      });
  };

  const menuData = getMenuData();

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Terjual: {data.count} porsi</p>
          <p className="text-green-600">Pendapatan: {formatCurrency(data.revenue)}</p>
          <p className="text-gray-600">Persentase: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const chartConfig = {
    count: {
      label: "Jumlah Terjual",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Populer</CardTitle>
      </CardHeader>
      <CardContent>
        {menuData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada data penjualan menu
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={menuData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {menuData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ChartContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {menuData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1">{item.name}</span>
                  <span className="font-medium">{item.count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
