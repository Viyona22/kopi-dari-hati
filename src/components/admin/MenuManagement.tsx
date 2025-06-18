
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Save, X, ImageIcon, Star, Heart, AlertTriangle } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useMenuData } from '@/hooks/useMenuData';
import { useCategoryData } from '@/hooks/useCategoryData';
import { useMenuAnalytics } from '@/hooks/useMenuAnalytics';
import { MenuItem } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function MenuManagement() {
  const { menuItems, loading, saveMenuItem, deleteMenuItem, uploadImage } = useMenuData();
  const { categories, loading: categoriesLoading } = useCategoryData();
  const { analytics } = useMenuAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: categories[0]?.id || 'kopi',
    description: '',
    image: '',
    badge_type: null,
    stock_quantity: 50,
    is_featured: false,
    sort_order: 0
  });

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.display_name : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800'
    ];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    return colors[categoryIndex % colors.length] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeColor = (badgeType: string | null) => {
    switch (badgeType) {
      case 'terlaris':
        return 'bg-red-100 text-red-800';
      case 'baru':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-600', label: 'Habis' };
    if (quantity <= 5) return { color: 'text-orange-600', label: 'Stok Rendah' };
    return { color: 'text-green-600', label: 'Tersedia' };
  };

  const getMenuAnalytics = (menuItemId: string) => {
    return analytics.find(a => a.menu_item_id === menuItemId) || {
      total_favorites: 0,
      average_rating: 0,
      total_reviews: 0
    };
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      await saveMenuItem(editingItem);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await deleteMenuItem(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Nama dan harga menu wajib diisi');
      return;
    }
    
    try {
      const id = Date.now().toString();
      const itemToAdd: MenuItem = {
        id,
        name: newItem.name!,
        price: newItem.price!,
        category: newItem.category!,
        description: newItem.description || undefined,
        image: newItem.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png',
        badge_type: newItem.badge_type || null,
        stock_quantity: newItem.stock_quantity || 50,
        is_featured: newItem.is_featured || false,
        sort_order: newItem.sort_order || 0
      };
      
      await saveMenuItem(itemToAdd);
      setNewItem({ 
        name: '', 
        price: 0, 
        category: categories[0]?.id || 'kopi', 
        description: '', 
        image: '',
        badge_type: null,
        stock_quantity: 50,
        is_featured: false,
        sort_order: 0
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleImageChange = async (itemId: string, file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      
      if (editingItem?.id === itemId) {
        setEditingItem({ ...editingItem, image: imageUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageChangeNew = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      setNewItem({ ...newItem, image: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageRemove = (itemId: string) => {
    if (editingItem?.id === itemId) {
      setEditingItem({ ...editingItem, image: '' });
    }
  };

  if (loading || categoriesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            Memuat data menu...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 mb-6">
          Menu Makanan & Minuman
        </CardTitle>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#d4462d] hover:bg-[#b93e26]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Menu Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nama Menu</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Masukkan nama menu"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Harga</label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                    placeholder="Masukkan harga"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kategori</label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Lencana</label>
                  <Select value={newItem.badge_type || 'none'} onValueChange={(value) => setNewItem({ ...newItem, badge_type: value === 'none' ? null : value as 'terlaris' | 'baru' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa Lencana</SelectItem>
                      <SelectItem value="terlaris">Terlaris</SelectItem>
                      <SelectItem value="baru">Baru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Stok</label>
                  <Input
                    type="number"
                    value={newItem.stock_quantity}
                    onChange={(e) => setNewItem({ ...newItem, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Jumlah stok"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newItem.is_featured || false}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, is_featured: checked })}
                  />
                  <label className="text-sm font-medium">Menu Unggulan</label>
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi (opsional)</label>
                  <Textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Masukkan deskripsi menu"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gambar Menu</label>
                  <ImageUpload
                    currentImage={newItem.image}
                    onImageChange={handleImageChangeNew}
                    onImageRemove={() => setNewItem({ ...newItem, image: '' })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddItem} className="flex-1 bg-[#d4462d] hover:bg-[#b93e26]">
                    Tambah
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Gambar</TableHead>
              <TableHead className="font-semibold text-gray-700">Nama Menu</TableHead>
              <TableHead className="font-semibold text-gray-700">Kategori</TableHead>
              <TableHead className="font-semibold text-gray-700">Harga</TableHead>
              <TableHead className="font-semibold text-gray-700">Lencana</TableHead>
              <TableHead className="font-semibold text-gray-700">Stok</TableHead>
              <TableHead className="font-semibold text-gray-700">Analytics</TableHead>
              <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenuItems.map((item) => {
              const itemAnalytics = getMenuAnalytics(item.id);
              const stockStatus = getStockStatus(item.stock_quantity || 0);
              
              return (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <ImageUpload
                        currentImage={editingItem.image}
                        onImageChange={(file) => handleImageChange(editingItem.id, file)}
                        onImageRemove={() => handleImageRemove(editingItem.id)}
                      />
                    ) : (
                      <div className="relative">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="font-medium"
                      />
                    ) : (
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.is_featured && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800">Unggulan</Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getCategoryColor(item.category)}>
                        {getCategoryLabel(item.category)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <Input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      `Rp ${item.price.toLocaleString('id-ID')}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <Select 
                        value={editingItem.badge_type || 'none'} 
                        onValueChange={(value) => setEditingItem({ 
                          ...editingItem, 
                          badge_type: value === 'none' ? null : value as 'terlaris' | 'baru' 
                        })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tanpa Lencana</SelectItem>
                          <SelectItem value="terlaris">Terlaris</SelectItem>
                          <SelectItem value="baru">Baru</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      item.badge_type ? (
                        <Badge className={getBadgeColor(item.badge_type)}>
                          {item.badge_type === 'terlaris' ? 'Terlaris' : 'Baru'}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <Input
                        type="number"
                        value={editingItem.stock_quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, stock_quantity: parseInt(e.target.value) || 0 })}
                        className="w-20"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={stockStatus.color}>
                          {item.stock_quantity || 0}
                        </span>
                        {(item.stock_quantity || 0) <= 5 && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{itemAnalytics.total_favorites}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{itemAnalytics.average_rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredMenuItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tidak ada menu yang ditemukan' 
              : 'Belum ada menu yang tersedia'
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
