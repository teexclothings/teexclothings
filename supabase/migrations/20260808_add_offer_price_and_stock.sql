-- Migration: Rename price to original_price, add selling_price and is_out_of_stock to products table
-- Runs idempotently on Supabase PostgreSQL

DO $$ 
BEGIN
  -- Rename price to original_price if price column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price') THEN
    ALTER TABLE public.products RENAME COLUMN price TO original_price;
  END IF;
END $$;

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS selling_price NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE;

-- Comments for database documentation
COMMENT ON COLUMN public.products.original_price IS 'Original retail strikethrough price of the product';
COMMENT ON COLUMN public.products.selling_price IS 'Selling offer price of the product (if set, lower than original price)';
COMMENT ON COLUMN public.products.is_out_of_stock IS 'Flag indicating if the product is out of stock';


