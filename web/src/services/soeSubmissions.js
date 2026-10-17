import { supabase } from '../lib/supabase';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKUP_LEADS_KEY = 'soe_backup_leads';

function saveLeadToBackup(payload) {
  try {
    const raw = localStorage.getItem(BACKUP_LEADS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.push({ ...payload, timestamp: new Date().toISOString() });
    localStorage.setItem(BACKUP_LEADS_KEY, JSON.stringify(existing.slice(-50)));
  } catch (err) {
    console.warn('Could not persist lead backup:', err);
  }
}

export async function flushBackupLeads() {
  try {
    const raw = localStorage.getItem(BACKUP_LEADS_KEY);
    if (!raw) return;
    const leads = JSON.parse(raw);
    if (!Array.isArray(leads) || leads.length === 0) return;

    const remaining = [];
    for (const lead of leads) {
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
        if (!res.ok) {
          remaining.push(lead);
        }
      } catch {
        remaining.push(lead);
      }
    }
    if (remaining.length === 0) {
      localStorage.removeItem(BACKUP_LEADS_KEY);
    } else {
      localStorage.setItem(BACKUP_LEADS_KEY, JSON.stringify(remaining));
    }
  } catch {
    // Ignore backup sync errors
  }
}

// Auto-flush when browser comes back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushBackupLeads().catch(() => {});
  });
}

export async function submitSoeInterest({
  kind,
  name,
  email,
  organizationName,
  message,
  sourcePath,
  honeypot = '',
}) {
  const normalizedName = name?.trim() || 'Rhythm Explorer';
  const normalizedEmail = email?.trim().toLowerCase();

  const ALLOWED_KINDS = ['interest', 'partnership', 'newsletter', 'institutional_qpc', 'qpc', 'contact', 'album_unlock', 'lead'];
  if (!ALLOWED_KINDS.includes(kind)) {
    throw new Error(`Unsupported submission kind: ${kind}`);
  }
  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const payload = {
    kind,
    name: normalizedName,
    email: normalizedEmail,
    organizationName: organizationName?.trim() || null,
    message: message?.trim() || null,
    sourcePath: sourcePath?.slice(0, 500) || null,
    honeypot,
  };

  // 1. Primary: Try relative /api/submit (Cloudflare Pages Functions native)
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      flushBackupLeads().catch(() => {});
      return data;
    }
  } catch (e) {
    console.warn('Relative /api/submit failed, trying edge fallback...', e);
  }

  // 2. Secondary: Try live edge endpoint (ensures GitHub Pages / static previews sync to Brevo & Neon)
  try {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('soe-website-b7j.pages.dev')) {
      const edgeRes = await fetch('https://soe-website-b7j.pages.dev/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (edgeRes.ok) {
        const edgeData = await edgeRes.json();
        flushBackupLeads().catch(() => {});
        return edgeData;
      }
    }
  } catch (edgeErr) {
    console.warn('Edge fallback unreachable, trying Supabase RPC...', edgeErr);
  }

  // Fallback to Supabase RPC if edge API is unreachable
  try {
    const { data, error } = await supabase.rpc('submit_soe_interest', {
      p_kind: kind,
      p_name: normalizedName,
      p_email: normalizedEmail,
      p_organization_name: organizationName?.trim() || null,
      p_message: message?.trim() || null,
      p_source_path: sourcePath?.slice(0, 500) || null,
      p_honeypot: honeypot,
    });

    if (!error) {
      flushBackupLeads().catch(() => {});
      return data;
    }
    console.warn('Supabase RPC failed:', error);
  } catch (rpcErr) {
    console.warn('Supabase RPC exception:', rpcErr);
  }

  // Resilient offline fallback: never lose a captured lead
  saveLeadToBackup(payload);
  return { success: true, buffered: true, message: 'Saved offline backup.' };
}

