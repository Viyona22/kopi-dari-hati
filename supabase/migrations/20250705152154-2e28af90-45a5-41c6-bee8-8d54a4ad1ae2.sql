
-- Perbaiki constraint database untuk menerima payment methods yang benar
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_payment_method_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_payment_method_check 
CHECK (payment_method IN ('cod', 'qris', 'bank_transfer', 'ewallet'));

-- Set default QRIS value untuk testing jika belum ada
INSERT INTO app_settings (setting_key, setting_value, category, created_at, updated_at)
VALUES (
  'payment_qris_value', 
  '"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345"'::jsonb,
  'payment',
  NOW(),
  NOW()
)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = CASE 
    WHEN app_settings.setting_value::text = '""' OR app_settings.setting_value::text = 'null' 
    THEN '"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ID12345678901234567890123456789012345"'::jsonb
    ELSE app_settings.setting_value
  END,
  updated_at = NOW();

-- Pastikan payment_qris_enabled di-set ke true
INSERT INTO app_settings (setting_key, setting_value, category, created_at, updated_at)
VALUES (
  'payment_qris_enabled', 
  'true'::jsonb,
  'payment',
  NOW(),
  NOW()
)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = 'true'::jsonb,
  updated_at = NOW();

-- Set default bank transfer enabled
INSERT INTO app_settings (setting_key, setting_value, category, created_at, updated_at)
VALUES (
  'payment_bank_enabled', 
  'true'::jsonb,
  'payment',
  NOW(),
  NOW()
)
ON CONFLICT (setting_key) DO NOTHING;
