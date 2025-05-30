
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Clock, 
  Bell, 
  CreditCard, 
  Calendar, 
  Download, 
  Palette,
  Settings
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export function AdminSettingsContent() {
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    email: 'admin@kopidarhati.com',
    password: ''
  });

  const [operationalHours, setOperationalHours] = useState({
    openTime: '08:00',
    closeTime: '22:00',
    isOpen: true
  });

  const [notifications, setNotifications] = useState({
    emailReservation: true,
    emailPurchase: true,
    whatsappReservation: false,
    whatsappPurchase: false
  });

  const [paymentMethods, setPaymentMethods] = useState({
    qris: true,
    cash: true,
    bankTransfer: true
  });

  const [reservationSettings, setReservationSettings] = useState({
    maxPerHour: 10,
    maxPerDay: 100
  });

  const [appSettings, setAppSettings] = useState({
    language: 'id',
    theme: 'light'
  });

  const handleSaveProfile = () => {
    toast.success('Profil admin berhasil diperbarui');
  };

  const handleSaveOperationalHours = () => {
    toast.success('Jam operasional berhasil diperbarui');
  };

  const handleExportData = (type: 'reservations' | 'purchases') => {
    toast.success(`Data ${type === 'reservations' ? 'reservasi' : 'pembelian'} berhasil diekspor`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
      </div>

      {/* Profil Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nama Admin</Label>
              <Input
                id="admin-name"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password Baru (Kosongkan jika tidak ingin mengubah)</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Masukkan password baru"
              value={adminProfile.password}
              onChange={(e) => setAdminProfile({...adminProfile, password: e.target.value})}
            />
          </div>
          <Button onClick={handleSaveProfile} className="bg-amber-600 hover:bg-amber-700">
            Simpan Profil
          </Button>
        </CardContent>
      </Card>

      {/* Jam Operasional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Jam Operasional Restoran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="restaurant-open"
              checked={operationalHours.isOpen}
              onCheckedChange={(checked) => setOperationalHours({...operationalHours, isOpen: checked})}
            />
            <Label htmlFor="restaurant-open">Restoran Buka</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Jam Buka</Label>
              <Input
                id="open-time"
                type="time"
                value={operationalHours.openTime}
                onChange={(e) => setOperationalHours({...operationalHours, openTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Jam Tutup</Label>
              <Input
                id="close-time"
                type="time"
                value={operationalHours.closeTime}
                onChange={(e) => setOperationalHours({...operationalHours, closeTime: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleSaveOperationalHours} className="bg-amber-600 hover:bg-amber-700">
            Simpan Jam Operasional
          </Button>
        </CardContent>
      </Card>

      {/* Pengaturan Notifikasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-reservation">Email untuk Reservasi Baru</Label>
              <Switch
                id="email-reservation"
                checked={notifications.emailReservation}
                onCheckedChange={(checked) => setNotifications({...notifications, emailReservation: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-purchase">Email untuk Pembelian Baru</Label>
              <Switch
                id="email-purchase"
                checked={notifications.emailPurchase}
                onCheckedChange={(checked) => setNotifications({...notifications, emailPurchase: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="wa-reservation">WhatsApp untuk Reservasi Baru</Label>
              <Switch
                id="wa-reservation"
                checked={notifications.whatsappReservation}
                onCheckedChange={(checked) => setNotifications({...notifications, whatsappReservation: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="wa-purchase">WhatsApp untuk Pembelian Baru</Label>
              <Switch
                id="wa-purchase"
                checked={notifications.whatsappPurchase}
                onCheckedChange={(checked) => setNotifications({...notifications, whatsappPurchase: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metode Pembayaran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Manajemen Metode Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="qris">QRIS</Label>
                <Badge variant={paymentMethods.qris ? "default" : "secondary"}>
                  {paymentMethods.qris ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <Switch
                id="qris"
                checked={paymentMethods.qris}
                onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, qris: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="cash">Tunai</Label>
                <Badge variant={paymentMethods.cash ? "default" : "secondary"}>
                  {paymentMethods.cash ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <Switch
                id="cash"
                checked={paymentMethods.cash}
                onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, cash: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="bank-transfer">Transfer Bank</Label>
                <Badge variant={paymentMethods.bankTransfer ? "default" : "secondary"}>
                  {paymentMethods.bankTransfer ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <Switch
                id="bank-transfer"
                checked={paymentMethods.bankTransfer}
                onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, bankTransfer: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kuota Reservasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atur Kuota Reservasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-per-hour">Maksimum Reservasi per Jam</Label>
              <Input
                id="max-per-hour"
                type="number"
                value={reservationSettings.maxPerHour}
                onChange={(e) => setReservationSettings({...reservationSettings, maxPerHour: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-per-day">Maksimum Reservasi per Hari</Label>
              <Input
                id="max-per-day"
                type="number"
                value={reservationSettings.maxPerDay}
                onChange={(e) => setReservationSettings({...reservationSettings, maxPerDay: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Backup Data / Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleExportData('reservations')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data Reservasi
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExportData('purchases')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data Pembelian
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bahasa & Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Bahasa Aplikasi & Tema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Bahasa</Label>
              <Select value={appSettings.language} onValueChange={(value) => setAppSettings({...appSettings, language: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Tema Dashboard</Label>
              <Select value={appSettings.theme} onValueChange={(value) => setAppSettings({...appSettings, theme: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Terang</SelectItem>
                  <SelectItem value="dark">Gelap</SelectItem>
                  <SelectItem value="amber">Amber (Default)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
