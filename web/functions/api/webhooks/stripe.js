/**
 * Cloudflare Pages Function: /api/webhooks/stripe
 * Automatically syncs successful Stripe checkouts into Neon PostgreSQL CRM and Brevo.
 */

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const DEFAULT_BREVO_BUYERS_LIST_ID = 3; // SOE_Buyers

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
    throw new Error(`Neon error: ${err}`);
  }
  return res.json();
}

async function addContactToBrevo(apiKey, email, fullName, listId) {
  if (!apiKey || !email) return;
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || '',
          LASTNAME: lastName || '',
        },
        listIds: [Number(listId) || 3],
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.warn('Brevo sync warning:', err);
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const brevoApiKey = env?.BREVO_API_KEY;
    const brevoBuyersListId = Number(env?.BREVO_BUYERS_LIST_ID) || DEFAULT_BREVO_BUYERS_LIST_ID;

    const event = await request.json();

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      if (!session) {
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const email = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
      const fullName = session.customer_details?.name || 'Valued Explorer';
      const phone = session.customer_details?.phone || null;
      const orderTotal = (session.amount_total || 0) / 100;
      const paymentIntentId = session.payment_intent || session.id;

      if (email) {
        // 1. Upsert into Neon CRM contacts
        const upsertContactSql = `
          INSERT INTO crm_contacts (email, name, phone, persona, lifecycle_stage, total_orders, total_spend, lead_score, updated_at)
          VALUES ($1, $2, $3, 'parent', 'customer', 1, $4, 100, CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET
            name = COALESCE(NULLIF($2, ''), crm_contacts.name),
            phone = COALESCE($3, crm_contacts.phone),
            lifecycle_stage = 'customer',
            total_orders = crm_contacts.total_orders + 1,
            total_spend = crm_contacts.total_spend + $4,
            lead_score = GREATEST(crm_contacts.lead_score, 100),
            last_active_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id;
        `;

        const contactRes = await queryNeon(databaseUrl, upsertContactSql, [
          email,
          fullName,
          phone,
          orderTotal,
        ]);

        const contactId = contactRes.rows[0]?.id;

        // 2. Log activity
        if (contactId) {
          const activitySql = `
            INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata)
            VALUES ($1, 'stripe_checkout', $2, $3, $4);
          `;

          const shippingDetails = session.shipping_details || session.customer_details?.address || null;
          const refId = session.client_reference_id || '';

          await queryNeon(databaseUrl, activitySql, [
            contactId,
            `Stripe Order ($${orderTotal.toFixed(2)})`,
            `Completed Checkout Session ${session.id}`,
            JSON.stringify({
              session_id: session.id,
              payment_intent: paymentIntentId,
              amount_total: orderTotal,
              currency: session.currency,
              payment_status: session.payment_status,
              customer_details: session.customer_details,
              shipping_details: shippingDetails,
              client_reference_id: refId,
            }),
          ]);

          // 3. Insert into shop_orders dropship queue
          try {
            const orderNum = `SOE-${Date.now().toString().slice(-6)}`;
            let itemTitle = 'SOE Early Learning Product';
            if (refId.includes('AWATRUE-HK05')) {
              const variantName = refId.replace('AWATRUE-HK05-', '').replace(/-/g, ' ');
              itemTitle = `AWATRUE HK05 Safe Sensory Kids Headphones (${variantName})`;
            } else if (refId.includes('BUNDLE')) {
              const variantName = refId.replace('SOE-BUNDLE-', '').replace(/-/g, ' ');
              itemTitle = `SOE Sensory Listening & Workbook Bundle (${variantName})`;
            } else if (orderTotal >= 24) {
              itemTitle = 'AWATRUE HK05 Sensory Kids Headphones (Standard)';
            }

            const itemsPayload = JSON.stringify([{
              title: itemTitle,
              qty: 1,
              price: orderTotal,
              sku: refId || 'SOE-ORDER',
              variant: refId
            }]);

            const insertShopOrderSql = `
              INSERT INTO shop_orders (
                order_number, source, external_order_id, contact_id, customer_name, customer_email, customer_phone,
                shipping_address, items, subtotal, shipping_fee, total_amount, payment_status, fulfillment_status
              )
              VALUES ($1, 'web_store', $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, 0.00, $9, 'paid', 'unfulfilled')
              ON CONFLICT (order_number) DO NOTHING;
            `;

            await queryNeon(databaseUrl, insertShopOrderSql, [
              orderNum,
              session.id,
              contactId,
              fullName,
              email,
              phone,
              JSON.stringify(shippingDetails || {}),
              itemsPayload,
              orderTotal
            ]);
          } catch (shopOrderErr) {
            console.warn('shop_orders insertion warning:', shopOrderErr);
          }
        }

        // 4. Sync to Brevo Buyers List
        if (brevoApiKey) {
          await addContactToBrevo(brevoApiKey, email, fullName, brevoBuyersListId);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Stripe Webhook Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
