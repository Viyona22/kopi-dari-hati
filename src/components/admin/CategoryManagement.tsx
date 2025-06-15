
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash, Save, X } from 'lucide-react';
import { useCategoryData, Category } from '@/hooks/useCategoryData';
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

export function CategoryManagement() {
  const { categories, loading, saveCategory, deleteCategory } = useCategoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    display_name: ''
  });

  const filteredCategories = categories.filter(category =>
    category.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name || !editingCategory.display_name) {
      toast.error('Nama dan nama tampilan kategori wajib diisi');
      return;
    }

    try {
      await saveCategory(editingCategory);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.id || !newCategory.name || !newCategory.display_name) {
      toast.error('Semua field wajib diisi');
      return;
    }
    
    try {
      await saveCategory(newCategory);
      setNewCategory({ id: '', name: '', display_name: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            Memuat data kategori...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 mb-6">
          Kelola Kategori Menu
        </CardTitle>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#d4462d] hover:bg-[#b93e26]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Kategori Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ID Kategori</label>
                  <Input
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="Contoh: minuman_dingin"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nama Kategori</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="Contoh: minuman_dingin"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nama Tampilan</label>
                  <Input
                    value={newCategory.display_name}
                    onChange={(e) => setNewCategory({ ...newCategory, display_name: e.target.value })}
                    placeholder="Contoh: Minuman Dingin"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddCategory} className="flex-1 bg-[#d4462d] hover:bg-[#b93e26]">
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
              <TableHead className="font-semibold text-gray-700">ID Kategori</TableHead>
              <TableHead className="font-semibold text-gray-700">Nama Kategori</TableHead>
              <TableHead className="font-semibold text-gray-700">Nama Tampilan</TableHead>
              <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      value={editingCategory.id}
                      onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                      disabled
                      className="bg-gray-100"
                    />
                  ) : (
                    <span className="font-mono text-sm">{category.id}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="font-medium"
                    />
                  ) : (
                    <span className="font-medium">{category.name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      value={editingCategory.display_name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, display_name: e.target.value })}
                    />
                  ) : (
                    <span>{category.display_name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
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
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(category.id)}
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
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm 
              ? 'Tidak ada kategori yang ditemukan' 
              : 'Belum ada kategori yang tersedia'
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
