-- ===================================================================
-- Worker Verification Status Constraint Update
-- Ensures the PostgreSQL workers_verification_status_check constraint
-- allows 'ID_VERIFIED' in addition to existing statuses.
-- ===================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'workers_verification_status_check'
    ) THEN
        ALTER TABLE workers DROP CONSTRAINT workers_verification_status_check;
    END IF;
END $$;

ALTER TABLE workers ADD CONSTRAINT workers_verification_status_check
    CHECK (verification_status IN ('UNVERIFIED', 'ID_VERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'));

-- ===================================================================
-- Sequential Worker Assignment State Machine Support
-- Ensures assignments table has expires_at column and lookup indexes
-- ===================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assignments' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE assignments ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_assignments_expires ON assignments (expires_at);
CREATE INDEX IF NOT EXISTS idx_assignments_status_expires ON assignments (status, expires_at);
