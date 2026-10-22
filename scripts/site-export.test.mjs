// Checks reports/site/pulse.json (hand-written, schema pulse/1) against the sources it describes:
// src/lib/analytics.ts (event names, order, property keys, user properties) and the README event table.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(fileURLToPath(new URL(p, root)), 'utf8');

const analytics = read('src/lib/analytics.ts');
const readme = read('README.md');
const raw = read('reports/site/pulse.json');
const exp = JSON.parse(raw);

function sortKeysDeep(x) {
  if (Array.isArray(x)) return x.map(sortKeysDeep);
  if (x && typeof x === 'object') {
    return Object.fromEntries(
      Object.keys(x)
        .sort()
        .map((k) => [k, sortKeysDeep(x[k])]),
    );
  }
  return x;
}

function trackedEvents() {
  const out = [];
  const re = /amplitude\.track\('([^']+)',\s*\{([^}]*)\}\)/g;
  for (const m of analytics.matchAll(re)) {
    const properties = m[2]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(':')[0].trim());
    out.push({ name: m[1], properties });
  }
  return out;
}

function readmeRows() {
  const rows = new Map();
  for (const line of readme.split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) continue;
    const name = /^`([^`]+)`$/.exec(cells[0]);
    if (!name) continue;
    rows.set(name[1], { fires_when: cells[1], question: cells[3] });
  }
  return rows;
}

test('events match the amplitude.track calls in analytics.ts (names, order, property keys)', () => {
  const tracked = trackedEvents();
  assert.equal(tracked.length, 7);
  assert.deepEqual(
    exp.tables.events.map((e) => ({ name: e.name, properties: e.properties })),
    tracked,
  );
});

test('user_properties equal the .set / .setOnce keys, in order', () => {
  const keys = [...analytics.matchAll(/\.set(?:Once)?\('([^']+)'/g)].map((m) => m[1]);
  assert.equal(keys.length, 4);
  assert.deepEqual(exp.tables.user_properties, keys);
});

test('_meta input hash equals the sha256 of analytics.ts', () => {
  const sha = createHash('sha256').update(readFileSync(fileURLToPath(new URL('src/lib/analytics.ts', root)))).digest('hex');
  assert.deepEqual(exp._meta.inputs, [{ path: 'src/lib/analytics.ts', rows: null, sha256: sha }]);
});

test('_meta block is the hand-written, no-dataset form', () => {
  assert.equal(exp._meta.schema, 'pulse/1');
  assert.equal(exp._meta.source, 'pulse');
  assert.equal(exp._meta.generator, 'hand-written; checked by scripts/site-export.test.mjs');
  assert.deepEqual(exp._meta.engine, {});
  assert.equal(exp._meta.dataset, null);
  assert.equal(exp._meta.provenance, 'none');
});

test('counts: events.count === events.length === 7; identity.user_properties === 4', () => {
  assert.equal(exp.facts['events.count'].value, 7);
  assert.equal(exp.tables.events.length, 7);
  assert.equal(exp.facts['events.count'].value, exp.tables.events.length);
  assert.equal(exp.facts['identity.user_properties'].value, 4);
  assert.equal(exp.facts['identity.user_properties'].value, exp.tables.user_properties.length);
});

test('fires_when and question equal the README event table, word for word', () => {
  const rows = readmeRows();
  assert.equal(rows.size, 7);
  for (const e of exp.tables.events) {
    const r = rows.get(e.name);
    assert.ok(r, `README has a row for ${e.name}`);
    assert.equal(e.fires_when, r.fires_when, `${e.name} fires_when`);
    assert.equal(e.question, r.question, `${e.name} question`);
  }
});

test('no category on any event and no events.question_categories fact (RULING-facts item 1)', () => {
  for (const e of exp.tables.events) assert.equal('category' in e, false, e.name);
  assert.equal('events.question_categories' in exp.facts, false);
  assert.deepEqual(Object.keys(exp.facts).sort(), ['events.count', 'identity.user_properties']);
});

test('the file is canonical JSON (sorted keys, indent 1, trailing newline)', () => {
  assert.equal(raw, JSON.stringify(sortKeysDeep(exp), null, 1) + '\n');
});
