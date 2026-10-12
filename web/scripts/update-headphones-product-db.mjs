const connectionString = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function updateDb() {
  const urlObj = new URL(connectionString);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  console.log('Updating shop_products in Neon database with AWATRUE HK05 details...');

  const sql = `
    UPDATE shop_products
    SET 
      title = 'AWATRUE HK05 Kids Headphones (74/85dB Dual Limit • 40mm Dynamic Drivers • Wired Zero-EMF • Braided Cord)',
      slug = 'awatrue-hk05-kids-headphones',
      cost_price = 7.01,
      selling_price = 24.99,
      compare_at_price = 34.99,
      supplier_name = 'Amazon US (Awatrue Store)',
      supplier_sku = 'AWATRUE-HK05-7485DB',
      tiktok_sync_status = 'live',
      specs_json = '{
        "model": "AWATRUE HK05",
        "asin": "B0F1D77FLB",
        "volume_limit": "74dB / 85dB Dual SafeAudio (WHO Standard)",
        "radiation": "Zero (Wired Non-Bluetooth)",
        "drivers": "2 x 40mm Dynamic Neodymium",
        "connector": "3.5mm Gold-Plated Stereo Jack",
        "cable_length": "1.5m (4.9 ft) Braided Tangle-Free",
        "compliance": "CPC, CPSIA, CE, RoHS Certified",
        "supplier_url": "https://www.amazon.com/awatrue-Headphones-School-Stereo-Airplane/dp/B0F1D77FLB",
        "backup_supplier_url": "https://www.awatrue.com/products/awatrue-hk05-wired-kids-headphones-with-74-85db-volume-limit",
        "fulfillment_channel": "Amazon Prime / Multi-Channel Fulfillment (2-3 Day US Delivery)",
        "stock_status": "in_stock"
      }'::jsonb
    WHERE slug LIKE '%headphones%' OR supplier_sku LIKE '%HEADPHONE%';
  `;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Update failed:', err);
  } else {
    console.log('✅ Database successfully updated with AWATRUE HK05 product info!');
  }
}

updateDb();
