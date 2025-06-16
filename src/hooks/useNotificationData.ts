
import { useState, useEffect } from 'react'
import { usePurchaseData } from './usePurchaseData'
import { useReservationData } from './useReservationData'
import { useMenuData } from './useMenuData'

export interface Notification {
  id: string
  type: 'reservation' | 'purchase' | 'stock' | 'payment_error'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  data?: any
}

export function useNotificationData() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { purchases } = usePurchaseData()
  const { reservations } = useReservationData()
  const { menuItems } = useMenuData()

  // Generate notifications based on data
  useEffect(() => {
    const newNotifications: Notification[] = []
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // New reservations (last hour)
    const newReservations = reservations.filter(reservation => {
      if (!reservation.created_at) return false
      const createdAt = new Date(reservation.created_at)
      return createdAt >= oneHourAgo
    })

    newReservations.forEach(reservation => {
      newNotifications.push({
        id: `reservation-${reservation.id}`,
        type: 'reservation',
        title: 'Reservasi Baru',
        message: `Reservasi atas nama ${reservation.name} untuk ${reservation.guests} orang pada ${reservation.date}`,
        timestamp: reservation.created_at || '',
        isRead: false,
        data: reservation
      })
    })

    // New successful purchases (last hour)
    const newPurchases = purchases.filter(purchase => {
      if (!purchase.created_at || purchase.status !== 'Selesai') return false
      const createdAt = new Date(purchase.created_at)
      return createdAt >= oneHourAgo
    })

    newPurchases.forEach(purchase => {
      newNotifications.push({
        id: `purchase-${purchase.id}`,
        type: 'purchase',
        title: 'Pembelian Berhasil',
        message: `Pembelian dari ${purchase.customer_name} senilai Rp ${purchase.total_amount.toLocaleString('id-ID')}`,
        timestamp: purchase.created_at || '',
        isRead: false,
        data: purchase
      })
    })

    // Low stock items (≤ 5)
    // Note: Since we don't have stock field in menu_items, we'll simulate this
    // In real implementation, you would check actual stock levels
    const lowStockItems = menuItems.filter((_, index) => {
      // Simulate random low stock for demo purposes
      return Math.random() > 0.9 && index < 2 // Only show for first 2 items occasionally
    })

    lowStockItems.forEach(item => {
      newNotifications.push({
        id: `stock-${item.id}`,
        type: 'stock',
        title: 'Stok Hampir Habis',
        message: `Stok ${item.name} tinggal sedikit, segera lakukan restok`,
        timestamp: new Date().toISOString(),
        isRead: false,
        data: item
      })
    })

    // Payment errors (simulated from cancelled purchases)
    const paymentErrors = purchases.filter(purchase => {
      if (!purchase.created_at || purchase.status !== 'Dibatalkan') return false
      const createdAt = new Date(purchase.created_at)
      return createdAt >= oneHourAgo
    })

    paymentErrors.forEach(purchase => {
      newNotifications.push({
        id: `payment-error-${purchase.id}`,
        type: 'payment_error',
        title: 'Pembayaran Gagal',
        message: `Pembayaran dari ${purchase.customer_name} mengalami error`,
        timestamp: purchase.created_at || '',
        isRead: false,
        data: purchase
      })
    })

    // Sort by timestamp (newest first)
    newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setNotifications(newNotifications)
  }, [purchases, reservations, menuItems])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}
