#!/usr/bin/env node
/**
 * build-icon-tables.mjs
 *
 * Regenerates the icon coverage tables in:
 *   - docs/file-icons/file-icons-list.md
 *   - docs/product-icons/product-icons-list.md
 *
 * Each list (` `-prefixed bullet) is converted into a row in a 12-column
 * comparison table: Name | VS Code default | + 10 style columns.
 *
 * The 10 style columns mirror the styles supported by the source library:
 *   Rounded:  Bulk · Solid · Twotone · Duotone · Stroke
 *   Standard: Duotone · Solid · Stroke
 *   Sharp:    Solid · Stroke
 *
 * Today only "Rounded · Solid" is shipped — that column embeds the local
 * SVG from `icons/solid/...` (broken image == not yet built). Other style
 * columns are em-dashes as placeholders.
 *
 * Re-run after editing the source bullets or adding a new section.
 *   node scripts/build-icon-tables.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Style columns. `dir` is the top-level folder under `icons/` that backs the
 * column. `solid` is the legacy alias for what is conceptually "rounded-solid"
 * — kept as-is because themes/*.json already reference it.
 */
const STYLES = [
    { label: 'R·Bulk', dir: 'rounded-bulk' },
    { label: 'R·Solid', dir: 'solid' },
    { label: 'R·Twotone', dir: 'rounded-twotone' },
    { label: 'R·Duotone', dir: 'rounded-duotone' },
    { label: 'R·Stroke', dir: 'rounded-stroke' },
    { label: 'S·Duotone', dir: 'standard-duotone' },
    { label: 'S·Solid', dir: 'standard-solid' },
    { label: 'S·Stroke', dir: 'standard-stroke' },
    { label: 'Sh·Solid', dir: 'sharp-solid' },
    { label: 'Sh·Stroke', dir: 'sharp-stroke' },
];

const HEADER = `| Name | VS Code | ${STYLES.map((s) => s.label).join(' | ')} |`;
const SEP = `| --- | :---: |${STYLES.map(() => ' :---: |').join('')}`;

const CODICON = (id) =>
    `<img src="https://raw.githubusercontent.com/microsoft/vscode-codicons/main/src/icons/${id}.svg" width="18" alt="${id}">`;

/** Strip `.svg` and surrounding backticks; collapse whitespace. */
function cleanName(raw) {
    return raw.replace(/`/g, '').replace(/\.svg$/, '').trim();
}

/**
 * Parse a markdown bullet line into row inputs.
 *
 * Heuristic: icon names are the backticked tokens that appear BEFORE the
 * first `(` or em-dash annotation. Anything after is treated as a note
 * (file-extension hint or human description) and shown as a `<sub>` next
 * to the first row.
 *
 * Examples handled:
 *   - [ ] `foo` / `bar` (`.x`, `.y`)         → rows: foo, bar; note: ".x, .y"
 *   - [ ] `foo.svg` — fallback file          → row: foo; note: "fallback file"
 *   - [ ] `foo.svg` (`.ext`)                  → row: foo; note: ".ext"
 *   - [ ] `folder-locales` / `folder-i18n`   → rows: folder-locales, folder-i18n
 */
function parseBullet(line) {
    // Split on the first annotation marker (paren or dash). Names live in
    // the head; the tail becomes the note.
    const splitMatch = line.match(/\s+(?:[—–-]\s|\()/);
    const head = splitMatch ? line.slice(0, splitMatch.index) : line;
    let tail = splitMatch ? line.slice(splitMatch.index).trim() : '';

    // Tidy the tail into a plain note string.
    tail = tail.replace(/^[—–-]\s*/, '').replace(/`/g, '').trim();
    if (tail.startsWith('(') && tail.endsWith(')')) {
        tail = tail.slice(1, -1).trim();
    }

    const tickMatches = [...head.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (tickMatches.length === 0) return [];

    // Split slash-joined names (e.g. `foo` / `bar`) into separate rows.
    const names = tickMatches.flatMap((n) =>
        n.includes('/') ? n.split('/').map((s) => s.trim()) : [n]
    );

    return names.map((n, i) => ({
        name: cleanName(n),
        note: i === 0 ? tail : '',
    }));
}

/** Build a single table row. */
function row({ name, note }, ctx) {
    const cells = STYLES.map((style) => {
        const rel = `${ctx.localPrefix.replace('{style}', style.dir)}/${name}.svg`;
        // Resolve relative to the doc's directory to check existence on disk.
        const abs = path.resolve(path.dirname(ctx.path), rel);
        if (!existsSync(abs)) return '·';
        return `<img src="${rel}" width="18" alt="—">`;
    });

    const vsCode = ctx.vsCode(name);

    const display = note
        ? `\`${name}\` <sub>${note.replace(/\|/g, '\\|')}</sub>`
        : `\`${name}\``;

    return `| ${display} | ${vsCode} | ${cells.join(' | ')} |`;
}

/**
 * Rewrite a doc:
 *   - Strip any existing generated tables (lines starting with `|`).
 *   - Preserve the source bullets verbatim — they are the source of truth.
 *   - After each section's bullet block, append a regenerated table.
 *   - Dedupe icon names across the whole file (first occurrence wins).
 */
function transform(src, ctx) {
    // 1. Drop any prior table lines so re-runs are idempotent.
    const cleaned = src
        .split('\n')
        .filter((l) => !/^\s*\|/.test(l))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');

    // 2. Walk the cleaned doc; whenever a section ends, inject a table.
    const lines = cleaned.split('\n');
    const out = [];
    const seen = new Set();
    let bulletBuf = [];

    const flushTable = () => {
        if (bulletBuf.length === 0) return;
        // Trim trailing blanks that were just emitted before the heading.
        while (out.length && out[out.length - 1] === '') out.pop();
        out.push('');
        out.push(HEADER);
        out.push(SEP);
        for (const e of bulletBuf) out.push(row(e, ctx));
        out.push('');
        bulletBuf = [];
    };

    for (const line of lines) {
        if (line.startsWith('#')) {
            flushTable();
            out.push(line);
            continue;
        }

        if (line.trim() === '---') {
            flushTable();
            out.push(line);
            continue;
        }

        const bulletMatch = line.match(/^\s*-\s*(?:\[[ x]\]\s*)?(.*)$/);
        if (bulletMatch && line.trim() !== '') {
            out.push(line); // keep bullet verbatim
            for (const e of parseBullet(bulletMatch[1])) {
                if (seen.has(e.name)) continue;
                seen.add(e.name);
                bulletBuf.push(e);
            }
            continue;
        }

        out.push(line);
    }
    flushTable();

    return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

const TARGETS = [
    {
        path: path.join(ROOT, 'docs/file-icons/file-icons-list.md'),
        // {style} is replaced with each STYLES.dir at row build time.
        localPrefix: '../../icons/{style}/file-icons/dark',
        // Default file-icon theme has no per-extension icon — fall back to a
        // generic codicon for files vs folders.
        vsCode: (name) =>
            CODICON(name.startsWith('folder') ? 'folder' : 'file'),
    },
    {
        path: path.join(ROOT, 'docs/product-icons/product-icons-list.md'),
        localPrefix: '../../icons/{style}/product-icons',
        vsCode: (name) => CODICON(name),
    },
];

for (const t of TARGETS) {
    const src = await readFile(t.path, 'utf8');
    const out = transform(src, t);
    await writeFile(t.path, out, 'utf8');
    console.log(`✓ rewrote ${path.relative(ROOT, t.path)}`);
}
