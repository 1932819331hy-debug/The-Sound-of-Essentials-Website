-- ==============================================================================
-- Sound of Essentials (SOE) - Comprehensive CRM Schema
-- ==============================================================================

-- 1. Contacts / 360 Customer Directory
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL DEFAULT 'Rhythm Explorer',
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    phone VARCHAR(50),
    organization VARCHAR(255),
    persona VARCHAR(50) NOT NULL DEFAULT 'parent' CHECK (persona IN ('parent', 'educator', 'institution', 'ally', 'creator')),
    lifecycle_stage VARCHAR(50) NOT NULL DEFAULT 'lead' CHECK (lifecycle_stage IN ('subscriber', 'lead', 'opportunity', 'customer', 'champion', 'churned')),
    total_orders INT DEFAULT 0,
    total_spend NUMERIC(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    lead_score INT DEFAULT 10,
    tags JSONB DEFAULT '[]'::jsonb,
    source_path VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    location VARCHAR(120),
    last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_persona ON crm_contacts(persona);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_stage ON crm_contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_spend ON crm_contacts(total_spend DESC);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_created_at ON crm_contacts(created_at DESC);

-- 2. Deals / Opportunities Pipeline
CREATE TABLE IF NOT EXISTS crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'new_lead' CHECK (stage IN ('new_lead', 'album_unlocked', 'workbook_prospect', 'school_pilot', 'negotiation', 'closed_won', 'closed_lost')),
    deal_value NUMERIC(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    probability INT DEFAULT 20 CHECK (probability BETWEEN 0 AND 100),
    expected_close_date DATE,
    assigned_to VARCHAR(100) DEFAULT 'Founder',
    tags JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_value ON crm_deals(deal_value DESC);

-- 3. Chronological Customer Activity Stream
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('album_unlock', 'form_submit', 'shopify_order', 'stripe_order', 'stripe_checkout', 'quest_milestone', 'admin_note', 'note', 'email_sent', 'email_outreach', 'call_log', 'call', 'meeting', 'task_complete')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_type ON crm_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON crm_activities(created_at DESC);

-- 4. Tasks & Follow-ups
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to VARCHAR(100) DEFAULT 'Founder',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due ON crm_tasks(due_date);

-- 5. Contact Notes
CREATE TABLE IF NOT EXISTS crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
    author VARCHAR(100) DEFAULT 'Staff',
    content TEXT NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_notes_contact ON crm_notes(contact_id);
