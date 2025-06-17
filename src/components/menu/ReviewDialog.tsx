
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useReviewData } from '@/hooks/useReviewData';

interface ReviewDialogProps {
  menuItemId: string;
  menuItemName: string;
  children: React.ReactNode;
  onReviewSubmitted?: () => void;
}

export function ReviewDialog({ menuItemId, menuItemName, children, onReviewSubmitted }: ReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitReview } = useReviewData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        menu_item_id: menuItemId,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || undefined,
        rating,
        comment: comment.trim() || undefined
      });
      
      // Reset form
      setRating(0);
      setHoverRating(0);
      setCustomerName('');
      setCustomerEmail('');
      setComment('');
      setIsOpen(false);
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoverRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className="p-1 transition-colors"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star 
            className={`w-6 h-6 ${
              isActive 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            }`} 
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#d4462d]">
            Beri Rating untuk {menuItemName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating} dari 5 bintang`}
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium text-gray-700">
              Nama <span className="text-red-500">*</span>
            </label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          {/* Customer Email (Optional) */}
          <div className="space-y-2">
            <label htmlFor="customerEmail" className="text-sm font-medium text-gray-700">
              Email (Opsional)
            </label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@contoh.com"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Komentar (Opsional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalaman Anda..."
              className="min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!customerName.trim() || rating === 0 || isSubmitting}
              className="flex-1 bg-[#d4462d] hover:bg-[#b83c29]"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
