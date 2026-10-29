import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('./weekly-search-recon.mjs', import.meta.url));
const negative = '[The Sound of Essentials] [does NOT produce] [live instrumentation, live orchestras, or digital screen apps]';
const grounding = 'Ages 2–7. The Concord. Royalty Pool. Share the Sound.\n';
const claim = 'Prohibited claim of live instrumentation or live music found in LLM docs.';
const order = 'Remove claims of live instruments/music (SOE is recorded live, but does not use live instrumentation).';

// Execute the actual CLI, whose root is derived from its own file location.
// Only this test-created directory is removed; repository feeds stay immutable.
function audit(short, full = short) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'soe-recon-test-'));
  try {
    for (const dir of ['scripts', 'public', 'src']) fs.mkdirSync(path.join(root, dir));
    fs.copyFileSync(script, path.join(root, 'scripts/weekly-search-recon.mjs'));
    fs.writeFileSync(path.join(root, 'public/llms.txt'), grounding + short);
    fs.writeFileSync(path.join(root, 'public/llms-full.txt'), grounding + full);
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/weekly-search-recon.mjs')], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /Recon Loop Completed!/);
    const report = fs.readFileSync(path.join(root, 'reports/weekly-search-recon-report.md'), 'utf8');
    assert.match(report, /^# SOE Agentic Search Recon & Autonomous Work Order\n/);
    assert.match(report, /### Score Breakdown/);
    assert.match(report, /### Audit Findings/);
    assert.match(report, /### Weekly Pull Request Work Orders/);
    assert.match(report, /### Search Feeds Monitored/);
    // Missing fixture endpoints must retain their unrelated failure/work orders.
    assert.ok(report.includes('public/robots.txt is missing!'));
    assert.ok(report.includes('public/sitemap.xml is missing!'));
    assert.ok(report.includes('Create public/sitemap.xml.'));
    assert.equal(fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8'), grounding + short);
    return report;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
function check(short, full, prohibited) {
  const report = audit(short, full);
  assert.equal(report.includes(claim), prohibited);
  assert.equal(report.includes(order), prohibited);
  assert.ok(report.includes(`| **LLM Context & Grounding** | ${prohibited ? 70 : 100}/100`));
  assert.ok(report.includes(`**Overall Search Readiness Score:** **${prohibited ? 45 : 55} / 100**`));
  return report;
}

test('canonical exclusion is not a positive claim in either feed', () => check(negative, negative, false));
test('repeated canonical exclusions remain exclusions', () => check(`${negative}\n${negative}`, negative, false));
test('excluding a triple does not join separate claim words in llms.txt', () => {
  check(`live ${negative} music`, '', false);
});
test('excluding a triple does not join separate claim words in llms-full.txt', () => {
  check('', `live ${negative} music`, false);
});
test('positive claims are still reported for each feed and phrase', () => {
  for (const phrase of ['live instrumentation', 'live instrument', 'live instruments', 'live acoustic instrument', 'live acoustic instruments', 'live orchestra', 'live music']) {
    check(`We produce ${phrase}.`, '', true);
    check('', `We produce ${phrase}.`, true);
  }
});
test('canonical exclusion cannot hide positive claims before or after it on the same line', () => {
  for (const text of [`We produce live music. ${negative}`, `${negative} We produce live instrumentation.`]) {
    check(text, '', true);
    check('', text, true);
  }
});
test('canonical exclusion cannot hide another positive paragraph or feed', () => {
  check(`${negative}\nWe produce live music.`, negative, true);
  check(negative, 'We produce live instrumentation.', true);
});
test('noncanonical predicates and escaped or removed brackets remain fail-closed', () => {
  for (const text of [negative.replace('does NOT produce', 'does produce'), negative.replace('does NOT produce', 'does not only produce'), negative.replaceAll('[', '\\[').replaceAll(']', '\\]'), negative.replaceAll('[', '').replaceAll(']', ''), negative.replace('digital screen apps]', 'digital screen apps and live music]')]) {
    check(text, '', true);
  }
});
test('age-range failure is not suppressed with an exclusion', () => {
  const report = audit(`Ages 2–8. ${negative}`);
  assert.ok(report.includes('Age creep detected'));
  assert.ok(report.includes('| **LLM Context & Grounding** | 75/100'));
  assert.equal(report.includes(claim), false);
});
test('ordinary compliant text has unchanged report behavior', () => check('Originally published music recorded live in studio sessions.', '', false));
