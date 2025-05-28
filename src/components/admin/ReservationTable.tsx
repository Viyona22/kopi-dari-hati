
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
import { Search, CalendarIcon, MoreHorizontal } from 'lucide-react';
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
      tanggal: "25/04/2024",
      jumlahTamu: 2,
      waktu: "18:00",
      status: "Selesai"
    },
    {
      no: 2,
      nama: "Dedi",
      tanggal: "25/04/2024",
      jumlahTamu: 4,
      waktu: "18:30",
      status: "Menunggu"
    },
    {
      no: 3,
      nama: "Sari",
      tanggal: "24/04/2024",
      jumlahTamu: 2,
      waktu: "18:30",
      status: "Selesai"
    },
    {
      no: 4,
      nama: "Budi",
      tanggal: "23/04/2024",
      jumlahTamu: 6,
      waktu: "20:00",
      status: "Menunggu"
    },
    {
      no: 5,
      nama: "Tini",
      tanggal: "23/04/2024",
      jumlahTamu: 3,
      waktu: "18:00",
      status: "Selesai"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Data Reservasi</h2>
        
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal bg-white border-gray-200",
                  !filterDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, "dd/MM/yyyy") : "23/04/2024"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
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
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="font-semibold text-gray-900 py-4">No</TableHead>
                <TableHead className="font-semibold text-gray-900">Nama</TableHead>
                <TableHead className="font-semibold text-gray-900">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-900">Jumlah Tamu</TableHead>
                <TableHead className="font-semibold text-gray-900">Waktu</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.no} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="py-4 font-medium">{reservation.no}</TableCell>
                  <TableCell className="font-medium text-gray-900">{reservation.nama}</TableCell>
                  <TableCell className="text-gray-700">{reservation.tanggal}</TableCell>
                  <TableCell className="text-gray-700">{reservation.jumlahTamu} orang</TableCell>
                  <TableCell className="text-gray-700">{reservation.waktu}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={reservation.status}
                        onValueChange={(value: Reservation['status']) => 
                          handleStatusUpdate(reservation.no, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Menunggu">Menunggu</SelectItem>
                          <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                          <SelectItem value="Selesai">Selesai</SelectItem>
                          <SelectItem value="Batal">Batal</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
