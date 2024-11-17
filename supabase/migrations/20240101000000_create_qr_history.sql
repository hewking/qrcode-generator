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
    
    -- User reference (nullable for anonymous users)
    user_id UUID REFERENCES auth.users(id),
    
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

-- RLS Policies
ALTER TABLE public.qr_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view their own records (based on session)
CREATE POLICY "Allow anonymous read"
    ON public.qr_history
    FOR SELECT
    USING (
        (auth.role() = 'anon' AND user_id IS NULL)
        OR
        (auth.uid() = user_id)
    );

-- Allow anonymous users to create records
CREATE POLICY "Allow anonymous insert"
    ON public.qr_history
    FOR INSERT
    WITH CHECK (
        (auth.role() = 'anon' AND user_id IS NULL)
        OR
        (auth.uid() = user_id)
    );

-- Allow users to update their own records
CREATE POLICY "Allow user update own records"
    ON public.qr_history
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own records
CREATE POLICY "Allow user delete own records"
    ON public.qr_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.qr_history IS 'Stores QR code generation history for users';
COMMENT ON COLUMN public.qr_history.id IS 'Unique identifier for the history record';
COMMENT ON COLUMN public.qr_history.user_id IS 'Reference to auth.users, null for anonymous users';
COMMENT ON COLUMN public.qr_history.content IS 'The actual content encoded in the QR code';
COMMENT ON COLUMN public.qr_history.title IS 'Optional user-provided title for the QR code';
COMMENT ON COLUMN public.qr_history.type IS 'Type of content: text, url, or other';
COMMENT ON COLUMN public.qr_history.is_favorite IS 'Whether the user has marked this as a favorite';
COMMENT ON COLUMN public.qr_history.view_count IS 'Number of times this QR code has been viewed';
COMMENT ON COLUMN public.qr_history.deleted_at IS 'Soft delete timestamp';

-- Create view for active records
CREATE VIEW active_qr_history AS
SELECT *
FROM public.qr_history
WHERE deleted_at IS NULL; 