-- Database Migration: Update workers_verification_status_check constraint
-- Ensures PostgreSQL workers table constraint permits 'ID_VERIFIED'

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
