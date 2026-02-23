
-- ============================================================================
-- MATRIXC FIND ME - LOG TABLOSU OLUŞTURMA SCRIPTI (DÜZELTİLMİŞ VERSİYON)
-- ============================================================================
-- Bu scripti Supabase SQL Editor alanında çalıştırarak tabloyu oluşturun ve izinleri verin.

CREATE TABLE IF NOT EXISTS "QR_Logs" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Hangi QR Kodun okutulduğu
    "qr_code" TEXT NOT NULL,
    
    -- Tarama Zamanı (Otomatik)
    "scanned_at" TIMESTAMPTZ DEFAULT NOW(),
    
    -- IP Adresi (İzinsiz alınabilir - dış servis ile)
    "ip_address" TEXT,
    
    -- Tarayıcı ve Cihaz Bilgileri (İzinsiz alınabilir)
    "user_agent" TEXT,         -- Örn: Mozilla/5.0 (iPhone; CPU iPhone OS 14...)
    "device_info" JSONB,       -- Örn: { "platform": "iOS", "language": "tr-TR", "screen": "390x844" }
    
    -- Konum Bilgisi (İzin Gerektirir)
    -- İzin verilmezse NULL olarak kaydedilir.
    "location" JSONB,          -- Örn: { "lat": 41.0082, "lng": 28.9784, "accuracy": 15 }
    
    -- Kullanıcının konum izni verip vermediği
    "consent_given" BOOLEAN DEFAULT FALSE
);

-- RLS'yi aç (Eğer kapalıysa)
ALTER TABLE "QR_Logs" ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (Çakışmayı önlemek için)
DROP POLICY IF EXISTS "Public Insert" ON "QR_Logs";
DROP POLICY IF EXISTS "Herkes log atabilir" ON "QR_Logs";
DROP POLICY IF EXISTS "Public Read" ON "QR_Logs";

-- 1. KRİTİK ADIM: Herkesin (Anonim dahil) log EKLEMESİNE izin ver
CREATE POLICY "Public Insert"
ON "QR_Logs"
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Sahiplerin logları GÖRMESİNE izin ver (Gerekirse 'auth.uid()' ile kısıtlanabilir ama şimdilik public)
CREATE POLICY "Public Read"
ON "QR_Logs"
FOR SELECT
TO public
USING (true);
