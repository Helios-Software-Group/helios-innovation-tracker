-- Create enum types
CREATE TYPE opportunity_status AS ENUM (
  'done',
  'in_progress',
  'paused',
  'planned',
  'not_go'
);

CREATE TYPE indicator_status AS ENUM (
  'green',
  'amber',
  'red'
);

CREATE TYPE phase_number AS ENUM (
  '0', '1', '2', '3', '4'
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed companies (alphabetical)
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
  ('Polygon', 'polygon');

-- Opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_som DECIMAL(15, 2),
  som_currency VARCHAR(3) DEFAULT 'USD',
  status opportunity_status NOT NULL DEFAULT 'planned',
  messaging_indicator indicator_status DEFAULT 'red',
  campaign_indicator indicator_status DEFAULT 'red',
  pricing_indicator indicator_status DEFAULT 'red',
  sales_alignment_indicator indicator_status DEFAULT 'red',
  next_steps TEXT,
  target_date DATE,
  phase phase_number NOT NULL DEFAULT '0',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_phase ON opportunities(phase);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_target_date ON opportunities(target_date);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies (viewable by all authenticated users)
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for opportunities (full CRUD for authenticated users)
CREATE POLICY "Opportunities are viewable by authenticated users"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Opportunities are insertable by authenticated users"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Opportunities are updatable by authenticated users"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Opportunities are deletable by authenticated users"
  ON opportunities FOR DELETE
  TO authenticated
  USING (true);
