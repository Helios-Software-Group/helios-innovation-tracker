-- Add Buildsoft as a company
INSERT INTO companies (id, name, slug)
VALUES (gen_random_uuid(), 'Buildsoft', 'buildsoft')
ON CONFLICT (slug) DO NOTHING;
