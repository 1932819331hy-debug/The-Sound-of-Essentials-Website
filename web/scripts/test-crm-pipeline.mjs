import https from 'https';

const PRODUCTION_URL = 'https://soe-website-b7j.pages.dev';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        return fetchUrl(redirectUrl, options).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testCrmPipeline() {
  console.log('================================================================');
  console.log('🧪 SOE COMMAND CRM FULL END-TO-END PIPELINE TEST');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  // -------------------------------------------------------------
  // TEST 1: CRM Stats Telemetry API (/api/admin/crm/stats)
  // -------------------------------------------------------------
  total++;
  console.log('[TEST 1] Testing CRM Stats Edge Endpoint...');
  try {
    const res = await fetchUrl(`${PRODUCTION_URL}/api/admin/crm/stats`);
    const json = JSON.parse(res.body);
    if (res.status === 200 && json.totalContacts !== undefined) {
      console.log('✅ PASS: Stats endpoint active:');
      console.log(`   Audience: ${json.totalContacts}, LTV: $${json.totalLtv}, Active Pipeline: $${json.activePipelineValue}`);
      passed++;
    } else {
      console.log('❌ FAIL: Stats endpoint error:', res.body);
    }
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 2: CRM Contacts 360 Query & Filter (/api/admin/crm/contacts)
  // -------------------------------------------------------------
  total++;
  console.log('\n[TEST 2] Testing CRM Contacts Directory Edge API...');
  try {
    const res = await fetchUrl(`${PRODUCTION_URL}/api/admin/crm/contacts?persona=all`);
    const json = JSON.parse(res.body);
    if (res.status === 200 && Array.isArray(json.contacts)) {
      console.log(`✅ PASS: Retrieved ${json.contacts.length} contacts (Total: ${json.total})`);
      passed++;
    } else {
      console.log('❌ FAIL: Contacts directory error:', res.body);
    }
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 3: Deals Pipeline Kanban Endpoint (/api/admin/crm/deals)
  // -------------------------------------------------------------
  total++;
  console.log('\n[TEST 3] Testing Deals Pipeline Kanban API...');
  try {
    const res = await fetchUrl(`${PRODUCTION_URL}/api/admin/crm/deals`);
    const json = JSON.parse(res.body);
    if (res.status === 200 && Array.isArray(json.deals)) {
      console.log(`✅ PASS: Retrieved ${json.deals.length} active deals across pipeline stages`);
      passed++;
    } else {
      console.log('❌ FAIL: Deals pipeline error:', res.body);
    }
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 4: Public Lead Capture Ingestion (/api/submit -> Neon CRM)
  // -------------------------------------------------------------
  total++;
  console.log('\n[TEST 4] Testing Public Lead Capture Pipeline Ingestion...');
  const testLeadEmail = `lead.verification.${Date.now()}@parentmail.org`;
  try {
    const payload = JSON.stringify({
      kind: 'interest',
      name: 'Verification Parent',
      email: testLeadEmail,
      organizationName: 'Homeschool Cooperative',
      message: 'Testing public pipeline end-to-end to Neon CRM',
      sourcePath: '/listen',
    });

    const res = await fetchUrl(`${PRODUCTION_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      body: payload,
    });

    const json = JSON.parse(res.body);
    if (res.status === 200 && json.success) {
      console.log('✅ PASS: Lead successfully ingested into Neon CRM and Brevo queue!');
      console.log(`   Captured Email: ${testLeadEmail} (Contact ID: ${json.contactId || 'Created'})`);
      passed++;
    } else {
      console.log('❌ FAIL: Lead capture error:', res.body);
    }
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 5: Live Frontend Route (/admin/crm)
  // -------------------------------------------------------------
  total++;
  console.log('\n[TEST 5] Verifying /admin/crm React SPA Dashboard Page...');
  try {
    const res = await fetchUrl(`${PRODUCTION_URL}/admin/crm`);
    if (res.status === 200 && res.body.includes('<div id="root">')) {
      console.log('✅ PASS: /admin/crm loads with 200 OK');
      passed++;
    } else {
      console.log(`❌ FAIL: /admin/crm responded with status ${res.status}`);
    }
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }

  console.log('\n================================================================');
  console.log(`🏁 CRM TEST SUITE: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('================================================================');
}

testCrmPipeline();
