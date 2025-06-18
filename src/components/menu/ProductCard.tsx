
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MessageSquare, AlertTriangle, Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useFavoriteData } from '@/hooks/useFavoriteData';
import { useMenuAnalytics } from '@/hooks/useMenuAnalytics';
import { ReviewDialog } from '@/components/menu/ReviewDialog';
import { ReviewsList } from '@/components/menu/ReviewsList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ProductCardProps {
  item: MenuItem;
}

export function ProductCard({ item }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  // Get customer email from localStorage if available
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('customerEmail');
    if (savedEmail) {
      setCustomerEmail(savedEmail);
    }
  }, []);

  const { addToFavorites, removeFromFavorites, isFavorited } = useFavoriteData(customerEmail);
  const { analytics } = useMenuAnalytics();

  // Get analytics for this menu item
  const menuAnalytics = analytics.find(a => a.menu_item_id === item.id) || {
    total_favorites: 0,
    average_rating: 0,
    total_reviews: 0
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setQuantity(1);
    toast.success(`${item.name} ditambahkan ke keranjang!`);
  };

  const handleFavoriteClick = async () => {
    if (!customerEmail) {
      setShowEmailInput(true);
      return;
    }

    if (isFavorited(item.id)) {
      await removeFromFavorites(item.id, customerEmail);
    } else {
      await addToFavorites(item.id, customerEmail);
    }
  };

  const handleEmailSubmit = async () => {
    if (!customerEmail.includes('@')) {
      toast.error('Email tidak valid');
      return;
    }
    
    localStorage.setItem('customerEmail', customerEmail);
    setShowEmailInput(false);
    await addToFavorites(item.id, customerEmail);
  };

  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case 'terlaris':
        return 'bg-red-500 text-white';
      case 'baru':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const stockQuantity = item.stock_quantity || 0;
  const isLowStock = stockQuantity <= 5 && stockQuantity > 0;
  const isOutOfStock = stockQuantity === 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Badge overlay */}
      {item.badge_type && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className={getBadgeStyle(item.badge_type)}>
            {item.badge_type === 'terlaris' ? 'TERLARIS' : 'BARU'}
          </Badge>
        </div>
      )}

      {/* Featured indicator */}
      {item.is_featured && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-purple-500 text-white">
            UNGGULAN
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={item.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          
          {/* Favorite button */}
          <Button
            size="sm"
            variant="outline"
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorited(item.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400'
              }`} 
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            )}
          </div>

          {/* Rating and favorites */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {renderStars(menuAnalytics.average_rating)}
              <span className="text-gray-600 ml-1">
                {menuAnalytics.average_rating > 0 
                  ? `${menuAnalytics.average_rating.toFixed(1)} (${menuAnalytics.total_reviews})` 
                  : 'Belum ada rating'
                }
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Heart className="h-3 w-3" />
              <span>{menuAnalytics.total_favorites} favorit</span>
            </div>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Habis
              </Badge>
            ) : isLowStock ? (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Tersisa {stockQuantity} porsi!
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800">
                Tersedia ({stockQuantity} porsi)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#d4462d]">
              Rp {item.price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutOfStock || quantity >= stockQuantity}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-[#d4462d] hover:bg-[#b93e26]"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Habis' : 'Tambah ke Keranjang'}
            </Button>
          </div>

          {/* Reviews section */}
          <div className="flex gap-2">
            <ReviewDialog 
              menuItemId={item.id} 
              menuItemName={item.name}
            >
              <Button variant="outline" size="sm" className="flex-1">
                <Star className="h-4 w-4 mr-1" />
                Beri Rating
              </Button>
            </ReviewDialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Lihat Review ({menuAnalytics.total_reviews})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Review untuk {item.name}</DialogTitle>
                </DialogHeader>
                <ReviewsList menuItemId={item.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>

      {/* Email input dialog */}
      <Dialog open={showEmailInput} onOpenChange={setShowEmailInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Untuk menambahkan ke favorit, silakan masukkan email Anda
            </p>
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleEmailSubmit} className="flex-1">
                Simpan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEmailInput(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
