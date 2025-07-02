
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCategoryData } from '@/hooks/useCategoryData';
import { CategoryFormDialog } from './CategoryFormDialog';
import { CategoryTableRow } from './CategoryTableRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function CategoryManagement() {
  const { categories, loading, saveCategory, deleteCategory } = useCategoryData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <CategoryFormDialog onSave={saveCategory} />
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
              <CategoryTableRow
                key={category.id}
                category={category}
                onEdit={saveCategory}
                onDelete={deleteCategory}
              />
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
