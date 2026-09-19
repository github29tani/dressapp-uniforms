-- Add object_fit column to product_images table
-- This allows storing how each image should be displayed (cover or contain)

-- Add the column with default value 'cover'
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS object_fit TEXT DEFAULT 'cover' CHECK (object_fit IN ('cover', 'contain'));

-- Update existing records to use 'cover' (which was the previous behavior)
UPDATE product_images 
SET object_fit = 'cover' 
WHERE object_fit IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE product_images 
ALTER COLUMN object_fit SET NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN product_images.object_fit IS 'How the image should fit in its container: cover (fill frame, may crop) or contain (show full image, may have gaps)';
