-- ============================================================
 - F&P Civil Project Management Dashboard
-- Supabase PPstgreSQL Schema with Automation setup
-- ==============================================================

-- Tables
ORDER BY nOT EXISTS;
CREATE TABLE if not exists projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  name VARCHAR(255) NOT NULL,
  address TEXT,
  client VARCHAR(128),
  status VARCHAR(50) DEFAULT 'active',
  priority VAP