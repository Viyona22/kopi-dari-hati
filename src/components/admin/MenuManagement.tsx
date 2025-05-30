import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Save, X, ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
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

  // Menu data sesuai Figma design
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Kopi Special
    { id: '1', name: 'Ice Kopi Susu', price: 22000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '2', name: 'Ice Matcha Espresso', price: 30000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '3', name: 'Ice Coffee Shake', price: 25000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '4', name: 'Ice Hazelnut Latte', price: 28000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '5', name: 'Ice Red Velvet Latte', price: 25000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '6', name: 'Ice Kops Latte', price: 24000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '7', name: 'Hot Americano', price: 20000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '8', name: 'Hot Coffee Latte', price: 25000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '9', name: 'Hot Cappuccino', price: 23000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '10', name: 'Le Mineral', price: 8000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    
    // Cemilan Favorite
    { id: '11', name: 'Pisang Coklat', price: 10000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '12', name: 'Sempek-2', price: 12000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '13', name: 'Tteokbokki', price: 20000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '14', name: 'Mie Tek-tek', price: 15000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '15', name: 'Nugget Goreng', price: 12000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '16', name: 'Kentang Goreng', price: 15000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    
    // Makan Kenyang
    { id: '17', name: 'Original Beef Bowl', price: 40000, category: 'makanan', description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '18', name: 'Teriyaki Beef Bowl', price: 40000, category: 'makanan', description: 'Slice beef premium dimasak dengan saus teriyaki ditambah telur mata sapi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '19', name: 'Bulgogi Beef Bowl', price: 45000, category: 'makanan', description: 'Korean style beef bowl dengan rasa bulgogi yang autentik', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '20', name: 'Beef Bowl Special', price: 45000, category: 'makanan', description: 'Beef bowl dengan saus spesial kopi dari hati', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '21', name: 'Nasi Goreng Special', price: 30000, category: 'makanan', description: 'Nasi goreng dengan telur mata sapi dan ayam', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '22', name: 'Nasi Chicken Katsu', price: 32000, category: 'makanan', description: 'Nasi dengan chicken katsu crispy dan saus special', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '23', name: 'Nasi Ayam Geprek', price: 25000, category: 'makanan', description: 'Nasi dengan ayam geprek pedas', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '24', name: 'Nasi Sup Ayam', price: 28000, category: 'makanan', description: 'Nasi dengan sup ayam hangat dan sayuran', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '25', name: 'Nasi Telur Dadar', price: 20000, category: 'makanan', description: 'Nasi dengan telur dadar dan lauk pelengkap', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '26', name: 'Nasi Ayam Bakar', price: 30000, category: 'makanan', description: 'Nasi dengan ayam bakar bumbu khas', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' }
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
      image: newItem.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'
    };
    
    setMenuItems(items => [...items, itemToAdd]);
    setNewItem({ name: '', price: 0, category: 'kopi', description: '', image: '' });
    setIsAddDialogOpen(false);
  };

  const handleImageChange = (itemId: string, imageUrl: string) => {
    if (editingItem?.id === itemId) {
      setEditingItem({ ...editingItem, image: imageUrl });
    } else {
      setMenuItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, image: imageUrl } : item
        )
      );
    }
  };

  const handleImageRemove = (itemId: string) => {
    if (editingItem?.id === itemId) {
      setEditingItem({ ...editingItem, image: '' });
    } else {
      setMenuItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, image: '' } : item
        )
      );
    }
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
                  <label className="text-sm font-medium">Gambar Menu</label>
                  <ImageUpload
                    currentImage={newItem.image}
                    onImageChange={(imageUrl) => setNewItem({ ...newItem, image: imageUrl })}
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
              <TableHead className="font-semibold text-gray-700">Deskripsi</TableHead>
              <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenuItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  {editingItem?.id === item.id ? (
                    <ImageUpload
                      currentImage={editingItem.image}
                      onImageChange={(imageUrl) => handleImageChange(editingItem.id, imageUrl)}
                      onImageRemove={() => handleImageRemove(editingItem.id)}
                    />
                  ) : (
                    <div className="relative group">
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
