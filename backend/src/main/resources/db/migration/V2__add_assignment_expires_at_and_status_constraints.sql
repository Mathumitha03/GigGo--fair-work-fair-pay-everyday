-- Database Migration: Add expires_at to assignments table and status indexes
-- Ensures the 30-second sequential offer timeout timestamp is persisted for restart recovery

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assignments' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE assignments ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create indexes for fast lookup of active/expired offers
CREATE INDEX IF NOT EXISTS idx_assignments_expires ON assignments (expires_at);
CREATE INDEX IF NOT EXISTS idx_assignments_status_expires ON assignments (status, expires_at);
