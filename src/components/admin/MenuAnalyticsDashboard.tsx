
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { useMenuAnalytics } from '@/hooks/useMenuAnalytics';
import { useMenuData } from '@/hooks/useMenuData';

export function MenuAnalyticsDashboard() {
  const { analytics, loading: analyticsLoading } = useMenuAnalytics();
  const { menuItems, loading: menuLoading } = useMenuData();

  if (analyticsLoading || menuLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            Memuat analytics menu...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMenuName = (menuItemId: string) => {
    const menu = menuItems.find(item => item.id === menuItemId);
    return menu ? menu.name : 'Menu Tidak Ditemukan';
  };

  const getStockStatus = (menuItemId: string) => {
    const menu = menuItems.find(item => item.id === menuItemId);
    if (!menu) return { status: 'unknown', quantity: 0 };
    
    const quantity = menu.stock_quantity || 0;
    if (quantity === 0) return { status: 'out', quantity };
    if (quantity <= 5) return { status: 'low', quantity };
    return { status: 'good', quantity };
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'out':
        return <Badge variant="destructive">Habis</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Stok Rendah</Badge>;
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Tersedia</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const topFavorites = analytics
    .sort((a, b) => b.total_favorites - a.total_favorites)
    .slice(0, 5);

  const topRated = analytics
    .filter(item => item.total_reviews > 0)
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 5);

  const lowStockItems = menuItems
    .filter(item => (item.stock_quantity || 0) <= 5)
    .sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menu</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorit</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, item) => sum + item.total_favorites, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Review</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, item) => sum + item.total_reviews, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Top 5 Menu Favorit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topFavorites.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{getMenuName(item.menu_item_id)}</p>
                      <p className="text-sm text-gray-500">{item.total_favorites} favorit</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top 5 Menu Rating Tertinggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRated.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{getMenuName(item.menu_item_id)}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-500">
                          {item.average_rating.toFixed(1)} ({item.total_reviews} review)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Menu dengan Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => {
                const stockInfo = getStockStatus(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Tersisa {stockInfo.quantity} {stockInfo.quantity === 0 ? '(HABIS)' : 'porsi'}
                        </p>
                      </div>
                    </div>
                    {getStockBadge(stockInfo.status)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
