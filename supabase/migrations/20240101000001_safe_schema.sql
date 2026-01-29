-- Safe migration that checks for existing objects
-- Run this in your Supabase SQL editor

-- Create enum types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE opportunity_status AS ENUM ('done', 'in_progress', 'paused', 'planned', 'not_go');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE indicator_status AS ENUM ('green', 'amber', 'red');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE phase_number AS ENUM ('0', '1', '2', '3', '4');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed companies (ignore if already exist)
INSERT INTO companies (name, slug) VALUES
  ('Alessa', 'alessa'),
  ('Alltrust', 'alltrust'),
  ('Cadis', 'cadis'),
  ('Carrus', 'carrus'),
  ('Cott', 'cott'),
  ('Credex', 'credex'),
  ('DCS', 'dcs'),
  ('E-Finances', 'e-finances'),
  ('Finartis', 'finartis'),
  ('Keystone', 'keystone'),
  ('Lilee', 'lilee'),
  ('Monkeysoft', 'monkeysoft'),
  ('Nova', 'nova'),
  ('Polygon', 'polygon')
ON CONFLICT (name) DO NOTHING;

-- Add columns to opportunities table if they don't exist
-- First check if the table exists and add missing columns
DO $$
BEGIN
    -- Add company_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='company_id') THEN
        ALTER TABLE opportunities ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
    END IF;

    -- Add estimated_som if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='estimated_som') THEN
        ALTER TABLE opportunities ADD COLUMN estimated_som DECIMAL(15, 2);
    END IF;

    -- Add som_currency if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='som_currency') THEN
        ALTER TABLE opportunities ADD COLUMN som_currency VARCHAR(3) DEFAULT 'USD';
    END IF;

    -- Add status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='status') THEN
        ALTER TABLE opportunities ADD COLUMN status opportunity_status NOT NULL DEFAULT 'planned';
    END IF;

    -- Add messaging_indicator if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='messaging_indicator') THEN
        ALTER TABLE opportunities ADD COLUMN messaging_indicator indicator_status DEFAULT 'red';
    END IF;

    -- Add campaign_indicator if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='campaign_indicator') THEN
        ALTER TABLE opportunities ADD COLUMN campaign_indicator indicator_status DEFAULT 'red';
    END IF;

    -- Add pricing_indicator if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='pricing_indicator') THEN
        ALTER TABLE opportunities ADD COLUMN pricing_indicator indicator_status DEFAULT 'red';
    END IF;

    -- Add sales_alignment_indicator if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='sales_alignment_indicator') THEN
        ALTER TABLE opportunities ADD COLUMN sales_alignment_indicator indicator_status DEFAULT 'red';
    END IF;

    -- Add next_steps if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='next_steps') THEN
        ALTER TABLE opportunities ADD COLUMN next_steps TEXT;
    END IF;

    -- Add target_date if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='target_date') THEN
        ALTER TABLE opportunities ADD COLUMN target_date DATE;
    END IF;

    -- Add phase if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='phase') THEN
        ALTER TABLE opportunities ADD COLUMN phase phase_number NOT NULL DEFAULT '0';
    END IF;

    -- Add sort_order if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='sort_order') THEN
        ALTER TABLE opportunities ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;

    -- Add name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='name') THEN
        ALTER TABLE opportunities ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT '';
    END IF;

    -- Add description if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='description') THEN
        ALTER TABLE opportunities ADD COLUMN description TEXT;
    END IF;

    -- Add created_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='created_at') THEN
        ALTER TABLE opportunities ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='opportunities' AND column_name='updated_at') THEN
        ALTER TABLE opportunities ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create indexes (ignore if already exist)
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_phase ON opportunities(phase);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_target_date ON opportunities(target_date);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS opportunities_updated_at ON opportunities;
CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON companies;
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Opportunities are viewable by authenticated users" ON opportunities;
CREATE POLICY "Opportunities are viewable by authenticated users"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Opportunities are insertable by authenticated users" ON opportunities;
CREATE POLICY "Opportunities are insertable by authenticated users"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Opportunities are updatable by authenticated users" ON opportunities;
CREATE POLICY "Opportunities are updatable by authenticated users"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Opportunities are deletable by authenticated users" ON opportunities;
CREATE POLICY "Opportunities are deletable by authenticated users"
  ON opportunities FOR DELETE
  TO authenticated
  USING (true);
