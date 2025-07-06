
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, CheckCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface PaymentProofUploadModalProps {
  purchaseId: string;
  onUploadComplete: () => void;
}

export function PaymentProofUploadModal({ purchaseId, onUploadComplete }: PaymentProofUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProof = async () => {
    if (!selectedFile || !user?.id) {
      toast({
        title: "Error",
        description: "Pilih file dan pastikan Anda sudah login",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      console.log('Starting upload process...');
      
      // Validate purchase ownership first
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('id, user_id, payment_status')
        .eq('id', purchaseId)
        .eq('user_id', user.id)
        .single();

      if (purchaseError || !purchaseData) {
        throw new Error('Purchase tidak ditemukan atau tidak dapat diakses');
      }

      if (purchaseData.payment_status !== 'pending') {
        throw new Error('Upload bukti pembayaran hanya dapat dilakukan untuk pesanan dengan status pending');
      }

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${purchaseId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Save payment proof record
      const { error: dbError } = await supabase
        .from('payment_proofs')
        .insert({
          purchase_id: purchaseId,
          proof_image_url: publicUrl,
          status: 'pending'
        });

      if (dbError) {
        // Try to clean up uploaded file
        await supabase.storage
          .from('payment-proofs')
          .remove([fileName]);
        throw new Error(`Gagal menyimpan bukti pembayaran: ${dbError.message}`);
      }

      // Update purchase payment status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ payment_status: 'uploaded' })
        .eq('id', purchaseId);

      if (updateError) {
        throw new Error(`Gagal mengupdate status pembayaran: ${updateError.message}`);
      }

      setUploaded(true);
      toast({
        title: "Berhasil",
        description: "Bukti pembayaran berhasil diunggah",
      });

      onUploadComplete();
      
      // Close modal after success
      setTimeout(() => {
        setIsOpen(false);
        setUploaded(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }, 2000);

    } catch (error) {
      console.error('Upload process error:', error);
      toast({
        title: "Gagal Upload",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah bukti pembayaran",
        variant: "destructive"
      });
    }

    setUploading(false);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploaded(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#d4462d] hover:bg-[#b33a25] text-white">
          <FileText className="w-4 h-4 mr-1" />
          Upload Bukti
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#d4462d] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Bukti Pembayaran
          </DialogTitle>
        </DialogHeader>
        
        {uploaded ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-green-700">Bukti Pembayaran Berhasil Diunggah!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Pesanan Anda sedang menunggu verifikasi admin.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-proof">Pilih File Bukti Pembayaran</Label>
              <Input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format yang didukung: JPG, PNG, JPEG (Max 5MB)
              </p>
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview:</Label>
                <div className="relative inline-block">
                  <img 
                    src={previewUrl} 
                    alt="Payment proof preview" 
                    className="max-w-full max-h-48 object-contain border rounded-lg"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={uploadProof}
              disabled={!selectedFile || uploading}
              className="w-full bg-[#d4462d] hover:bg-[#b33a25]"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  Upload Bukti Pembayaran
                </>
              )}
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> Pastikan bukti pembayaran terlihat jelas, termasuk nominal, tanggal, dan nama penerima.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
