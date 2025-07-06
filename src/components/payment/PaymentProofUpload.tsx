
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [purchaseExists, setPurchaseExists] = useState<boolean | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState(true);
  const { user } = useAuthContext();

  // Check if purchase exists and belongs to user
  useEffect(() => {
    const checkPurchase = async () => {
      // If no user, don't proceed but still show the form
      if (!user?.id) {
        console.log('No authenticated user found');
        setPurchaseExists(true); // Allow form to show, validation will happen during upload
        setLoadingPurchase(false);
        return;
      }

      if (!purchaseId) {
        console.log('No purchase ID provided');
        setPurchaseExists(false);
        setLoadingPurchase(false);
        return;
      }

      try {
        console.log('Checking purchase existence for:', { purchaseId, userId: user.id });
        
        // Use a more robust query with shorter timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 1500) // Reduced timeout
        );

        const purchasePromise = supabase
          .from('purchases')
          .select('id, user_id, payment_status')
          .eq('id', purchaseId)
          .limit(1);

        const { data, error } = await Promise.race([purchasePromise, timeoutPromise]) as any;

        if (error) {
          console.error('Purchase check error:', error);
          // Show the form anyway, validation will happen during upload
          setPurchaseExists(true);
          setLoadingPurchase(false);
          return;
        }

        if (data && data.length > 0 && data[0].user_id === user.id) {
          console.log('Purchase validation successful:', data[0]);
          setPurchaseExists(true);
        } else {
          console.log('Purchase not found or access denied');
          setPurchaseExists(false);
        }
      } catch (error) {
        console.error('Purchase validation error:', error);
        // If there's a connection error, still show the upload form
        setPurchaseExists(true);
        console.log('Connection error, showing upload form anyway');
      } finally {
        setLoadingPurchase(false);
      }
    };

    checkPurchase();
  }, [purchaseId, user?.id]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file terlalu besar. Maksimal 5MB.",
          variant: "destructive"
        });
        return;
      }

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
      console.log('User ID:', user.id);
      console.log('Purchase ID:', purchaseId);
      console.log('File:', selectedFile.name, 'Size:', selectedFile.size);

      // Re-validate purchase before upload with shorter timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout')), 2000)
      );

      const purchasePromise = supabase
        .from('purchases')
        .select('id, user_id, payment_status')
        .eq('id', purchaseId)
        .limit(1);

      const { data: purchaseData, error: purchaseError } = await Promise.race([
        purchasePromise, 
        timeoutPromise
      ]) as any;

      if (purchaseError) {
        console.error('Purchase validation error:', purchaseError);
        throw new Error('Purchase tidak ditemukan atau tidak dapat diakses');
      }

      if (!purchaseData || purchaseData.length === 0) {
        throw new Error('Purchase tidak ditemukan');
      }

      const purchase = purchaseData[0];
      
      if (purchase.user_id !== user.id) {
        throw new Error('Anda tidak memiliki akses ke purchase ini');
      }

      if (purchase.payment_status !== 'pending') {
        throw new Error('Upload bukti pembayaran hanya dapat dilakukan untuk pesanan dengan status pending');
      }

      console.log('Purchase validation successful:', purchase);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${purchaseId}-${Date.now()}.${fileExt}`;

      console.log('Uploading to storage with filename:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
      }

      console.log('File uploaded successfully');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', publicUrl);

      // Save payment proof record
      console.log('Inserting payment proof record...');
      const { error: dbError } = await supabase
        .from('payment_proofs')
        .insert({
          purchase_id: purchaseId,
          proof_image_url: publicUrl,
          status: 'pending'
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to clean up uploaded file
        await supabase.storage
          .from('payment-proofs')
          .remove([fileName]);
        throw new Error(`Gagal menyimpan bukti pembayaran: ${dbError.message}`);
      }

      console.log('Payment proof record inserted successfully');

      // Update purchase payment status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ payment_status: 'uploaded' })
        .eq('id', purchaseId);

      if (updateError) {
        console.error('Purchase update error:', updateError);
        throw new Error(`Gagal mengupdate status pembayaran: ${updateError.message}`);
      }

      console.log('Purchase status updated successfully');

      setUploaded(true);
      toast({
        title: "Berhasil",
        description: "Bukti pembayaran berhasil diunggah",
      });

      onUploadComplete();

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

  // Show minimal loading state
  if (loadingPurchase) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4462d] mx-auto mb-4"></div>
            <p className="text-gray-600">Memvalidasi pesanan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-amber-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Silakan login terlebih dahulu untuk mengunggah bukti pembayaran.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error only if we're absolutely sure purchase doesn't exist
  if (purchaseExists === false && !loadingPurchase) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Pesanan tidak ditemukan atau Anda tidak memiliki akses.</p>
            <p className="text-sm text-gray-500 mt-2">Purchase ID: {purchaseId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
