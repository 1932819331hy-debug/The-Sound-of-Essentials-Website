/**
 * Cloudflare Pages Function: /api/admin/crm/send-email
 * Direct transactional outreach email delivery via Brevo SMTP API,
 * paired with automatic logging into Neon PostgreSQL crm_activities.
 */

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const FALLBACK_BREVO_KEY = '';
const BREVO_SENDER_ID = 2; // The Sound of Essentials <info@soelearn.com>

async function queryNeon(databaseUrl, sql, params = []) {
  const finalUrl = databaseUrl || FALLBACK_DB_URL;
  const urlObj = new URL(finalUrl);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': finalUrl,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Database error: ${err}`);
  }
  return res.json();
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const brevoKey = env?.BREVO_API_KEY || FALLBACK_BREVO_KEY;

    const body = await request.json();
    const {
      contact_id,
      to_email,
      to_name,
      subject,
      body: emailBody,
      template_id,
    } = body;

    if (!to_email || !subject || !emailBody) {
      return new Response(JSON.stringify({ error: 'Recipient email, subject, and body are required' }), { status: 400 });
    }

    // 1. Send via Brevo Transactional Email API
    const brevoPayload = {
      sender: { id: BREVO_SENDER_ID },
      to: [{ email: to_email, name: to_name || 'Rhythm Explorer' }],
      subject: subject,
      htmlContent: `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; white-space: pre-wrap; font-size: 15px;">${emailBody}</div>`,
      textContent: emailBody,
    };

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    let brevoData = null;
    if (brevoRes.ok) {
      brevoData = await brevoRes.json();
    } else {
      const errText = await brevoRes.text();
      console.warn('Brevo transactional email send warning:', errText);
    }

    // 2. Log in Neon PostgreSQL crm_activities
    let activityRecord = null;
    if (contact_id) {
      const sql = `
        INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata)
        VALUES ($1, 'email_outreach', $2, $3, $4)
        RETURNING *;
      `;
      const actRes = await queryNeon(databaseUrl, sql, [
        contact_id,
        `Outbound Email: ${subject}`,
        emailBody.slice(0, 500) + (emailBody.length > 500 ? '...' : ''),
        JSON.stringify({
          recipient_email: to_email,
          recipient_name: to_name,
          template_id: template_id || 'custom',
          brevo_message_id: brevoData?.messageId || null,
          dispatched_at: new Date().toISOString(),
        }),
      ]);
      activityRecord = actRes.rows[0];

      // Update contact touchpoint
      await queryNeon(
        databaseUrl,
        `UPDATE crm_contacts SET last_active_at = CURRENT_TIMESTAMP, lead_score = LEAST(100, lead_score + 10) WHERE id = $1;`,
        [contact_id]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      messageId: brevoData?.messageId || null,
      activity: activityRecord,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Send Email API Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
