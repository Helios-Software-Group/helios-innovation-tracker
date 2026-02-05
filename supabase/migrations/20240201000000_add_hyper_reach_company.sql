-- Add Hyper-Reach as a company
INSERT INTO companies (id, name, slug)
VALUES (gen_random_uuid(), 'Hyper-Reach', 'hyper-reach')
ON CONFLICT (slug) DO NOTHING;
