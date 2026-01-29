-- Seed sample opportunities data
-- Run this after the schema migration

-- Get company IDs for reference
WITH company_ids AS (
  SELECT id, name FROM companies
)
INSERT INTO opportunities (company_id, name, description, estimated_som, status, messaging_indicator, campaign_indicator, pricing_indicator, sales_alignment_indicator, next_steps, target_date, phase)
SELECT
  c.id,
  o.name,
  o.description,
  o.estimated_som,
  o.status::opportunity_status,
  o.messaging_indicator::indicator_status,
  o.campaign_indicator::indicator_status,
  o.pricing_indicator::indicator_status,
  o.sales_alignment_indicator::indicator_status,
  o.next_steps,
  o.target_date::date,
  o.phase::phase_number
FROM (
  VALUES
    -- Phase 0: Identification & Assessment
    ('Cott', 'E-Forms', 'For County Administrators, Clerks, and County offices who want to convert their paper forms to digital forms available on their websites. Digital forms that is flexible enough to accommodate all custom processes.', NULL, 'planned', 'red', 'red', 'red', 'red', 'Determine if we can build a AI scalable version quickly (2wk)', NULL, '0'),
    ('Keystone', 'Database API', 'For enabling Keystone customers to connect their ERP to external systems for data visualizations, Analysis, and AI Connectivity', NULL, 'planned', 'red', 'red', 'red', 'red', 'Determine if we can build a AI Budget Planning feature.', NULL, '0'),

    -- Phase 1: Discovery/PoC Light
    ('Cott', 'Competitive Intel', 'For internal uses and product use to analyze competitor presence in county offices, budget approvals timelines, budget allocation', NULL, 'in_progress', 'amber', 'red', 'red', 'red', 'Implement a focused set of initiatives lines up with an increase in AI DMS demand generation', NULL, '1'),

    -- Phase 2: Proof-of-Concept
    ('Cott', 'AI DMS', 'For other departments in Counties who need a DMS system for file search, but do not need strict confidence in results. This product would forward and filtered results or batches of docs.', 350000, 'in_progress', 'green', 'amber', 'amber', 'amber', 'Determine: On Demo with existing sales reps (end Oct/early Nov)', '2026-02-15', '2'),
    ('Cott', 'SmartIndex 2.0', 'For new and existing land records offices that need high-accuracy indexing of their documents. This product integrates directly with GS and KI systems, and can act as an external vendor.', 350000, 'in_progress', 'green', 'green', 'amber', 'green', 'Summarized: Finalize rollout plan to begin promoting rollouts. Engage 150,000 images in 12 months', '2026-01-20', '2'),
    ('Keystone', 'AP Invoice Import', 'For accounting teams needing to digitize vendor invoice stored in PDS. Tool that extracts data from PDF invoices and converts them into structured CSV or Excel format.', 128000, 'planned', 'amber', 'red', 'red', 'red', 'Identify beta customer for rapid pilot', '2026-01-31', '2'),

    -- Phase 3: MVP Pilot
    ('Cott', 'AI DMS v2', 'Enhanced version with better accuracy and expanded county coverage', 500000, 'in_progress', 'green', 'green', 'green', 'amber', 'Pilot deployment at 3 county offices', '2026-03-01', '3'),
    ('Keystone', 'Smart Budget', 'AI-powered budget forecasting for municipal finance', 275000, 'planned', 'amber', 'amber', 'red', 'red', 'Define MVP scope with pilot customers', '2026-04-15', '3'),

    -- Phase 4: Full Operational Deployment
    ('Cott', 'TeamSupport KB AI', 'For internal support teams managing knowledge base content in TeamSupport, Knowledge Base article generator', NULL, 'done', 'green', 'green', 'green', 'green', 'Monitor performance metrics; plan phase 2 rollout', NULL, '4')
) AS o(company_name, name, description, estimated_som, status, messaging_indicator, campaign_indicator, pricing_indicator, sales_alignment_indicator, next_steps, target_date, phase)
JOIN company_ids c ON c.name = o.company_name;
