
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Reservation {
  no: number;
  nama: string;
  tanggal: string;
  jumlahTamu: number;
  waktu: string;
  status: 'Selesai' | 'Menunggu' | 'Batal' | 'Dalam Proses';
}

export function ReservationTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      no: 1,
      nama: "Rina",
      tanggal: "25/05/2025",
      jumlahTamu: 2,
      waktu: "19:00",
      status: "Selesai"
    },
    {
      no: 2,
      nama: "Budi",
      tanggal: "26/05/2025",
      jumlahTamu: 4,
      waktu: "20:00",
      status: "Menunggu"
    },
    {
      no: 3,
      nama: "Sari",
      tanggal: "27/05/2025",
      jumlahTamu: 3,
      waktu: "18:30",
      status: "Dalam Proses"
    }
  ]);

  const handleStatusUpdate = (reservationNo: number, newStatus: Reservation['status']) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.no === reservationNo 
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Batal':
        return 'bg-red-100 text-red-800';
      case 'Dalam Proses':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.tanggal.includes(searchTerm);
    
    if (!filterDate) return matchesSearch;
    
    const reservationDate = reservation.tanggal;
    const selectedDate = format(filterDate, 'dd/MM/yyyy');
    
    return matchesSearch && reservationDate === selectedDate;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Riwayat Reservasi</CardTitle>
          <div className="flex items-center gap-4">
            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !filterDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "dd/MM/yyyy") : "Filter Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="p-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setFilterDate(undefined)}
                    className="w-full"
                  >
                    Reset Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama atau tanggal..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jumlah Tamu</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.no}>
                <TableCell>{reservation.no}</TableCell>
                <TableCell>{reservation.nama}</TableCell>
                <TableCell>{reservation.tanggal}</TableCell>
                <TableCell>{reservation.jumlahTamu}</TableCell>
                <TableCell>{reservation.waktu}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={reservation.status}
                    onValueChange={(value: Reservation['status']) => 
                      handleStatusUpdate(reservation.no, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Batal">Batal</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
