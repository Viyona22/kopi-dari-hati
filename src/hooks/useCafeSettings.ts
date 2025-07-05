
import { useAppSettings } from './useAppSettings';
import { useEffect, useState } from 'react';

export function useCafeSettings() {
  const { getSetting, loading } = useAppSettings();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh when settings might have changed
  const refresh = () => {
    console.log('useCafeSettings refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Listen for storage events to refresh when settings change
    const handleStorageChange = (event) => {
      console.log('Settings updated event received:', event);
      refresh();
    };
    
    const handleCustomStorageEvent = (event) => {
      console.log('Custom storage event received:', event);
      refresh();
    };

    window.addEventListener('settings-updated', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('settings-updated', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, []);

  // Provide fallback values if settings are not accessible
  const paymentMethods = {
    qris: {
      enabled: getSetting('payment_qris_enabled', true),
      value: getSetting('payment_qris_value', 'https://qris.example.com/dummy-qr-code-kopi-dari-hati')
    },
    bank: {
      enabled: getSetting('payment_bank_enabled', true),
      account: getSetting('payment_bank_account', {
        bank: 'BCA',
        account_number: '1234567890',
        account_name: 'Kopi dari Hati'
      })
    },
    ewallet: {
      enabled: getSetting('payment_ewallet_enabled', false),
      options: getSetting('payment_ewallet_options', {
        gopay: false,
        ovo: false,
        dana: false
      }),
      contacts: getSetting('payment_ewallet_contacts', {
        gopay: '',
        ovo: '',
        dana: ''
      })
    }
  };

  console.log('useCafeSettings - Current payment methods:', paymentMethods);

  return {
    cafeName: getSetting('cafe_name', 'Kopi dari Hati'),
    cafeTagline: getSetting('cafe_tagline', 'Kamu Obsesi Paling Indah dari Hati'),
    cafeDescription: getSetting('cafe_description', 'Pengalaman kopi dan camilan autentik dengan cita rasa Bangka yang tak terlupakan'),
    cafeLogo: getSetting('cafe_logo', null),
    contactEmail: getSetting('contact_email', 'admin@kopidarhati.com'),
    contactWhatsapp: getSetting('contact_whatsapp', '+62812345678'),
    contactInstagram: getSetting('contact_instagram', '@kopidarhati'),
    contactFacebook: getSetting('contact_facebook', 'Kopi dari Hati Bangka'),
    atmosphereImages: getSetting('atmosphere_images', []),
    operationalHours: {
      open: getSetting('operational_hours_open', '08:00'),
      close: getSetting('operational_hours_close', '22:00'),
      isOpen: getSetting('operational_is_open', true)
    },
    operationalDays: getSetting('operational_days', {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }),
    paymentMethods,
    loading,
    refresh
  };
}
