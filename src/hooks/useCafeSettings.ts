
import { useAppSettings } from './useAppSettings';

export function useCafeSettings() {
  const { getSetting, loading } = useAppSettings();

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
    paymentMethods: {
      qris: {
        enabled: getSetting('payment_qris_enabled', true),
        value: getSetting('payment_qris_value', '')
      },
      bank: {
        enabled: getSetting('payment_bank_enabled', true),
        account: getSetting('payment_bank_account', {})
      },
      ewallet: {
        enabled: getSetting('payment_ewallet_enabled', false),
        options: getSetting('payment_ewallet_options', {})
      }
    },
    loading
  };
}
