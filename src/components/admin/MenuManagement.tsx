
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Save, X } from 'lucide-react';
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

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'kopi' | 'cemilan' | 'makanan';
  description?: string;
  image: string;
}

export function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'kopi',
    description: '',
    image: ''
  });

  // Initial menu data from Menu.tsx
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Kopi Special
    { id: '1', name: 'Ice Kopi Susu', price: 22000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/6268e9cdd7ad0a1667165091747429dfd0387b0a?placeholderIfAbsent=true' },
    { id: '2', name: 'Ice Matcha Espresso', price: 30000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a882cffbb4f2ef179c6a7a20f67fd69443be1db2?placeholderIfAbsent=true' },
    { id: '3', name: 'Ice Coffee Shake', price: 25000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/4ea9f3e5c46371c16d658e202c231a36de7c3475?placeholderIfAbsent=true' },
    { id: '4', name: 'Ice Red Velvet Latte', price: 25000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8e02a424a750a7553ffc5cec6452aa9349e21fa2?placeholderIfAbsent=true' },
    { id: '5', name: 'Ice Double Mocha', price: 25000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/9413fb82294f3f5a0c9e90c179c1a17772cb881e?placeholderIfAbsent=true' },
    { id: '6', name: 'Hot Americano', price: 20000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/013e1d29df3651efe87d10af7f9776f73ce1a636?placeholderIfAbsent=true' },
    { id: '7', name: 'Hot Cappuccino', price: 25000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f1cbed3faaf6c4f43ac7f34d84077e488475a06c?placeholderIfAbsent=true' },
    { id: '8', name: 'Hot Coffee Latte', price: 25000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/12b29b8e9a71aa9af8c87dc56c7f849c39b8a234?placeholderIfAbsent=true' },
    { id: '9', name: 'Hot Espresso', price: 20000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d2c4d1e2161694b025810a5179c2b016ff081a0b?placeholderIfAbsent=true' },
    { id: '10', name: 'Le Mineral', price: 8000, category: 'kopi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/88ce0d05767d77f17dd4a3b5ba15c9919cd3a872?placeholderIfAbsent=true' },
    
    // Cemilan Favorite
    { id: '11', name: 'Pisang Coklat', price: 10000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f10dffeee6529562c0b99f546f2f4c96cdb9ba5e?placeholderIfAbsent=true' },
    { id: '12', name: 'Otak-otak Bakar', price: 15000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/4a0a584836e3ce06c11dffacb9dcd5522a6327a0?placeholderIfAbsent=true' },
    { id: '13', name: 'Tteokbokki', price: 20000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f0f4fd16a6d97a6dc113a44c15964b892a116c50?placeholderIfAbsent=true' },
    { id: '14', name: 'Mie Tek-tek', price: 15000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/2db510491c5c242178580c22a0016223b9a38926?placeholderIfAbsent=true' },
    { id: '15', name: 'Nugget Goreng', price: 12000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c51e0c3eeb558bde1bb4753be7a5b92e54f2ba7c?placeholderIfAbsent=true' },
    { id: '16', name: 'Kentang Goreng', price: 15000, category: 'cemilan', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c1fa0c53907bc6a0ed4b8a4f8c021f89ae77e840?placeholderIfAbsent=true' },
    
    // Makan Kenyang
    { id: '17', name: 'Original Beef Bowl', price: 40000, category: 'makanan', description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a87859f430c9606fa779269879c949fad50d3f35?placeholderIfAbsent=true' },
    { id: '18', name: 'Teriyaki Beef Bowl', price: 40000, category: 'makanan', description: 'Slice beef premium dimasak dengan saus teriyaki ditambah telur mata sapi', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/730370f0e60278cceaf5ec3c12a79f907705529e?placeholderIfAbsent=true' },
    { id: '19', name: 'Original Beef Bowl Special', price: 45000, category: 'makanan', description: 'Original beef bowl dengan tambahan sayuran dan keju', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/023b16447e0cb928a69a828370ebd31bba33b8e3?placeholderIfAbsent=true' },
    { id: '20', name: 'Beef Bowl with Special Sauce', price: 45000, category: 'makanan', description: 'Beef bowl dengan saus spesial kopi dari hati', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d4e9062045a4da629131c19a7184d5ce3b29ea90?placeholderIfAbsent=true' },
    { id: '21', name: 'Nasi Goreng Special', price: 30000, category: 'makanan', description: 'Nasi goreng dengan telur mata sapi dan ayam', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/e9330a9790fc2ba1f1bdeae3ac51518dd0b62132?placeholderIfAbsent=true' },
    { id: '22', name: 'Mie Goreng Special', price: 30000, category: 'makanan', description: 'Mie goreng dengan telur dan ayam', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/386ef893cca6e9ebb7e78a656f2e31aa2bdb6ee8?placeholderIfAbsent=true' },
    { id: '23', name: 'Mie Koba Bangka Original', price: 25000, category: 'makanan', description: 'Mie khas Bangka dengan bakso ikan dan sayuran', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/56e389493465126608506ed4b0beb63a1a0cd709?placeholderIfAbsent=true' },
    { id: '24', name: 'Beef Maki Special Mushroom', price: 45000, category: 'makanan', description: 'Beef roll dengan jamur spesial', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f1cbed3faaf6c4f43ac7f34d84077e488475a06c?placeholderIfAbsent=true' },
    { id: '25', name: 'Nasi Ayam Geprek', price: 25000, category: 'makanan', description: 'Nasi dengan ayam geprek pedas', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/12b29b8e9a71aa9af8c87dc56c7f849c39b8a234?placeholderIfAbsent=true' },
    { id: '26', name: 'Nasi Cabe Gilingan', price: 28000, category: 'makanan', description: 'Nasi dengan sambal cabe gilingan dan lauk', image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d2c4d1e2161694b025810a5179c2b016ff081a0b?placeholderIfAbsent=true' }
  ]);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'kopi': return 'Kopi Special';
      case 'cemilan': return 'Cemilan Favorite';
      case 'makanan': return 'Makan Kenyang';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kopi': return 'bg-blue-100 text-blue-800';
      case 'cemilan': return 'bg-green-100 text-green-800';
      case 'makanan': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    setMenuItems(items => 
      items.map(item => 
        item.id === editingItem.id ? editingItem : item
      )
    );
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    
    const id = (Math.max(...menuItems.map(item => parseInt(item.id))) + 1).toString();
    const itemToAdd: MenuItem = {
      id,
      name: newItem.name!,
      price: newItem.price!,
      category: newItem.category as 'kopi' | 'cemilan' | 'makanan',
      description: newItem.description || undefined,
      image: newItem.image || 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/placeholder?placeholderIfAbsent=true'
    };
    
    setMenuItems(items => [...items, itemToAdd]);
    setNewItem({ name: '', price: 0, category: 'kopi', description: '', image: '' });
    setIsAddDialogOpen(false);
  };

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
              <SelectItem value="kopi">Kopi Special</SelectItem>
              <SelectItem value="cemilan">Cemilan Favorite</SelectItem>
              <SelectItem value="makanan">Makan Kenyang</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#d4462d] hover:bg-[#b93e26]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
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
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value as 'kopi' | 'cemilan' | 'makanan' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kopi">Kopi Special</SelectItem>
                      <SelectItem value="cemilan">Cemilan Favorite</SelectItem>
                      <SelectItem value="makanan">Makan Kenyang</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <label className="text-sm font-medium">URL Gambar (opsional)</label>
                  <Input
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    placeholder="Masukkan URL gambar"
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
              <TableHead className="font-semibold text-gray-700">Nama Menu</TableHead>
              <TableHead className="font-semibold text-gray-700">Kategori</TableHead>
              <TableHead className="font-semibold text-gray-700">Harga</TableHead>
              <TableHead className="font-semibold text-gray-700">Deskripsi</TableHead>
              <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenuItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  {editingItem?.id === item.id ? (
                    <Input
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="font-medium"
                    />
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingItem?.id === item.id ? (
                    <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value as 'kopi' | 'cemilan' | 'makanan' })}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kopi">Kopi Special</SelectItem>
                        <SelectItem value="cemilan">Cemilan Favorite</SelectItem>
                        <SelectItem value="makanan">Makan Kenyang</SelectItem>
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
                    <Textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="min-h-16"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {item.description || '-'}
                    </span>
                  )}
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
            ))}
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
