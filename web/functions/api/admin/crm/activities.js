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

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;

    const url = new URL(request.url);
    const contactId = url.searchParams.get('contact_id');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let sql, params;
    if (contactId) {
      sql = `
        SELECT a.*, c.name as contact_name, c.email as contact_email
        FROM crm_activities a
        JOIN crm_contacts c ON a.contact_id = c.id
        WHERE a.contact_id = $1
        ORDER BY a.created_at DESC
        LIMIT $2;
      `;
      params = [contactId, limit];
    } else {
      sql = `
        SELECT a.*, c.name as contact_name, c.email as contact_email, c.organization
        FROM crm_activities a
        JOIN crm_contacts c ON a.contact_id = c.id
        ORDER BY a.created_at DESC
        LIMIT $1;
      `;
      params = [limit];
    }

    const data = await queryNeon(databaseUrl, sql, params);
    return new Response(JSON.stringify({ activities: data.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();

    const { contact_id, deal_id, activity_type, title, description, metadata } = body;
    if (!contact_id || !title) {
      return new Response(JSON.stringify({ error: 'Contact ID and Title are required' }), { status: 400 });
    }

    // Type normalization to avoid constraint violations
    const TYPE_MAP = {
      call: 'call_log',
      meeting: 'meeting',
      note: 'admin_note',
      email: 'email_outreach',
      email_sent: 'email_outreach',
      email_outreach: 'email_outreach',
    };
    const resolvedType = TYPE_MAP[activity_type] || activity_type || 'admin_note';

    let emailDispatchResult = null;
    const activityMetadata = { ...(metadata || {}) };

    // Direct Brevo transactional email dispatch if requested
    if (body.dispatch_email) {
      const brevoKey = env?.BREVO_API_KEY || FALLBACK_BREVO_KEY;
      const toEmail = body.to_email;
      const toName = body.to_name || 'Rhythm Partner';
      const subject = body.subject || title;
      const emailBody = body.body || description || '';

      if (toEmail && brevoKey) {
        try {
          const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'api-key': brevoKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              sender: { id: BREVO_SENDER_ID },
              to: [{ email: toEmail, name: toName }],
              subject: subject,
              htmlContent: `<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; white-space: pre-wrap;">${emailBody}</div>`,
              textContent: emailBody,
            }),
          });

          if (brevoRes.ok) {
            const brevoData = await brevoRes.json();
            emailDispatchResult = { success: true, messageId: brevoData?.messageId };
            activityMetadata.brevo_message_id = brevoData?.messageId;
            activityMetadata.delivery_status = 'dispatched';
            activityMetadata.recipient_email = toEmail;
          } else {
            const errText = await brevoRes.text();
            console.warn('Brevo email dispatch non-200:', errText);
            activityMetadata.delivery_warning = errText;
          }
        } catch (mailErr) {
          console.warn('Brevo dispatch error:', mailErr);
          activityMetadata.delivery_error = mailErr.message;
        }
      }
    }

    const sql = `
      INSERT INTO crm_activities (contact_id, deal_id, activity_type, title, description, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [
      contact_id,
      deal_id || null,
      resolvedType,
      title,
      description || null,
      JSON.stringify(activityMetadata),
    ]);

    // Update contact last_active_at and increase lead score
    try {
      await queryNeon(
        databaseUrl,
        `UPDATE crm_contacts SET last_active_at = CURRENT_TIMESTAMP, lead_score = LEAST(100, lead_score + 10) WHERE id = $1;`,
        [contact_id]
      );
    } catch (touchErr) {
      console.warn('Contact touch error:', touchErr);
    }

    return new Response(JSON.stringify({
      activity: data.rows[0],
      email_dispatched: Boolean(emailDispatchResult?.success),
      messageId: emailDispatchResult?.messageId || null,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
