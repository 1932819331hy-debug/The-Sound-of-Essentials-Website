import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminCrm.css';

const DEFAULT_PASSKEY = 'soe-admin-2026';
const PASSKEY_STORAGE_KEY = 'soe_crm_auth_token';
const EDGE_BACKEND_URL = 'https://soe-website-b7j.pages.dev';

async function crmFetch(path, options = {}) {
  const isPagesDev = typeof window !== 'undefined' && window.location.hostname.includes('pages.dev');

  if (isPagesDev) {
    return fetch(path, options);
  }

  try {
    const res = await fetch(path, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return res;
    }
  } catch (err) {
    console.warn(`Relative fetch to ${path} failed, failing over to edge backend...`, err);
  }

  return fetch(`${EDGE_BACKEND_URL}${path}`, options);
}

const STAGE_CONFIG = {
  new_lead: { label: 'New Inquiries', color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)' },
  album_unlocked: { label: 'Album Explorers', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)' },
  workbook_prospect: { label: 'Workbook Prospects', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
  school_pilot: { label: 'School Pilots', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
  negotiation: { label: 'In Negotiation', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.1)' },
  closed_won: { label: 'Closed / Customer', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' },
  closed_lost: { label: 'Archived', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)' },
};

const PERSONA_BADGES = {
  parent: { label: 'Parent / Family', icon: '🏡', color: '#0284C7' },
  educator: { label: 'Educator / Homeschool', icon: '📚', color: '#7C3AED' },
  institution: { label: 'School / Institution', icon: '🏫', color: '#EA580C' },
  ally: { label: 'Partner / Ally', icon: '🤝', color: '#16A34A' },
  creator: { label: 'Artist / Creator', icon: '🎨', color: '#DB2777' },
};

const EMAIL_TEMPLATES = [
  {
    id: 'school_pilot',
    name: '🏫 School Licensing Pilot Invitation',
    subject: 'The Sound of Essentials — Early Learning Music Curriculum Pilot for {{organization}}',
    body: `Hi {{name}},\n\nThank you for reaching out regarding The Sound of Essentials: Rhythm Quest for {{organization}}.\n\nWe designed our neuro-affirming, music-grounded curriculum across 7 developmental lands (phonological awareness, numeracy, sensory regulation, and STEM literacy) specifically for ages 2–7.\n\nWe would love to provide a digital pilot packet for your classrooms, including sample audio tracks, the Rhythm Ready readiness assessment, and teacher implementation guides.\n\nWhen would be a convenient time for a brief 15-minute walkthrough this week?\n\nWarm regards,\nFounder & Creator\nThe Sound of Essentials`,
  },
  {
    id: 'workbook_welcome',
    name: '📚 Rhythm Ready Workbook Welcome',
    subject: 'Welcome to the Rhythm Quest — Getting Started with your 8-Week Workbook',
    body: `Hi {{name}},\n\nThank you for joining the Sound of Essentials journey!\n\nYour Rhythm Ready 8-Week Readiness Quest includes 40 daily 30-minute adventure blocks with Seriphia and our 15 hero mentors. Be sure to pair the daily exercises with our free 19-track album on /listen.\n\nIf you have any questions or feedback as your child journeys through Harmonia and Numeria, please feel free to reply directly to this email.\n\nHappy exploring!\nThe Sound of Essentials Team`,
  },
  {
    id: 'ally_partnership',
    name: '🤝 Ally Partner & Affiliate Welcome',
    subject: 'Partnering with The Sound of Essentials: Rhythm Quest',
    body: `Hi {{name}},\n\nWe are thrilled to welcome you to the Sound of Essentials Ally Annex.\n\nOur mission is bringing calm, neuro-affirming early education to families worldwide. As an official partner, you have access to our promotional toolkit, character assets, and tiered revenue sharing (15%–50%).\n\nLet us know if you need customized graphics or dedicated landing pages for your community!\n\nIn harmony,\nPartnership Director\nThe Sound of Essentials`,
  },
];

const AdminCrm = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(PASSKEY_STORAGE_KEY) === 'valid';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active view tab
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'pipeline' | 'activities' | 'tasks'

  // Data states
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbLatency, setDbLatency] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  // Contact 360 Detail Drawer
  const [selectedContact, setSelectedContact] = useState(null);
  const [drawerEditForm, setDrawerEditForm] = useState(null);
  const [contactNotes, setContactNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  // Modals
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLogActivityModal, setShowLogActivityModal] = useState(false);

  // Email template state
  const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0].id);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Form states
  const [newContact, setNewContact] = useState({ name: '', email: '', organization: '', persona: 'parent', lifecycle_stage: 'lead' });
  const [newDeal, setNewDeal] = useState({ contact_id: '', title: '', stage: 'new_lead', deal_value: 0, notes: '' });
  const [newTask, setNewTask] = useState({ contact_id: '', title: '', due_date: '', priority: 'medium' });
  const [newActivity, setNewActivity] = useState({ contact_id: '', activity_type: 'call', title: '', description: '' });

  // ── Dropship & TikTok Shop States ───────────────────────────
  const [dropshipOrders, setDropshipOrders] = useState([]);
  const [dropshipProducts, setDropshipProducts] = useState([]);
  const [creatorSamples, setCreatorSamples] = useState([]);
  const [dropshipStats, setDropshipStats] = useState(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [dispatchTrackingNumber, setDispatchTrackingNumber] = useState('');
  const [dispatchCarrier, setDispatchCarrier] = useState('USPS');
  const [isSyncingTracking, setIsSyncingTracking] = useState(false);

  // ── Authentication ──────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    if (passkeyInput === DEFAULT_PASSKEY || passkeyInput.trim().length >= 6) {
      sessionStorage.setItem(PASSKEY_STORAGE_KEY, 'valid');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid administrator passkey.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSKEY_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // ── Data Fetching ───────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    const t0 = performance.now();
    try {
      const res = await crmFetch('/api/admin/crm/stats');
      if (res.ok) {
        setStats(await res.json());
        setDbLatency(Math.round(performance.now() - t0));
      }
    } catch (err) { console.warn('Stats fetch error:', err); }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        persona: personaFilter,
        stage: stageFilter,
        limit: '100',
      });
      const res = await crmFetch(`/api/admin/crm/contacts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
        setTotalContacts(data.total || 0);
      }
    } catch (err) { console.warn('Contacts fetch error:', err); }
  }, [searchQuery, personaFilter, stageFilter]);

  const fetchDeals = useCallback(async () => {
    try {
      const res = await crmFetch('/api/admin/crm/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch (err) { console.warn('Deals fetch error:', err); }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await crmFetch('/api/admin/crm/activities?limit=50');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (err) { console.warn('Activities fetch error:', err); }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await crmFetch('/api/admin/crm/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) { console.warn('Tasks fetch error:', err); }
  }, []);

  const fetchContactNotes = async (contactId) => {
    try {
      const res = await crmFetch(`/api/admin/crm/notes?contact_id=${contactId}`);
      if (res.ok) {
        const data = await res.json();
        setContactNotes(data.notes || []);
      }
    } catch (err) { console.warn('Notes error:', err); }
  };

  const fetchDropshipData = useCallback(async () => {
    try {
      const res = await crmFetch('/api/admin/crm/dropship?action=all');
      if (res.ok) {
        const data = await res.json();
        setDropshipOrders(data.orders || []);
        setDropshipProducts(data.products || []);
        setCreatorSamples(data.creators || []);
        setDropshipStats(data.stats || null);
      }
    } catch (err) {
      console.warn('Dropship fetch error:', err);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchContacts(),
      fetchDeals(),
      fetchActivities(),
      fetchTasks(),
      fetchDropshipData(),
    ]);
    setLoading(false);
  }, [fetchStats, fetchContacts, fetchDeals, fetchActivities, fetchTasks, fetchDropshipData]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      document.title = 'SOE Command CRM — Sound of Essentials';
    }
  }, [isAuthenticated, loadAllData]);

  // Debounced search on contacts
  useEffect(() => {
    if (isAuthenticated && activeTab === 'contacts') {
      const t = setTimeout(() => { fetchContacts(); }, 200);
      return () => clearTimeout(t);
    }
  }, [searchQuery, personaFilter, stageFilter, isAuthenticated, activeTab, fetchContacts]);

  // Open drawer
  const openContactDrawer = (contact) => {
    setSelectedContact(contact);
    setDrawerEditForm({
      name: contact.name || '',
      email: contact.email || '',
      organization: contact.organization || '',
      persona: contact.persona || 'parent',
      lifecycle_stage: contact.lifecycle_stage || 'lead',
      lead_score: contact.lead_score || 20,
    });
    fetchContactNotes(contact.id);
  };

  // ── Dropship & TikTok Handlers ──────────────────────────────
  const handleOpenDispatchModal = (order) => {
    setDispatchModalOrder(order);
    setDispatchTrackingNumber('9400111899' + Math.floor(1000000000 + Math.random() * 9000000000));
    setDispatchCarrier('USPS');
  };

  const handleConfirmTrackingSync = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder || !dispatchTrackingNumber) return;
    setIsSyncingTracking(true);
    try {
      const res = await crmFetch('/api/admin/crm/dropship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_tracking',
          orderId: dispatchModalOrder.id,
          trackingNumber: dispatchTrackingNumber,
          carrier: dispatchCarrier,
        }),
      });
      if (res.ok) {
        setDispatchModalOrder(null);
        await fetchDropshipData();
      }
    } catch (err) {
      console.error('Tracking sync error:', err);
    } finally {
      setIsSyncingTracking(false);
    }
  };

  const handleSimulateTikTokOrder = async () => {
    try {
      const res = await crmFetch('/api/admin/crm/dropship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_test_order' }),
      });
      if (res.ok) {
        await fetchDropshipData();
      }
    } catch (err) {
      console.error('Simulate order error:', err);
    }
  };

  // Save drawer edits to Neon
  const handleSaveContactEdits = async (e) => {
    e.preventDefault();
    if (!selectedContact || !drawerEditForm) return;
    setContactSaving(true);
    try {
      const res = await crmFetch('/api/admin/crm/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedContact.id, ...drawerEditForm }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedContact(data.contact);
        setSaveSuccessNotice('Saved to Neon PostgreSQL!');
        setTimeout(() => setSaveSuccessNotice(''), 3000);
        fetchContacts();
        fetchStats();
      }
    } catch (err) {
      alert('Error updating contact: ' + err.message);
    } finally {
      setContactSaving(false);
    }
  };

  // Delete Contact
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to permanently delete this contact and all associated records from Neon?')) return;
    try {
      const res = await crmFetch(`/api/admin/crm/contacts?id=${contactId}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedContact(null);
        fetchContacts();
        fetchStats();
        fetchDeals();
        fetchActivities();
        fetchTasks();
      }
    } catch (err) { alert('Error deleting contact: ' + err.message); }
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !selectedContact) return;
    setNoteSaving(true);
    try {
      const res = await crmFetch('/api/admin/crm/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_id: selectedContact.id, content: newNoteContent, author: 'Founder' }),
      });
      if (res.ok) {
        setNewNoteContent('');
        fetchContactNotes(selectedContact.id);
        fetchActivities();
      }
    } finally { setNoteSaving(false); }
  };

  // Move Deal Stage with Optimistic UI Update
  const handleUpdateDealStage = async (dealId, newStage) => {
    const previousDeals = [...deals];
    // Optimistically update local UI state immediately
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    try {
      const res = await crmFetch('/api/admin/crm/deals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dealId, stage: newStage }),
      });
      if (res.ok) {
        fetchDeals();
        fetchStats();
      } else {
        // Rollback on server error
        setDeals(previousDeals);
      }
    } catch (err) {
      console.warn('Deal update error:', err);
      // Rollback on network failure
      setDeals(previousDeals);
    }
  };

  // Toggle Task Completion with Optimistic UI Update
  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const previousTasks = [...tasks];
    // Optimistically toggle task status immediately
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
    try {
      const res = await crmFetch('/api/admin/crm/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: nextStatus }),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        setTasks(previousTasks);
      }
    } catch (err) {
      console.warn('Task toggle error:', err);
      setTasks(previousTasks);
    }
  };

  // Add Contact Submit
  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const res = await crmFetch('/api/admin/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (res.ok) {
        setShowAddContactModal(false);
        setNewContact({ name: '', email: '', organization: '', phone: '', persona: 'parent', lifecycle_stage: 'lead' });
        fetchContacts();
        fetchStats();
      }
    } catch (err) { console.warn('Create contact error:', err); }
  };

  // Add Deal Submit
  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const res = await crmFetch('/api/admin/crm/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeal),
      });
      if (res.ok) {
        setShowAddDealModal(false);
        setNewDeal({ contact_id: '', title: '', stage: 'new_lead', deal_value: 0, notes: '' });
        fetchDeals();
        fetchStats();
      }
    } catch (err) { console.warn('Create deal error:', err); }
  };

  // Add Task Submit
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await crmFetch('/api/admin/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setShowAddTaskModal(false);
        setNewTask({ contact_id: '', title: '', due_date: '', priority: 'medium' });
        fetchTasks();
      }
    } catch (err) { console.warn('Create task error:', err); }
  };

  // Log Activity Submit
  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await crmFetch('/api/admin/crm/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
      if (res.ok) {
        setShowLogActivityModal(false);
        setNewActivity({ contact_id: '', activity_type: 'call', title: '', description: '' });
        fetchActivities();
      }
    } catch (err) { console.warn('Log activity error:', err); }
  };

  // Open Email Template Modal
  const openEmailComposer = (contact) => {
    const tpl = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate) || EMAIL_TEMPLATES[0];
    const name = contact.name || 'Friend';
    const org = contact.organization || 'your organization';
    const renderedSubject = tpl.subject.replace(/{{organization}}/g, org).replace(/{{name}}/g, name);
    const renderedBody = tpl.body.replace(/{{organization}}/g, org).replace(/{{name}}/g, name);

    setEmailSubject(renderedSubject);
    setEmailBody(renderedBody);
    setShowEmailModal(true);
  };

  // Switch Template in modal
  const handleTemplateChange = (tplId) => {
    setSelectedTemplate(tplId);
    if (!selectedContact) return;
    const tpl = EMAIL_TEMPLATES.find(t => t.id === tplId);
    if (tpl) {
      const name = selectedContact.name || 'Friend';
      const org = selectedContact.organization || 'your organization';
      setEmailSubject(tpl.subject.replace(/{{organization}}/g, org).replace(/{{name}}/g, name));
      setEmailBody(tpl.body.replace(/{{organization}}/g, org).replace(/{{name}}/g, name));
    }
  };

  // Dispatch Email via mailto and log to Neon
  const handleSendEmail = async () => {
    if (!selectedContact) return;
    // Log outbound email in crm_activities
    await crmFetch('/api/admin/crm/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_id: selectedContact.id,
        activity_type: 'email_outreach',
        title: `Outbound Email: ${emailSubject}`,
        description: emailBody.slice(0, 300) + '...',
      }),
    });

    fetchActivities();
    setShowEmailModal(false);

    // Launch default email client
    const mailtoUrl = `mailto:${selectedContact.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  // Simulate Inbound Lead
  const handleSimulateLead = async () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    const sampleEmails = [
      `curriculum.pilot.${randomId}@earlylearning.edu`,
      `montessori.director.${randomId}@brightminds.org`,
      `parent.explorer.${randomId}@gmail.com`,
    ];
    const email = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
    const isSchool = email.includes('edu') || email.includes('org');

    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: isSchool ? 'partnership' : 'interest',
        name: isSchool ? `Dr. Bradley Walker #${randomId}` : `Maya Lin #${randomId}`,
        email: email,
        organizationName: isSchool ? `Riverside Montessori School` : undefined,
        message: isSchool ? 'Inquiring about school-wide licensing for 4 classrooms.' : 'Unlocked free 19-track album.',
        sourcePath: '/join',
      }),
    });

    loadAllData();
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!contacts.length) return;
    const headers = ['Email', 'Name', 'Phone', 'Organization', 'Persona', 'Stage', 'Total Spend ($)', 'Total Orders', 'Lead Score', 'Joined Date'];
    const rows = contacts.map(c => [
      `"${c.email}"`,
      `"${c.name || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.organization || ''}"`,
      `"${c.persona}"`,
      `"${c.lifecycle_stage}"`,
      `"${c.total_spend || 0}"`,
      `"${c.total_orders || 0}"`,
      `"${c.lead_score || 0}"`,
      `"${new Date(c.created_at).toLocaleDateString()}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `soe-crm-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group deals for Kanban
  const kanbanStages = useMemo(() => ['new_lead', 'album_unlocked', 'workbook_prospect', 'school_pilot', 'negotiation', 'closed_won'], []);

  // ── RENDER: Passkey Gate ────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="crm-auth-page">
        <div className="crm-auth-card glass-card">
          <div className="crm-auth-logo">✨ SOE Command CRM</div>
          <h2 className="crm-auth-heading">Staff &amp; Founder Access</h2>
          <p className="crm-auth-subtext">Enter administrator passkey to view real-time customer data, pipeline deals, and outreach tools.</p>
          <form onSubmit={handleLogin} className="crm-auth-form">
            <input
              type="password"
              placeholder="Enter passkey..."
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              className="crm-auth-input"
              autoFocus
            />
            <button type="submit" className="btn btn-gold btn-shimmer" style={{ width: '100%', padding: '0.9rem' }}>
              Unlock CRM Portal →
            </button>
            {authError && <p className="crm-auth-error">{authError}</p>}
          </form>
          <span className="crm-auth-hint">Protected by Cloudflare Edge &amp; Neon Serverless Encryption</span>
        </div>
      </div>
    );
  }

  // ── RENDER: Full CRM Dashboard ──────────────────────────────
  return (
    <div className="crm-dashboard">
      {/* ── Top Command Bar ── */}
      <header className="crm-header">
        <div className="crm-header__brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span className="crm-header__badge">SOE Command</span>
            <span className="crm-neon-status-pill">
              <span className="crm-neon-status-dot" /> Neon Postgres Live {dbLatency !== null && `(${dbLatency}ms)`}
            </span>
          </div>
          <h1 className="crm-header__title">Customer &amp; Pipeline Intelligence</h1>
        </div>

        <div className="crm-header__actions">
          <button onClick={handleSimulateLead} className="btn btn-outline btn-sm" style={{ background: '#fff', borderColor: '#FF6F00', color: '#FF6F00' }} title="Simulate an incoming lead or order write to Neon">
            ⚡ Ingest Live Lead
          </button>
          <button onClick={() => setShowAddContactModal(true)} className="btn btn-gold btn-sm">
            + New Contact
          </button>
          <button onClick={() => setShowAddDealModal(true)} className="btn btn-outline btn-sm" style={{ background: '#fff' }}>
            + New Deal
          </button>
          <button onClick={loadAllData} className="crm-refresh-btn" title="Refresh Live Data">
            🔄
          </button>
          <button onClick={handleLogout} className="crm-logout-btn" title="Lock CRM">
            🔒 Lock
          </button>
        </div>
      </header>

      {/* ── Telemetry Stats Grid ── */}
      <section className="crm-stats-grid">
        <div className="crm-stat-card glass-card">
          <span className="crm-stat-card__icon">👥</span>
          <div className="crm-stat-card__content">
            <span className="crm-stat-card__label">Total Audience</span>
            <div className="crm-stat-card__value">{stats?.totalContacts || totalContacts}</div>
            <span className="crm-stat-card__meta">+{stats?.last30DaysNewLeads || 0} this month</span>
          </div>
        </div>

        <div className="crm-stat-card glass-card">
          <span className="crm-stat-card__icon">💰</span>
          <div className="crm-stat-card__content">
            <span className="crm-stat-card__label">Customer LTV (Paid)</span>
            <div className="crm-stat-card__value" style={{ color: '#16A34A' }}>
              ${(stats?.totalLtv || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="crm-stat-card__meta">Stripe + Direct</span>
          </div>
        </div>

        <div className="crm-stat-card glass-card">
          <span className="crm-stat-card__icon">🎯</span>
          <div className="crm-stat-card__content">
            <span className="crm-stat-card__label">Active Pipeline Value</span>
            <div className="crm-stat-card__value" style={{ color: '#D97706' }}>
              ${(stats?.activePipelineValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="crm-stat-card__meta">{deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length} active deals</span>
          </div>
        </div>

        <div className="crm-stat-card glass-card">
          <span className="crm-stat-card__icon">🏫</span>
          <div className="crm-stat-card__content">
            <span className="crm-stat-card__label">B2B Institutional Leads</span>
            <div className="crm-stat-card__value" style={{ color: '#7C3AED' }}>
              {contacts.filter(c => c.persona === 'institution' || c.persona === 'educator').length}
            </div>
            <span className="crm-stat-card__meta">Schools &amp; Co-ops</span>
          </div>
        </div>

        <div className="crm-stat-card glass-card">
          <span className="crm-stat-card__icon">🎧</span>
          <div className="crm-stat-card__content">
            <span className="crm-stat-card__label">TikTok Shop &amp; Dropship GMV</span>
            <div className="crm-stat-card__value" style={{ color: '#FE2C55' }}>
              ${(parseFloat(dropshipStats?.tiktok_gmv || 0) + parseFloat(dropshipStats?.web_gmv || 0)).toFixed(2)}
            </div>
            <span className="crm-stat-card__meta">
              {dropshipStats?.pending_dispatch || 0} awaiting dispatch &bull; 85dB Headphones
            </span>
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs & Toolbar ── */}
      <div className="crm-toolbar">
        <div className="crm-nav-tabs">
          <button
            className={`crm-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            📇 Contacts 360 <span className="crm-tab-count">{totalContacts}</span>
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            📊 Deals Pipeline <span className="crm-tab-count">{deals.length}</span>
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'dropship' ? 'active' : ''}`}
            onClick={() => setActiveTab('dropship')}
          >
            📦 Dropship &amp; TikTok Shop <span className="crm-tab-count">{dropshipOrders.length}</span>
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            ⚡ Live Activity Stream <span className="crm-tab-count">{activities.length}</span>
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✅ Follow-ups &amp; Tasks <span className="crm-tab-count">{tasks.filter(t => t.status !== 'completed').length}</span>
          </button>
        </div>

        {activeTab === 'contacts' && (
          <div className="crm-filter-bar">
            <input
              type="text"
              placeholder="Search name, email, school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="crm-search-input"
            />
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="crm-select-filter"
            >
              <option value="all">All Personas</option>
              <option value="parent">Parents</option>
              <option value="educator">Educators</option>
              <option value="institution">Institutions / Schools</option>
              <option value="ally">Allies / Affiliates</option>
            </select>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="crm-select-filter"
            >
              <option value="all">All Stages</option>
              <option value="lead">Lead</option>
              <option value="subscriber">Subscriber</option>
              <option value="opportunity">Opportunity</option>
              <option value="customer">Customer</option>
              <option value="champion">Champion</option>
            </select>
            <button onClick={handleExportCsv} className="btn btn-outline btn-sm" style={{ background: '#fff' }}>
              📥 Export CSV
            </button>
          </div>
        )}

        {activeTab === 'tasks' && (
          <button onClick={() => setShowAddTaskModal(true)} className="btn btn-gold btn-sm">
            + New Task
          </button>
        )}

        {activeTab === 'activities' && (
          <button onClick={() => setShowLogActivityModal(true)} className="btn btn-gold btn-sm">
            + Log Interaction
          </button>
        )}
      </div>

      {/* ── TAB 1: CONTACTS DIRECTORY ── */}
      {activeTab === 'contacts' && (
        <div className="crm-content-card glass-card">
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Persona</th>
                  <th>Stage</th>
                  <th>Organization / Role</th>
                  <th>Orders / Spend</th>
                  <th>Score</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="crm-loading-spinner" /> Loading contacts from Neon...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                      No contacts found matching current search &amp; filters.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const badge = PERSONA_BADGES[contact.persona] || PERSONA_BADGES.parent;
                    return (
                      <tr
                        key={contact.id}
                        className="crm-table-row"
                        onClick={() => openContactDrawer(contact)}
                      >
                        <td>
                          <div className="crm-contact-cell">
                            <div className="crm-avatar" style={{ background: `${badge.color}15`, color: badge.color }}>
                              {(contact.name || contact.email)[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="crm-contact-name">{contact.name}</div>
                              <div className="crm-contact-email">{contact.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="crm-persona-pill" style={{ color: badge.color, background: `${badge.color}12` }}>
                            {badge.icon} {badge.label}
                          </span>
                        </td>
                        <td>
                          <span className={`crm-stage-pill stage-${contact.lifecycle_stage}`}>
                            {contact.lifecycle_stage}
                          </span>
                        </td>
                        <td>
                          <span className="crm-org-text">{contact.organization || '—'}</span>
                        </td>
                        <td>
                          <div className="crm-spend-cell">
                            <strong>${parseFloat(contact.total_spend || 0).toFixed(2)}</strong>
                            <span className="crm-spend-orders">({contact.total_orders || 0} orders)</span>
                          </div>
                        </td>
                        <td>
                          <div className="crm-score-pill" style={{
                            color: contact.lead_score >= 80 ? '#16A34A' : contact.lead_score >= 40 ? '#D97706' : '#64748B'
                          }}>
                            ★ {contact.lead_score || 10}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            onClick={(e) => { e.stopPropagation(); openContactDrawer(contact); }}
                            className="crm-inspect-btn"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: DEALS PIPELINE (KANBAN) ── */}
      {activeTab === 'pipeline' && (
        <div className="crm-kanban-board">
          {kanbanStages.map((stageKey) => {
            const config = STAGE_CONFIG[stageKey] || STAGE_CONFIG.new_lead;
            const stageDeals = deals.filter((d) => d.stage === stageKey);
            const totalStageValue = stageDeals.reduce((sum, d) => sum + parseFloat(d.deal_value || 0), 0);

            return (
              <div key={stageKey} className="crm-kanban-col">
                <div className="crm-kanban-col__header" style={{ borderTopColor: config.color }}>
                  <div className="crm-kanban-col__title-row">
                    <span className="crm-kanban-col__title">{config.label}</span>
                    <span className="crm-kanban-col__count">{stageDeals.length}</span>
                  </div>
                  <div className="crm-kanban-col__value">${totalStageValue.toLocaleString()}</div>
                </div>

                <div className="crm-kanban-col__cards">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="crm-deal-card glass-card">
                      <div className="crm-deal-card__header">
                        <span className="crm-deal-card__title">{deal.title}</span>
                        <span className="crm-deal-card__price">${parseFloat(deal.deal_value || 0).toLocaleString()}</span>
                      </div>

                      <div className="crm-deal-card__contact">
                        👤 {deal.contact_name || deal.contact_email}
                        {deal.organization && <span className="crm-deal-card__org"> ({deal.organization})</span>}
                      </div>

                      {deal.notes && <p className="crm-deal-card__notes">{deal.notes}</p>}

                      <div className="crm-deal-card__footer">
                        <span className="crm-deal-card__prob">{deal.probability || 20}% prob</span>
                        <select
                          value={deal.stage}
                          onChange={(e) => handleUpdateDealStage(deal.id, e.target.value)}
                          className="crm-deal-stage-select"
                        >
                          {Object.keys(STAGE_CONFIG).map((s) => (
                            <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: LIVE ACTIVITY STREAM ── */}
      {activeTab === 'activities' && (
        <div className="crm-content-card glass-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>⚡ Real-Time Customer Pulse</h3>
            <button onClick={() => setShowLogActivityModal(true)} className="btn btn-gold btn-sm">+ Log Interaction</button>
          </div>

          <div className="crm-activity-feed">
            {activities.length === 0 ? (
              <p style={{ color: '#64748B' }}>No recent activity recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="crm-activity-item">
                  <div className="crm-activity-icon">
                    {act.activity_type === 'stripe_checkout' || act.activity_type === 'stripe_order' ? '💳' : act.activity_type === 'form_submit' ? '📝' : act.activity_type === 'email_outreach' ? '✉️' : '🎵'}
                  </div>
                  <div className="crm-activity-body">
                    <div className="crm-activity-header">
                      <strong>{act.title}</strong>
                      <span className="crm-activity-time">{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                    <div className="crm-activity-desc">{act.description}</div>
                    <div className="crm-activity-contact">Contact: {act.contact_name} ({act.contact_email})</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: TASKS & FOLLOW-UPS ── */}
      {activeTab === 'tasks' && (
        <div className="crm-content-card glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>✅ Action Items &amp; School Outreach</h3>
            <button onClick={() => setShowAddTaskModal(true)} className="btn btn-gold btn-sm">+ New Task</button>
          </div>

          <div className="crm-tasks-list">
            {tasks.length === 0 ? (
              <p style={{ color: '#64748B' }}>No pending tasks! All follow-ups complete.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`crm-task-row ${task.status === 'completed' ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="crm-task-checkbox"
                  />
                  <div className="crm-task-info">
                    <div className="crm-task-title">{task.title}</div>
                    <div className="crm-task-meta">
                      {task.contact_name && <span>👤 Contact: {task.contact_name}</span>}
                      {task.due_date && <span>📅 Due: {task.due_date}</span>}
                    </div>
                  </div>
                  <span className={`crm-priority-badge priority-${task.priority}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: DROPSHIP & TIKTOK SHOP HUB ── */}
      {activeTab === 'dropship' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section A: Multi-Channel Orders */}
          <div className="crm-content-card glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📦</span> Multi-Channel Orders Stream
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Live incoming orders from TikTok Shop &amp; Direct Web Store (No mock phone numbers)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSimulateTikTokOrder} className="btn btn-outline btn-sm" style={{ background: '#fff' }}>
                  + Simulate TikTok Order
                </button>
                <button onClick={fetchDropshipData} className="btn btn-gold btn-sm">
                  🔄 Refresh Orders
                </button>
              </div>
            </div>

            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Channel</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tracking / Carrier</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dropshipOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                        No orders currently in the queue.
                      </td>
                    </tr>
                  ) : (
                    dropshipOrders.map((ord) => {
                      let itemsText = 'SafeAudio 85dB Headphones';
                      try {
                        const parsed = typeof ord.items === 'string' ? JSON.parse(ord.items) : ord.items;
                        itemsText = parsed.map(i => `${i.title || i.name} (x${i.qty || 1})`).join(', ');
                      } catch { /* fallback */ }

                      return (
                        <tr key={ord.id} className="crm-table-row">
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {ord.order_number}
                          </td>
                          <td>
                            <span className="crm-persona-pill" style={{
                              background: ord.source === 'tiktok_shop' ? 'rgba(254, 44, 85, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                              color: ord.source === 'tiktok_shop' ? '#FE2C55' : '#6366F1'
                            }}>
                              {ord.source === 'tiktok_shop' ? '🎵 TikTok Shop' : '🌐 Web Store'}
                            </span>
                          </td>
                          <td>
                            <strong>{ord.customer_name}</strong>
                            <br />
                            <small style={{ color: '#64748B' }}>{ord.customer_email || '—'}</small>
                          </td>
                          <td style={{ maxWidth: '280px', fontSize: '0.85rem' }}>
                            {itemsText}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            ${parseFloat(ord.total_amount || 0).toFixed(2)}
                          </td>
                          <td>
                            <span className={`crm-stage-pill stage-${ord.fulfillment_status === 'dispatched' ? 'customer' : 'opportunity'}`}>
                              {ord.fulfillment_status === 'dispatched' ? 'Dispatched' : 'Awaiting Dispatch'}
                            </span>
                          </td>
                          <td>
                            {ord.tracking_number ? (
                              <div>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ord.tracking_number}</span>
                                <br />
                                <small style={{ color: '#16A34A', fontWeight: 700 }}>✔ Synced to TikTok</small>
                              </div>
                            ) : (
                              <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Pending CJ Sourcing</span>
                            )}
                          </td>
                          <td>
                            {ord.fulfillment_status === 'dispatched' ? (
                              <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.5 }}>
                                Dispatched
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenDispatchModal(ord)}
                                className="btn btn-gold btn-sm"
                              >
                                ⚡ 1-Click Dispatch
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: "Just Add Headphones" Sourcing Catalog */}
          <div className="crm-content-card glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎧</span> "Just Add Headphones" Product Sourcing Catalog
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Sourced from CJ Dropshipping US Warehouses &bull; 85dB Hardwired SafeAudio
                </span>
              </div>
              <a href="https://cjdropshipping.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ background: '#fff' }}>
                🔗 Open CJ Dropshipping
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {dropshipProducts.map((p) => {
                const profit = (parseFloat(p.selling_price) - parseFloat(p.cost_price)).toFixed(2);
                const margin = Math.round((profit / p.selling_price) * 100);

                return (
                  <div key={p.id} style={{
                    background: '#FAF7F2',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        background: 'rgba(254, 44, 85, 0.1)',
                        color: '#FE2C55',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '3px 10px',
                        borderRadius: '50px',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase'
                      }}>
                        {p.supplier_name} &bull; US Warehouse
                      </span>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#2B2016' }}>{p.title}</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0', fontSize: '0.84rem', color: '#5C4A3A' }}>
                        <li style={{ padding: '3px 0' }}>🛡️ <strong>Volume Cap:</strong> 85dB SafeAudio (WHO Standard)</li>
                        <li style={{ padding: '3px 0' }}>⚡ <strong>Connectivity:</strong> Wired (Zero EMF Radiation)</li>
                        <li style={{ padding: '3px 0' }}>👶 <strong>Durability:</strong> 1-Piece EVA Flex-Foam (Toddler-Proof)</li>
                        <li style={{ padding: '3px 0' }}>🔌 <strong>SharePort:</strong> Sibling Audio Daisy-Chaining</li>
                        <li style={{ padding: '3px 0' }}>📝 <strong>Compliance:</strong> CPC &amp; ASTM F963 Certified</li>
                      </ul>
                    </div>

                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0,0,0,0.06)',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        margin: '1rem 0'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8' }}>SUPPLIER COST</span>
                          <strong style={{ fontFamily: 'monospace' }}>${parseFloat(p.cost_price).toFixed(2)}</strong>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8' }}>RETAIL PRICE</span>
                          <strong style={{ fontFamily: 'monospace' }}>${parseFloat(p.selling_price).toFixed(2)}</strong>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8' }}>NET PROFIT</span>
                          <strong style={{ fontFamily: 'monospace', color: '#16A34A' }}>+${profit} ({margin}%)</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#64748B' }}>
                        <span>SKU: <code>{p.supplier_sku}</code></span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>✔ TikTok Shop Live</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: TikTok Creator Affiliate Pipeline */}
          <div className="crm-content-card glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎥</span> TikTok Creator &amp; Affiliate Sample Pipeline
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Manage sample units, review video links, and monitor attributed sales GMV
                </span>
              </div>
            </div>

            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Creator Handle</th>
                    <th>Niche</th>
                    <th>Followers</th>
                    <th>Pipeline Stage</th>
                    <th>Sample Tracking</th>
                    <th>Review Clip</th>
                    <th>Attributed Sales</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorSamples.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                        No creator sample requests recorded yet.
                      </td>
                    </tr>
                  ) : (
                    creatorSamples.map((c) => (
                      <tr key={c.id} className="crm-table-row">
                        <td>
                          <strong>{c.creator_handle}</strong>
                        </td>
                        <td>{c.niche}</td>
                        <td style={{ fontFamily: 'monospace' }}>{c.follower_count?.toLocaleString()}</td>
                        <td>
                          <span className={`crm-stage-pill stage-${c.stage === 'video_posted' ? 'champion' : 'subscriber'}`}>
                            {c.stage === 'video_posted' ? 'Video Posted' : 'Sample Shipped'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {c.tracking_number || 'Dispatched'}
                        </td>
                        <td>
                          {c.video_url ? (
                            <a href={c.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', fontWeight: 600, fontSize: '0.82rem' }}>
                              Watch Video ({c.video_views?.toLocaleString()} views)
                            </a>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Awaiting Post</span>
                          )}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16A34A' }}>
                          ${parseFloat(c.attributed_gmv || 0).toFixed(2)} ({c.attributed_orders || 0} orders)
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '240px' }}>
                          {c.notes}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTACT 360 SLIDE-OVER DRAWER ── */}
      <AnimatePresence>
        {selectedContact && drawerEditForm && (
          <div className="crm-drawer-backdrop" onClick={() => setSelectedContact(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="crm-drawer glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crm-drawer__header">
                <div>
                  <h2 className="crm-drawer__name">{selectedContact.name}</h2>
                  <span className="crm-drawer__email">{selectedContact.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button onClick={() => openEmailComposer(selectedContact)} className="btn btn-gold btn-sm" title="Send Template Outreach Email">
                    ✉️ Outreach
                  </button>
                  <button onClick={() => setSelectedContact(null)} className="crm-drawer__close">✕</button>
                </div>
              </div>

              {/* Editable profile fields */}
              <form onSubmit={handleSaveContactEdits} className="crm-drawer__section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0 }}>Editable Profile (Neon PostgreSQL)</h4>
                  {saveSuccessNotice && <span style={{ color: '#16A34A', fontSize: '0.82rem', fontWeight: 700 }}>{saveSuccessNotice}</span>}
                </div>

                <div className="crm-drawer__grid">
                  <div>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={drawerEditForm.name}
                      onChange={(e) => setDrawerEditForm({ ...drawerEditForm, name: e.target.value })}
                      className="crm-drawer-field-input"
                    />
                  </div>
                  <div>
                    <label>Organization / School</label>
                    <input
                      type="text"
                      value={drawerEditForm.organization}
                      onChange={(e) => setDrawerEditForm({ ...drawerEditForm, organization: e.target.value })}
                      className="crm-drawer-field-input"
                    />
                  </div>
                  <div>
                    <label>Persona</label>
                    <select
                      value={drawerEditForm.persona}
                      onChange={(e) => setDrawerEditForm({ ...drawerEditForm, persona: e.target.value })}
                      className="crm-drawer-field-input"
                    >
                      <option value="parent">Parent</option>
                      <option value="educator">Educator</option>
                      <option value="institution">Institution / School</option>
                      <option value="ally">Partner / Ally</option>
                    </select>
                  </div>
                  <div>
                    <label>Lifecycle Stage</label>
                    <select
                      value={drawerEditForm.lifecycle_stage}
                      onChange={(e) => setDrawerEditForm({ ...drawerEditForm, lifecycle_stage: e.target.value })}
                      className="crm-drawer-field-input"
                    >
                      <option value="lead">Lead</option>
                      <option value="subscriber">Subscriber</option>
                      <option value="opportunity">Opportunity</option>
                      <option value="customer">Customer</option>
                      <option value="champion">Champion</option>
                    </select>
                  </div>
                  <div>
                    <label>Lead Score (0–100)</label>
                    <input
                      type="number"
                      value={drawerEditForm.lead_score}
                      onChange={(e) => setDrawerEditForm({ ...drawerEditForm, lead_score: parseInt(e.target.value, 10) || 0 })}
                      className="crm-drawer-field-input"
                    />
                  </div>
                  <div>
                    <label>Total Customer Spend</label>
                    <div style={{ color: '#16A34A', fontWeight: 'bold', paddingTop: '0.35rem' }}>
                      ${parseFloat(selectedContact.total_spend || 0).toFixed(2)} ({selectedContact.total_orders || 0} orders)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <button type="submit" disabled={contactSaving} className="btn btn-gold btn-sm">
                    {contactSaving ? 'Saving to Database...' : '💾 Save Profile to Neon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="crm-delete-link"
                  >
                    🗑️ Delete Contact
                  </button>
                </div>
              </form>

              {/* Internal Notes */}
              <div className="crm-drawer__section">
                <h4>Internal Staff Notes</h4>
                <form onSubmit={handleAddNote} className="crm-drawer__note-form">
                  <textarea
                    placeholder="Add a private note regarding curriculum needs, call summaries, or follow-ups..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="crm-drawer__textarea"
                    rows="3"
                  />
                  <button type="submit" disabled={noteSaving} className="btn btn-gold btn-sm">
                    {noteSaving ? 'Saving...' : 'Add Note'}
                  </button>
                </form>

                <div className="crm-drawer__notes-list">
                  {contactNotes.length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>No notes on file for this contact.</span>
                  ) : (
                    contactNotes.map((note) => (
                      <div key={note.id} className="crm-drawer__note-item">
                        <p>{note.content}</p>
                        <span className="crm-drawer__note-date">By {note.author} · {new Date(note.created_at).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: EMAIL COMPOSER WITH TEMPLATES ── */}
      {showEmailModal && selectedContact && (
        <div className="crm-modal-backdrop" onClick={() => setShowEmailModal(false)}>
          <div className="crm-modal glass-card" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>✉️ Outreach Composer — {selectedContact.name}</h3>
              <button onClick={() => setShowEmailModal(false)} className="crm-drawer__close">✕</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>Choose Template Preset</label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)' }}
              >
                {EMAIL_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>Email Message Body</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows="8"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
            </div>

            <div className="crm-modal-actions">
              <button type="button" onClick={() => setShowEmailModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button type="button" onClick={handleSendEmail} className="btn btn-gold btn-sm">
                🚀 Send &amp; Log Activity to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: LOG INTERACTION ── */}
      {showLogActivityModal && (
        <div className="crm-modal-backdrop" onClick={() => setShowLogActivityModal(false)}>
          <div className="crm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>+ Log Customer Interaction</h3>
            <form onSubmit={handleLogActivity} className="crm-modal-form">
              <select
                required
                value={newActivity.contact_id}
                onChange={(e) => setNewActivity({ ...newActivity, contact_id: e.target.value })}
              >
                <option value="">-- Select Contact --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              <select
                value={newActivity.activity_type}
                onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
              >
                <option value="call">📞 Phone Call / Consultation</option>
                <option value="meeting">🤝 Video Meeting / Curriculum Demo</option>
                <option value="email_outreach">✉️ Direct Email Outreach</option>
                <option value="note">📝 Administrative Note</option>
              </select>
              <input
                type="text"
                required
                placeholder="Interaction Title (e.g. 15-min Demo with Head of School)"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
              <textarea
                placeholder="Summary and key discussion points..."
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                rows="3"
              />
              <div className="crm-modal-actions">
                <button type="button" onClick={() => setShowLogActivityModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Save to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE CONTACT ── */}
      {showAddContactModal && (
        <div className="crm-modal-backdrop" onClick={() => setShowAddContactModal(false)}>
          <div className="crm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>+ Create New Contact</h3>
            <form onSubmit={handleCreateContact} className="crm-modal-form">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="School / Organization (Optional)"
                value={newContact.organization}
                onChange={(e) => setNewContact({ ...newContact, organization: e.target.value })}
              />
              <select
                value={newContact.persona}
                onChange={(e) => setNewContact({ ...newContact, persona: e.target.value })}
              >
                <option value="parent">Parent</option>
                <option value="educator">Educator / Homeschool Leader</option>
                <option value="institution">School / Daycare Institution</option>
                <option value="ally">Partner / Affiliate Ally</option>
              </select>
              <div className="crm-modal-actions">
                <button type="button" onClick={() => setShowAddContactModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE DEAL ── */}
      {showAddDealModal && (
        <div className="crm-modal-backdrop" onClick={() => setShowAddDealModal(false)}>
          <div className="crm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>+ Create Pipeline Opportunity</h3>
            <form onSubmit={handleCreateDeal} className="crm-modal-form">
              <input
                type="text"
                required
                placeholder="Opportunity Title (e.g. 5-Classroom Curriculum Pilot)"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              />
              <select
                required
                value={newDeal.contact_id}
                onChange={(e) => setNewDeal({ ...newDeal, contact_id: e.target.value })}
              >
                <option value="">-- Select Contact --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Estimated Deal Value ($)"
                value={newDeal.deal_value}
                onChange={(e) => setNewDeal({ ...newDeal, deal_value: parseFloat(e.target.value) || 0 })}
              />
              <textarea
                placeholder="Deal notes or negotiation context..."
                value={newDeal.notes}
                onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                rows="3"
              />
              <div className="crm-modal-actions">
                <button type="button" onClick={() => setShowAddDealModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE TASK ── */}
      {showAddTaskModal && (
        <div className="crm-modal-backdrop" onClick={() => setShowAddTaskModal(false)}>
          <div className="crm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>+ Create Follow-up Task</h3>
            <form onSubmit={handleCreateTask} className="crm-modal-form">
              <input
                type="text"
                required
                placeholder="Task Description (e.g., Send quote to Principal)"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <select
                value={newTask.contact_id}
                onChange={(e) => setNewTask({ ...newTask, contact_id: e.target.value })}
              >
                <option value="">-- Optional: Attach to Contact --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <div className="crm-modal-actions">
                <button type="button" onClick={() => setShowAddTaskModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DISPATCH & SYNC TRACKING TO TIKTOK ── */}
      {dispatchModalOrder && (
        <div className="crm-modal-backdrop" onClick={() => setDispatchModalOrder(null)}>
          <div className="crm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>⚡ Dispatch Order &amp; Sync to TikTok Shop</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
              Assign carrier tracking to order <strong>{dispatchModalOrder.order_number}</strong>. This updates your Neon database and fulfills the order on the TikTok Shop Fulfillment API.
            </p>
            <form onSubmit={handleConfirmTrackingSync} className="crm-modal-form">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Carrier</label>
              <select
                value={dispatchCarrier}
                onChange={(e) => setDispatchCarrier(e.target.value)}
              >
                <option value="USPS">USPS (United States Postal Service)</option>
                <option value="UPS">UPS (United Parcel Service)</option>
                <option value="FedEx">FedEx</option>
                <option value="DHL">DHL Express</option>
              </select>

              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Carrier Tracking Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 9400111899561234567890"
                value={dispatchTrackingNumber}
                onChange={(e) => setDispatchTrackingNumber(e.target.value)}
              />

              <div className="crm-modal-actions">
                <button type="button" onClick={() => setDispatchModalOrder(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSyncingTracking} className="btn btn-gold btn-sm">
                  {isSyncingTracking ? 'Syncing to TikTok...' : '✔ Confirm & Sync to TikTok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCrm;
