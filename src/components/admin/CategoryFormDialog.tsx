
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/hooks/useCategoryData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CategoryFormDialogProps {
  onSave: (category: Omit<Category, 'created_at' | 'updated_at'>) => Promise<void>;
}

export function CategoryFormDialog({ onSave }: CategoryFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    display_name: ''
  });

  const handleSubmit = async () => {
    if (!newCategory.id || !newCategory.name || !newCategory.display_name) {
      toast.error('Semua field wajib diisi');
      return;
    }
    
    try {
      await onSave(newCategory);
      setNewCategory({ id: '', name: '', display_name: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Button onClick={handleSubmit} className="flex-1 bg-[#d4462d] hover:bg-[#b93e26]">
              Tambah
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
