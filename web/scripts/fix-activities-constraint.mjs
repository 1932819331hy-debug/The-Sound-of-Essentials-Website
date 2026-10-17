const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL or NEON_DATABASE_URL environment variable required');
  process.exit(1);
}

async function fixConstraint() {
  const urlObj = new URL(connectionString);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  const sql = `ALTER TABLE crm_activities ADD CONSTRAINT crm_activities_activity_type_check CHECK (activity_type IN ('album_unlock', 'form_submit', 'shopify_order', 'stripe_order', 'stripe_checkout', 'quest_milestone', 'admin_note', 'note', 'email_sent', 'email_outreach', 'call_log', 'call', 'meeting', 'task_complete'));`;

  console.log('Adding expanded crm_activities_activity_type_check constraint...');
  const response = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({ query: sql }),
  });

  const resText = await response.text();
  console.log('Response:', resText);
}

fixConstraint().catch(console.error);
