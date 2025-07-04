
import React from 'react';
import { Settings } from 'lucide-react';
import { CafeBrandingSection } from './CafeBrandingSection';
import { PaymentMethodsSection } from './PaymentMethodsSection';
import { ContactInfoSection } from './ContactInfoSection';
import { WebsiteContentSection } from './WebsiteContentSection';

export function AdminSettingsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
      </div>

      {/* Cafe Branding & Identity */}
      <CafeBrandingSection />

      {/* Payment Methods */}
      <PaymentMethodsSection />

      {/* Contact Information */}
      <ContactInfoSection />

      {/* Website Content */}
      <WebsiteContentSection />
    </div>
  );
}
