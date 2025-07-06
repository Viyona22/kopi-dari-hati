
import { useAppSettings } from './useAppSettings';
import { useEffect, useState } from 'react';

export function useCafeSettings() {
  const { getSetting, loading, settings } = useAppSettings();
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasTimeout, setHasTimeout] = useState(false);

  // Force refresh when settings might have changed
  const refresh = () => {
    console.log('useCafeSettings refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('useCafeSettings: Loading timeout reached, using fallbacks');
      setHasTimeout(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

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

  // Use timeout or loading state to determine if we should use fallbacks
  const shouldUseFallbacks = hasTimeout || !loading;

  // Provide fallback values with more robust checking
  const qrisEnabled = getSetting('payment_qris_enabled', true);
  const qrisValue = getSetting('payment_qris_value', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345');
  
  const bankEnabled = getSetting('payment_bank_enabled', true);
  const bankAccount = getSetting('payment_bank_account', {
    bank: 'BCA',
    account_number: '1234567890',
    account_name: 'Kopi dari Hati'
  });
  
  const ewalletEnabled = getSetting('payment_ewallet_enabled', false);
  const ewalletOptions = getSetting('payment_ewallet_options', {
    gopay: false,
    ovo: false,
    dana: false
  });
  const ewalletContacts = getSetting('payment_ewallet_contacts', {
    gopay: '',
    ovo: '',
    dana: ''
  });

  const paymentMethods = {
    qris: {
      enabled: qrisEnabled !== false,
      value: qrisValue && qrisValue !== '' ? qrisValue : null
    },
    bank: {
      enabled: bankEnabled !== false,
      account: bankAccount
    },
    ewallet: {
      enabled: ewalletEnabled === true,
      options: ewalletOptions,
      contacts: ewalletContacts
    }
  };

  console.log('useCafeSettings - Current payment methods:', paymentMethods);
  console.log('useCafeSettings - shouldUseFallbacks:', shouldUseFallbacks, 'loading:', loading, 'hasTimeout:', hasTimeout);

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
    loading: shouldUseFallbacks ? false : loading, // Force loading to false after timeout
    refresh
  };
}
