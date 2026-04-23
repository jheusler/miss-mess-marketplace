#!/usr/bin/env node

const API_BASE = 'https://api.zapier.com/v1';
const API_KEY  = process.env.ZAPIER_API_KEY;
const SMS_PHONE = process.env.SMS_TARGET_PHONE ?? '314-610-5873';
const FIX_MODE  = process.argv.includes('--fix');
const MOCK_MODE = process.argv.includes('--mock');

function requireKey() {
  if (!API_KEY) {
    console.error(
      '\n[ERROR] ZAPIER_API_KEY is not set.\n' +
      '  1. Go to https://actions.zapier.com/credentials/\n' +
      '  2. Copy your API key\n' +
      '  3. Run: export ZAPIER_API_KEY="your-key-here"\n'
    );
    process.exit(1);
  }
}

async function zapierGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

async function zapierPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

function mockZaps() {
  return [
    {
      id: 'zap_mock_001',
      title: 'Oura Step Tracker -> SMS',
      status: 'error',
      steps: [
        { app: 'Oura Ring', action: 'Get Daily Activity' },
        { app: 'SMS by Zapier', action: 'Send SMS', params: { to: '+1-000-000-0000' } },
      ],
    },
    {
      id: 'zap_mock_002',
      title: 'Morning Oura Sleep Report',
      status: 'on',
      steps: [
        { app: 'Oura Ring', action: 'Get Sleep Summary' },
        { app: 'Gmail', action: 'Send Email' },
      ],
    },
  ];
}

function isOuraZap(zap) {
  const h = (zap.title ?? '').toLowerCase();
  return h.includes('oura') || h.includes('step tracker') || h.includes('sleep report');
}

function diagnose(zap) {
  const issues = [];
  if (zap.status === 'error') issues.push('Zap is in ERROR state — likely 401 from revoked Oura API key.');
  const smsStep = (zap.steps ?? []).find(s => s.app?.toLowerCase().includes('sms'));
  if (smsStep) {
    const to = smsStep.params?.to ?? '(not mapped)';
    if (!to.replace(/\D/g, '').includes(SMS_PHONE.replace(/\D/g, '')))
      issues.push(`SMS "To" is mapped to ${to} — expected ${SMS_PHONE}.`);
  } else {
    issues.push('No SMS step found — "Steps" field may not be mapped.');
  }
  return issues;
}

async function disableZap(zap) {
  console.log(`  -> Disabling "${zap.title}" (${zap.id})...`);
  if (MOCK_MODE) { console.log('  [MOCK] would send { status: "off" }'); return; }
  await zapierPatch(`/zaps/${zap.id}`, { status: 'off' });
  console.log('  Done — "Broken Zap" emails will stop.');
}

async function main() {
  if (!MOCK_MODE) requireKey();
  console.log('\n[oura-fix.js] Fetching Zap list...\n');

  let allZaps;
  if (MOCK_MODE) {
    console.log('  [MOCK] Using fake data — no real API calls.\n');
    allZaps = mockZaps();
  } else {
    const data = await zapierGet('/zaps?limit=100');
    allZaps = data.objects ?? data.results ?? data;
  }

  const ouraZaps = allZaps.filter(isOuraZap);
  if (!ouraZaps.length) { console.log('No Oura Zaps found.'); return; }

  console.log(`Found ${ouraZaps.length} Oura Zap(s):\n`);
  for (const zap of ouraZaps) {
    const status = zap.status ?? 'unknown';
    console.log(`  [${status.toUpperCase()}] ${zap.title} (${zap.id})`);
    const issues = diagnose(zap);
    issues.length
      ? issues.forEach(i => console.log(`    x ${i}`))
      : console.log('    OK');
    if (FIX_MODE && status === 'error') await disableZap(zap);
    console.log();
  }

  if (!FIX_MODE) console.log('Run with --fix to disable errored Zaps.\nRun with --mock to test without an API key.\n');
}

main().catch(e => { console.error('\n[FATAL]', e.message); process.exit(1); });
