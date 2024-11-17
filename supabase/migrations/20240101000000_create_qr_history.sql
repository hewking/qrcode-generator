-- 删除现有的表和类型
-- DROP VIEW IF EXISTS active_qr_history;
-- DROP TABLE IF EXISTS public.qr_history;
-- DROP TYPE IF EXISTS qr_type;
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for QR code types
CREATE TYPE qr_type AS ENUM ('text', 'url', 'other');

-- Create QR history table
CREATE TABLE IF NOT EXISTS public.qr_history (
    -- Primary key and metadata
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- User identifier (no foreign key constraint)
    user_id TEXT,
    
    -- QR code content
    content TEXT NOT NULL CHECK (length(content) <= 2000),
    title TEXT CHECK (length(title) <= 200),
    type qr_type NOT NULL DEFAULT 'text',
    
    -- Metadata
    is_favorite BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0 NOT NULL CHECK (view_count >= 0),
    last_viewed_at TIMESTAMPTZ,
    
    -- Soft delete
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT content_not_empty CHECK (content <> '')
);

-- Create indexes
CREATE INDEX idx_qr_history_user_id ON public.qr_history(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_qr_history_created_at ON public.qr_history(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_qr_history_type ON public.qr_history(type) WHERE deleted_at IS NULL;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_qr_history_updated_at
    BEFORE UPDATE ON public.qr_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.qr_history ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policy that allows all operations
CREATE POLICY "Enable all operations"
    ON public.qr_history
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create view for active records
CREATE VIEW active_qr_history AS
SELECT *
FROM public.qr_history
WHERE deleted_at IS NULL; 