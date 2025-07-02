
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash, Save, X } from 'lucide-react';
import { Category } from '@/hooks/useCategoryData';
import { TableCell, TableRow } from '@/components/ui/table';

interface CategoryTableRowProps {
  category: Category;
  onEdit: (category: Category) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryTableRow({ category, onEdit, onDelete }: CategoryTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Category>(category);

  const handleSave = async () => {
    try {
      await onEdit(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancel = () => {
    setEditData(category);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await onDelete(category.id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.id}
            onChange={(e) => setEditData({ ...editData, id: e.target.value })}
            disabled
            className="bg-gray-100"
          />
        ) : (
          <span className="font-mono text-sm">{category.id}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="font-medium"
          />
        ) : (
          <span className="font-medium">{category.name}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.display_name}
            onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
          />
        ) : (
          <span>{category.display_name}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
