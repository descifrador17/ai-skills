#!/usr/bin/env node
/**
 * check-direction.mjs — mechanical gate for the creative-director skill.
 *
 *   node check-direction.mjs --brief CREATIVE.md            # Phase 3 exit gate
 *   node check-direction.mjs --code src                     # Phase 4 drift lint
 *   node check-direction.mjs --brief CREATIVE.md --code src # both + tokens↔spec match
 *
 * Exit 0 = pass, 1 = errors, 2 = usage. Zero dependencies, Node >= 18.
 * Judgment (is the concept good?) stays human. This only catches what a regex can.
 */
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, relative, basename} from 'node:path';

const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const briefPath = opt('--brief');
const codeDir = opt('--code');
const json = args.includes('--json');

if (!briefPath && !codeDir) {
  console.error('usage: check-direction.mjs [--brief CREATIVE.md] [--code src] [--json]');
  process.exit(2);
}

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push({where, msg});
const warn = (where, msg) => warnings.push({where, msg});

// ── Brief ──────────────────────────────────────────────────────────────────
const REQUIRED_HEADINGS = [
  'Brief', '1. Ideation', 'Rejected (obvious)', 'Scores', 'Premortem (leader)',
  '2. Direction', 'Visual philosophy', 'Rejection list', 'Look',
  '3. Motion', 'Motion-language spec', 'Restraint — stays still', 'Pacing map',
  'Shots', 'Variants', 'Storyboard', 'Approval',
];

/** Lines of a section: from its heading to the next heading of same or higher level. */
function section(md, title) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => /^#{2,3}\s/.test(l) && l.replace(/^#+\s*/, '').trim() === title);
  if (start < 0) return null;
  const level = lines[start].match(/^#+/)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+)\s/);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start + 1, end).join('\n');
}

const tableRow = (sec, key) => {
  const re = new RegExp(`^\\|\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\|([^|]*)\\|`, 'm');
  return sec?.match(re)?.[1]?.trim();
};

const parseBezier = (s) => {
  const m = s?.match(/(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)/);
  return m ? m.slice(1, 5).map(Number) : null;
};

let spec = null;

function checkBrief(path) {
  if (!existsSync(path)) return err(path, 'file not found');
  const md = readFileSync(path, 'utf8');
  const lines = md.split('\n');

  for (const h of REQUIRED_HEADINGS) {
    if (section(md, h) === null) err(path, `missing section "${h}"`);
  }

  // Placeholders: <lowercase…>, <…>, <https excluded>. JSX like <Still> is allowed.
  lines.forEach((l, i) => {
    if (l.trim().startsWith('>')) return; // template guidance quotes
    for (const m of l.matchAll(/<(?![A-Z/!]|https?:)[^<>\n]{1,120}>/g)) {
      err(`${path}:${i + 1}`, `unfilled placeholder ${m[0]}`);
    }
  });

  const mood = md.match(/\*\*Mood \(exactly 3\):\*\*\s*(.+)/)?.[1];
  if (mood && mood.split(',').map((s) => s.trim()).filter(Boolean).length !== 3) {
    err(path, `Mood must be exactly 3 adjectives, got "${mood}"`);
  }

  const rejected = section(md, 'Rejected (obvious)') ?? '';
  const nRejected = (rejected.match(/^\s*\d+\.\s+\S/gm) ?? []).length;
  if (nRejected < 3) err(path, `Rejected (obvious) needs >= 3 items, found ${nRejected}`);

  const concepts = [...md.matchAll(/^###\s+C(\d+):/gm)].map((m) => m[1]);
  if (concepts.length < 3) err(path, `need >= 3 presented concepts, found ${concepts.length}`);

  for (const c of concepts) {
    const body = md.split(new RegExp(`^###\\s+C${c}:`, 'm'))[1]?.split(/^###\s/m)[0] ?? '';
    for (const f of ['Premise', 'Wow moment', 'Mechanism', 'Failure mode', 'Grounded?']) {
      if (!new RegExp(`^${f.replace('?', '\\?')}:\\s*\\S`, 'm').test(body)) err(path, `C${c} missing "${f}"`);
    }
  }
  const grounded = (md.match(/^Grounded\?:\s*yes/gim) ?? []).length;
  if (concepts.length && grounded < 1) err(path, 'at least one concept must be Grounded?: yes');

  // Scores: originality <= 2 cannot be chosen.
  const scores = section(md, 'Scores') ?? '';
  const chosen = md.match(/\*\*Chosen:\*\*\s*C(\d+)/)?.[1];
  if (!chosen) err(path, 'no **Chosen:** Cn line');
  for (const row of scores.matchAll(/^\|\s*C(\d+)\s*\|\s*(\d)\s*\|/gm)) {
    if (row[1] === chosen && Number(row[2]) <= 2) {
      err(path, `C${chosen} chosen with Originality ${row[2]} (<= 2 must be cut)`);
    }
  }

  const premortem = section(md, 'Premortem (leader)') ?? '';
  if ((premortem.match(/^\s*-\s+\S/gm) ?? []).length < 3) err(path, 'Premortem needs 3 lines');

  const philosophy = section(md, 'Visual philosophy') ?? '';
  if (!/\*\*Movement:\*\*\s*\S/.test(philosophy)) err(path, 'Visual philosophy needs a named Movement');
  const manifesto = philosophy.replace(/\*\*Movement:\*\*.*\n?/, '').trim();
  if ((manifesto.match(/[.!?](\s|$)/g) ?? []).length < 5) err(path, 'manifesto needs >= 5 sentences');

  const rejection = section(md, 'Rejection list') ?? '';
  if ((rejection.match(/^\s*-\s+\S/gm) ?? []).length < 3) err(path, 'Rejection list needs >= 3 items');

  const moodCell = md.match(/\*\*Mood → cell:\*\*\s*(.+)/)?.[1] ?? '';
  if ((moodCell.match(/→/g) ?? []).length < 3) {
    err(path, '"**Mood → cell:**" must map all 3 mood adjectives to the chosen tone cell');
  }

  const motionSpec = section(md, 'Motion-language spec');
  const enter = parseBezier(tableRow(motionSpec, 'Entrance curve'));
  const exit = parseBezier(tableRow(motionSpec, 'Exit curve'));
  const base = Number(tableRow(motionSpec, 'Base unit')?.match(/\d*\.?\d+/)?.[0]);
  const stagger = Number(tableRow(motionSpec, 'Stagger')?.match(/\d+/)?.[0]);
  if (!enter) err(path, 'Entrance curve must be a cubic-bezier with 4 numbers');
  if (!exit) err(path, 'Exit curve must be a cubic-bezier with 4 numbers');
  if (!(base > 0)) err(path, 'Base unit must be a positive number of seconds');
  if (!(stagger >= 0)) err(path, 'Stagger must be a number in ms');
  spec = {enter, exit, base, stagger};

  const pacing = section(md, 'Pacing map') ?? '';
  const wows = (pacing.match(/\bWOW\b/g) ?? []).length;
  if (wows !== 1) err(path, `Pacing map must contain exactly one WOW, found ${wows}`);

  const shots = (section(md, 'Shots') ?? '').match(/^SHOT\s+\d+/gm) ?? [];
  if (shots.length < 1) err(path, 'no SHOT direction notes');

  const sb = section(md, 'Storyboard') ?? '';
  const frames = (sb.match(/^\|\s*(?!Frame\b|---)[^|]+\|\s*\d*\.?\d+\s*\|/gm) ?? []).length;
  if (frames < 3) err(path, `Storyboard needs >= 3 frames with timestamps, found ${frames}`);

  const approved = md.match(/\*\*Approved:\*\*\s*(.+)/)?.[1] ?? '';
  if (!/^yes\b/i.test(approved.trim())) err(path, 'not approved — "**Approved:** yes — <who>, <date>" required before code');
}

// ── Code ───────────────────────────────────────────────────────────────────
const SRC_EXT = /\.(tsx?|jsx?|mjs)$/;
const SKIP_DIR = new Set(['node_modules', 'out', 'build', 'dist', '.git']);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (SRC_EXT.test(name)) acc.push(p);
  }
  return acc;
}

/** Extract balanced-paren call bodies for `fnName(`. */
function calls(src, fnName) {
  const out = [];
  const re = new RegExp(`\\b${fnName}\\s*\\(`, 'g');
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') depth--;
    }
    out.push({index: m.index, body: src.slice(m.index, i)});
  }
  return out;
}

const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

let tokensFile = null;

function checkCode(dir) {
  if (!existsSync(dir)) return err(dir, 'directory not found');
  const files = walk(dir);
  for (const file of files) {
    const rel = relative(process.cwd(), file);
    const src = readFileSync(file, 'utf8');
    const isTokens = /^motion-tokens\./.test(basename(file));
    if (isTokens) { tokensFile = {file: rel, src}; continue; }

    for (const m of src.matchAll(/\bEasing\.\w+/g)) {
      err(`${rel}:${lineOf(src, m.index)}`, `${m[0]} outside motion-tokens — import ease.* instead`);
    }
    for (const c of calls(src, 'spring')) {
      if (/config\s*:\s*\{/.test(c.body)) {
        err(`${rel}:${lineOf(src, c.index)}`, 'inline spring config — use springs.* from motion-tokens');
      }
    }
    for (const c of calls(src, 'interpolate')) {
      if (!/clamp|extrapolate/.test(c.body)) {
        err(`${rel}:${lineOf(src, c.index)}`, 'interpolate() without clamp — extrapolation is undirected overshoot');
      }
    }
    for (const m of src.matchAll(/\btransition\s*:\s*['"`]/g)) {
      err(`${rel}:${lineOf(src, m.index)}`, 'CSS transition — Remotion is frame-driven; use tokens');
    }
    for (const m of src.matchAll(/['"`](ease|ease-in|ease-out|ease-in-out|linear)['"`]/g)) {
      err(`${rel}:${lineOf(src, m.index)}`, `CSS timing keyword ${m[0]} — use ease.* tokens`);
    }
    for (const m of src.matchAll(/\bMath\.random\s*\(/g)) {
      warn(`${rel}:${lineOf(src, m.index)}`, 'Math.random() makes renders non-deterministic — use random(seed) from remotion');
    }
    if (/[\\/]scenes[\\/]/.test(file) && !/SHOT\s+\d+/.test(src)) {
      err(rel, 'scene file missing "SHOT <n>" header linking it to CREATIVE.md');
    }
  }
  if (!tokensFile) err(dir, 'no motion-tokens.ts found — copy templates/motion-tokens.ts into src/');
}

function checkTokensMatchSpec() {
  if (!spec || !tokensFile) return;
  const {file, src} = tokensFile;
  const bez = (key) => parseBezier(src.match(new RegExp(`${key}\\s*:\\s*Easing\\.bezier\\(([^)]*)\\)`))?.[1]);
  const same = (a, b) => a && b && a.every((v, i) => Math.abs(v - b[i]) < 1e-6);
  if (!same(bez('enter'), spec.enter)) err(file, `ease.enter ${bez('enter')} != spec Entrance curve ${spec.enter}`);
  if (!same(bez('exit'), spec.exit)) err(file, `ease.exit ${bez('exit')} != spec Exit curve ${spec.exit}`);
  const base = Number(src.match(/baseUnitSec\s*:\s*([\d.]+)/)?.[1]);
  if (base !== spec.base) err(file, `baseUnitSec ${base} != spec Base unit ${spec.base}`);
  const stagger = Number(src.match(/staggerMs\s*:\s*(\d+)/)?.[1]);
  if (stagger !== spec.stagger) err(file, `staggerMs ${stagger} != spec Stagger ${spec.stagger}`);
}

if (briefPath) checkBrief(briefPath);
if (codeDir) checkCode(codeDir);
if (briefPath && codeDir) checkTokensMatchSpec();

if (json) {
  console.log(JSON.stringify({ok: errors.length === 0, errors, warnings}, null, 2));
} else {
  for (const e of errors) console.log(`✗ ${e.where}  ${e.msg}`);
  for (const w of warnings) console.log(`! ${w.where}  ${w.msg}`);
  console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s) — direction not met.` : `✓ direction checks passed (${warnings.length} warning(s))`);
}
process.exit(errors.length ? 1 : 0);
