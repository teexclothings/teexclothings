-- Add mobile banner support to hero_banners table
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS mobile_media_url text;
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS mobile_media_type text DEFAULT 'image';
