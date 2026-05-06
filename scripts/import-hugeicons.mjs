#!/usr/bin/env node
/**
 * import-hugeicons.mjs — bulk-import SVGs from a local Hugeicons Pro library
 * into the makinda-icons style folders.
 *
 * Usage:
 *   node scripts/import-hugeicons.mjs --dry-run        # report only
 *   node scripts/import-hugeicons.mjs                  # write files
 *
 * Source layout expected (Hugeicons Pro export):
 *   <SRC>/Rounded/{Bulk,Solid,Twotone,Duotone,Stroke}/<Category>/*.svg
 *   <SRC>/Sharp/{Solid,Stroke}/<Category>/*.svg
 *
 * The script:
 *   1. Indexes every SVG by basename (lowercased, .svg stripped) per style.
 *   2. Reads canonical icon names from docs/*-icons-list.md bullets.
 *   3. For each canonical name, tries exact match → known alias → variant
 *      (e.g. `foo` → `foo-01`).
 *   4. Copies matched SVGs into icons/<style-dir>/{file-icons/dark,product-icons}/.
 *
 * Standard·{Duotone,Solid,Stroke} are not present in this Hugeicons export
 * and stay empty. Drop those columns from the table or source them later.
 */

import { readFile, copyFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = '/Users/makindajack/Downloads/Compressed/Hugeicons Pro/25,000+ SVG icons';
const DRY = process.argv.includes('--dry-run');

/** Source style folder → makinda-icons folder name. */
const STYLE_MAP = {
    'Rounded/Bulk': 'rounded-bulk',
    'Rounded/Solid': 'solid', // legacy alias for rounded-solid
    'Rounded/Twotone': 'rounded-twotone',
    'Rounded/Duotone': 'rounded-duotone',
    'Rounded/Stroke': 'rounded-stroke',
    'Sharp/Solid': 'sharp-solid',
    'Sharp/Stroke': 'sharp-stroke',
};

/**
 * Curated aliases. Keys are canonical names from the docs lists; values are
 * candidate basenames in the Hugeicons library (first match wins). Add to
 * this list as you discover better matches.
 */
const ALIASES = {
    // Languages / runtimes (file-icons)
    javascript: ['java-script', 'javascript', 'js'],
    typescript: ['typescript', 'ts'],
    'typescript-def': ['typescript', 'ts'],
    react: ['react', 'reactjs'],
    nodejs: ['nodejs', 'node-js', 'node'],
    cpp: ['c++'],
    c: ['c-programming'],
    csharp: ['c-sharp', 'csharp'],
    fsharp: ['f-sharp', 'fsharp'],
    'objective-c': ['objective-c'],
    java: ['java'],
    php: ['php'],
    html: ['html-5'],
    bash: ['command-line', 'console'],
    zsh: ['command-line'],
    fish: ['command-line'],
    powershell: ['command-line'],
    batch: ['command-line'],
    nushell: ['command-line'],

    // Markup / data
    markdown: ['markdown', 'mark-down'],
    json: ['json'],
    jsonc: ['json'],
    json5: ['json'],
    yaml: ['yaml'],
    toml: ['toml', 'document-code'],
    xml: ['xml'],
    csv: ['csv', 'csv-01'],
    tsv: ['csv-01'],
    env: ['file-script', 'file-01'],
    dotenv: ['file-script', 'file-01'],
    editorconfig: ['file-edit'],
    gitignore: ['github'],
    gitattributes: ['github'],
    gitmodules: ['github'],
    npmignore: ['file-block'],

    // Frameworks
    'react-native': ['react'],

    // Misc media
    image: ['image-01', 'file-image'],
    svg: ['svg'],
    video: ['file-video', 'video-01'],
    audio: ['file-audio'],
    font: ['file-script', 'text-font'],
    pdf: ['pdf-01', 'file-pdf'],
    binary: ['binary-code'],
    archive: ['archive', 'archive-01'],

    // Documents
    readme: ['file-01'],
    license: ['file-security', 'license'],
    changelog: ['file-edit'],
    contributing: ['file-edit'],
    'code-of-conduct': ['file-security'],
    security: ['file-security'],
    authors: ['file-bookmark'],
    notice: ['file-bookmark'],
    todo: ['file-edit'],

    // Generic
    file: ['file-01', 'file-02'],
    folder: ['folder-01', 'folder', 'folder-02'],
    'folder-open': ['folder-open', 'folder-management'],
    'folder-root': ['folder-management'],

    // Folder names — fall back to a generic icon
    'folder-src': ['code-folder'],
    'folder-app': ['code-folder'],
    'folder-pages': ['file-edit'],
    'folder-routes': ['link-01'],
    'folder-components': ['code-folder'],
    'folder-tests': ['code-folder'],
    'folder-docs': ['file-edit'],
    'folder-config': ['settings-01'],
    'folder-scripts': ['file-script'],
    'folder-public': ['globe'],
    'folder-assets': ['image-01'],
    'folder-images': ['image-01'],
    'folder-fonts': ['text-font'],
    'folder-icons': ['image-01'],
    'folder-themes': ['paint-board'],
    'folder-styles': ['paint-board'],
    'folder-dist': ['package-01'],
    'folder-build': ['package-01'],
    'folder-out': ['package-01'],
    'folder-coverage': ['file-edit'],
    'folder-cache': ['file-sync'],

    // Product icons (codicons) — common ones
    files: ['file-01'],
    search: ['search-01'],
    'source-control': ['git-branch'],
    'debug-alt': ['bug-01'],
    'debug-alt-small': ['bug-01'],
    extensions: ['package-01', 'puzzle'],
    account: ['user'],
    'settings-gear': ['settings-01', 'settings-02'],
    remote: ['globe'],
    output: ['terminal'],
    notebook: ['notebook'],
    layout: ['layout-01'],
    window: ['layout-01'],
    'multiple-windows': ['copy-01'],
    close: ['cancel-01'],
    add: ['add-01', 'plus-sign'],
    plus: ['add-01', 'plus-sign'],
    remove: ['minus-sign'],
    edit: ['edit-01', 'edit-02'],
    pencil: ['edit-01'],
    copy: ['copy-01'],
    link: ['link-01'],
    'link-external': ['link-square-01'],
    check: ['tick-01'],
    error: ['cancel-01', 'alert-02'],
    warning: ['alert-02', 'alert-01'],
    info: ['information-circle'],
    question: ['help-circle'],
    eye: ['view'],
    'eye-closed': ['view-off'],
    refresh: ['refresh'],
    sync: ['refresh'],
    play: ['play-circle', 'play'],
    stop: ['stop'],
    'git-branch': ['git-branch'],
    'git-commit': ['git-commit'],
    'git-pull-request': ['git-pull-request'],
    'git-merge': ['git-merge'],
    repo: ['github'],
    bug: ['bug-01'],
    terminal: ['terminal'],
    'terminal-bash': ['terminal'],
    bell: ['notification-01'],
    'bell-dot': ['notification-02'],
    mail: ['mail-01'],
    'mail-read': ['mail-open'],
    feedback: ['speech-bubble', 'comment-01'],
    heart: ['favourite'],
    'star-empty': ['star'],
    'star-full': ['star'],
    thumbsup: ['thumbs-up'],
    thumbsdown: ['thumbs-down'],
    settings: ['settings-01'],
    gear: ['settings-01'],
    tools: ['wrench-01'],
    key: ['key-01'],
    person: ['user'],
    home: ['home-01'],
    globe: ['globe'],
    history: ['clock-01'],
    'zoom-in': ['zoom-in-area'],
    'zoom-out': ['zoom-out-area'],
    lightbulb: ['idea-01'],
    sparkle: ['ai-magic'],
    copilot: ['ai-magic'],
    chat: ['comment-01'],
    bookmark: ['bookmark-01'],
    pin: ['pin'],
    pinned: ['pin'],
    'cloud-download': ['cloud-download'],
    'cloud-upload': ['cloud-upload'],
    cloud: ['cloud'],
    archive: ['archive'],
    package: ['package-01'],
    trash: ['delete-01'],
    save: ['floppy-disk'],
    'new-file': ['file-add'],
    'new-folder': ['folder-add'],
    folder: ['folder-01'],
    'folder-opened': ['folder-open'],
    file: ['file-01'],
    'file-code': ['document-code'],
    'arrow-up': ['arrow-up-01'],
    'arrow-down': ['arrow-down-01'],
    'arrow-left': ['arrow-left-01'],
    'arrow-right': ['arrow-right-01'],
    'chevron-up': ['arrow-up-01'],
    'chevron-down': ['arrow-down-01'],
    'chevron-left': ['arrow-left-01'],
    'chevron-right': ['arrow-right-01'],
    menu: ['menu-01'],
    ellipsis: ['more-horizontal'],
    'kebab-vertical': ['more-vertical'],
    filter: ['filter'],
    tag: ['tag-01'],
    inbox: ['inbox'],
    lock: ['square-lock-01'],
    unlock: ['square-unlock-01'],
};

/** Read all bullet names from a docs file. */
async function readCanonical(docPath) {
    const md = await readFile(docPath, 'utf8');
    const names = new Set();
    const bulletRe = /^\s*-\s*(?:\[[ x]\]\s*)?(.*)$/gm;
    let m;
    while ((m = bulletRe.exec(md)) !== null) {
        const head = m[1].split(/\s+(?:[—–-]\s|\()/)[0];
        for (const tick of head.matchAll(/`([^`]+)`/g)) {
            for (const part of tick[1].split('/')) {
                const n = part.trim().replace(/`/g, '').replace(/\.svg$/, '').trim();
                if (n) names.add(n);
            }
        }
    }
    return [...names];
}

/** Recursively index all SVGs under dir, returning Map<basename, fullpath>. */
async function indexStyle(dir) {
    const out = new Map();
    async function walk(d) {
        let entries;
        try { entries = await readdir(d, { withFileTypes: true }); }
        catch { return; }
        for (const e of entries) {
            const full = path.join(d, e.name);
            if (e.isDirectory()) await walk(full);
            else if (e.isFile() && e.name.endsWith('.svg')) {
                const base = e.name.replace(/\.svg$/i, '').toLowerCase();
                if (!out.has(base)) out.set(base, full);
            }
        }
    }
    await walk(dir);
    return out;
}

function pickCandidate(canonical, index) {
    const tries = [canonical, ...(ALIASES[canonical] || [])];
    for (const t of tries) {
        const k = t.toLowerCase();
        if (index.has(k)) return index.get(k);
    }
    return null;
}

const TARGETS = [
    {
        kind: 'file-icons',
        docPath: path.join(ROOT, 'docs/file-icons/file-icons-list.md'),
        outSub: 'file-icons/dark',
    },
    {
        kind: 'product-icons',
        docPath: path.join(ROOT, 'docs/product-icons/product-icons-list.md'),
        outSub: 'product-icons',
    },
];

async function main() {
    if (!existsSync(SRC)) {
        console.error(`Source library not found: ${SRC}`);
        process.exit(1);
    }

    // Index all styles up front.
    const styleIndex = {};
    for (const [src, slug] of Object.entries(STYLE_MAP)) {
        styleIndex[slug] = await indexStyle(path.join(SRC, src));
        console.log(`indexed ${slug}: ${styleIndex[slug].size} svgs`);
    }

    let totalCopied = 0;
    let totalAttempted = 0;
    const unmappedByTarget = {};

    for (const t of TARGETS) {
        const names = await readCanonical(t.docPath);
        console.log(`\n→ ${t.kind}: ${names.length} canonical names`);

        const unmapped = [];
        for (const name of names) {
            for (const [slug, idx] of Object.entries(styleIndex)) {
                const src = pickCandidate(name, idx);
                totalAttempted++;
                if (!src) continue;
                const dest = path.join(
                    ROOT,
                    'icons',
                    slug,
                    t.outSub,
                    `${name}.svg`
                );
                if (DRY) {
                    totalCopied++;
                    continue;
                }
                await mkdir(path.dirname(dest), { recursive: true });
                await copyFile(src, dest);
                totalCopied++;
            }
            // Record names that didn't match in ANY style.
            const anyMatch = Object.values(styleIndex).some((idx) =>
                pickCandidate(name, idx)
            );
            if (!anyMatch) unmapped.push(name);
        }

        unmappedByTarget[t.kind] = unmapped;
        const matched = names.length - unmapped.length;
        console.log(
            `  matched: ${matched}/${names.length} (${Math.round((matched / names.length) * 100)}%)`
        );
        if (unmapped.length > 0) {
            console.log(`  unmapped (${unmapped.length}): ${unmapped.slice(0, 30).join(', ')}${unmapped.length > 30 ? ', …' : ''}`);
        }
    }

    console.log(
        `\n${DRY ? 'DRY RUN — ' : ''}copied ${totalCopied} files across all styles (${totalAttempted} cells considered).`
    );
    if (DRY) console.log('Re-run without --dry-run to actually write files.');
}

main().catch((e) => { console.error(e); process.exit(1); });
