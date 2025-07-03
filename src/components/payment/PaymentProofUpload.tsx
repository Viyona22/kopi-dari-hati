
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface PaymentProofUploadProps {
  purchaseId: string;
  onUploadComplete: () => void;
}

export function PaymentProofUpload({ purchaseId, onUploadComplete }: PaymentProofUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
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
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${purchaseId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

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

      if (dbError) throw dbError;

      // Update purchase payment status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ payment_status: 'uploaded' })
        .eq('id', purchaseId);

      if (updateError) throw updateError;

      setUploaded(true);
      toast({
        title: "Berhasil",
        description: "Bukti pembayaran berhasil diunggah",
      });

      onUploadComplete();

    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: "Gagal Upload",
        description: "Terjadi kesalahan saat mengunggah bukti pembayaran",
        variant: "destructive"
      });
    }

    setUploading(false);
  };

  if (uploaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-green-700">Bukti Pembayaran Berhasil Diunggah!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Pesanan Anda sedang menunggu verifikasi admin. Kami akan menghubungi Anda segera.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#d4462d] flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Bukti Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                className="max-w-full max-h-64 object-contain border rounded-lg"
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tips:</strong> Pastikan bukti pembayaran terlihat jelas, termasuk nominal, tanggal, dan nama penerima.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
