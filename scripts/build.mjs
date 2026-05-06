// Builds makinda-icons assets. Iterates every enabled style in
// scripts/styles.mjs, applies the manifest from scripts/manifest.mjs against
// that style's source root, copies the SVGs, and emits per-style theme JSONs.
//
//   • icons/<style>/file-icons/<name>.svg
//   • icons/<style>/product-icons/<id>.svg
//   • themes/makinda-file-icon-theme.<style>.json
//   • themes/makinda-product-icon-theme.<style>.json
//
// Override the Hugeicons source root with HUGEICONS_ROOT env var.
// Pass --style=<id> (repeatable) to limit the build to specific styles.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { fileIcons, folderNames, productIcons } from "./manifest.mjs";
import { enabledStyles, styles as allStyles } from "./styles.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const HUGEICONS_ROOT = process.env.HUGEICONS_ROOT
    || "/Users/makindajack/Downloads/Compressed/Hugeicons Pro/25,000+ SVG icons";

// Allow CLI selection (e.g. `node scripts/build.mjs --style=solid`)
const cliStyles = process.argv
    .filter((a) => a.startsWith("--style="))
    .map((a) => a.slice("--style=".length));

const targetStyles = cliStyles.length
    ? allStyles.filter((s) => cliStyles.includes(s.id))
    : enabledStyles();

if (!targetStyles.length) {
    console.error("No styles selected. Enable one in scripts/styles.mjs or pass --style=<id>.");
    process.exit(1);
}

function resolveSrc(style, manifestPath) {
    const aliased = style.fileAlias?.[manifestPath] ?? manifestPath;
    const [category, ...rest] = aliased.split("/");
    const remapped = style.categoryAlias?.[category] ?? category;
    return path.join(HUGEICONS_ROOT, style.srcRoot, remapped, rest.join("/"));
}

function buildStyle(style) {
    const fileIconsDir = path.join(repoRoot, "icons", style.id, "file-icons");
    const productIconsDir = path.join(repoRoot, "icons", style.id, "product-icons");
    const themesDir = path.join(repoRoot, "themes");

    for (const dir of [fileIconsDir, productIconsDir, themesDir]) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let copied = 0;
    const missing = [];

    function copyIcon(srcRel, destPath, opts = {}) {
        const srcAbs = resolveSrc(style, srcRel);
        if (!fs.existsSync(srcAbs)) {
            missing.push(`${opts.label}: ${srcRel}`);
            return false;
        }
        fs.copyFileSync(srcAbs, destPath);
        copied++;
        return true;
    }

    // ---- File icons ----
    const iconDefs = {};
    const byExt = {};
    const byName = {};
    const byLang = {};

    for (const icon of fileIcons) {
        const dest = path.join(fileIconsDir, `${icon.name}.svg`);
        if (!copyIcon(icon.src, dest, { label: `file-icon ${icon.name}` })) continue;

        const defKey = `_${icon.name.replace(/-/g, "_")}`;
        iconDefs[defKey] = { iconPath: `../icons/${style.id}/file-icons/${icon.name}.svg` };

        for (const ext of icon.extensions ?? []) byExt[ext.toLowerCase()] = defKey;
        for (const fn of icon.fileNames ?? []) byName[fn.toLowerCase()] = defKey;
        for (const lid of icon.languageIds ?? []) byLang[lid.toLowerCase()] = defKey;
    }

    const folderNameMap = {};
    const folderNameExpandedMap = {};
    for (const [name, iconName] of Object.entries(folderNames)) {
        const defKey = `_${iconName.replace(/-/g, "_")}`;
        if (!iconDefs[defKey]) continue;
        folderNameMap[name.toLowerCase()] = defKey;
        folderNameExpandedMap[name.toLowerCase()] = defKey;
    }

    const fileTheme = {
        $schema: "vscode://schemas/icon-theme",
        iconDefinitions: iconDefs,
        file: "_file",
        folder: "_folder",
        folderExpanded: "_folder_open",
        rootFolder: "_folder",
        rootFolderExpanded: "_folder_open",
        fileExtensions: byExt,
        fileNames: byName,
        languageIds: byLang,
        folderNames: folderNameMap,
        folderNamesExpanded: folderNameExpandedMap,
        hidesExplorerArrows: false,
    };
    fs.writeFileSync(
        path.join(themesDir, `makinda-file-icon-theme.${style.id}.json`),
        JSON.stringify(fileTheme, null, 2) + "\n",
    );

    // ---- Product icons ----
    const productDefs = {};
    for (const icon of productIcons) {
        const dest = path.join(productIconsDir, `${icon.id}.svg`);
        if (!copyIcon(icon.src, dest, { label: `product-icon ${icon.id}` })) continue;
        productDefs[icon.id] = { iconPath: `../icons/${style.id}/product-icons/${icon.id}.svg` };
    }
    const productTheme = {
        $schema: "vscode://schemas/product-icon-theme",
        iconDefinitions: productDefs,
    };
    fs.writeFileSync(
        path.join(themesDir, `makinda-product-icon-theme.${style.id}.json`),
        JSON.stringify(productTheme, null, 2) + "\n",
    );

    return { copied, missing };
}

console.log(`makinda-icons build`);
console.log(`  HUGEICONS_ROOT: ${HUGEICONS_ROOT}`);

let failed = false;
for (const style of targetStyles) {
    console.log(`\n  ▸ ${style.id} (${style.label}) — ${style.srcRoot}`);
    const { copied, missing } = buildStyle(style);
    console.log(`      copied:  ${copied}`);
    console.log(`      missing: ${missing.length}`);
    if (missing.length) {
        failed = true;
        for (const m of missing) console.log(`        • ${m}`);
    }
}

console.log(failed ? "\nBuild completed with missing icons.\n" : "\nBuild completed cleanly.\n");
process.exit(failed ? 1 : 0);
