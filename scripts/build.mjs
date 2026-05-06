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
    const fileIconsDarkDir = path.join(repoRoot, "icons", style.id, "file-icons", "dark");
    const fileIconsLightDir = path.join(repoRoot, "icons", style.id, "file-icons", "light");
    const productIconsDir = path.join(repoRoot, "icons", style.id, "product-icons");
    const themesDir = path.join(repoRoot, "themes");

    for (const dir of [fileIconsDarkDir, fileIconsLightDir, productIconsDir, themesDir]) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let copied = 0;
    const missing = [];

    // Brand fills used when generating light/dark variants of file icons.
    // VS Code never applies CSS `color` to file icons, so we ship two physical
    // SVG copies and let the icon-theme JSON's `light` block swap them.
    const DARK_FILL = "#e7e8ea";   // makinda-themes dark fg.default
    const LIGHT_FILL = "#1e2022";  // makinda-themes light fg.default

    function copyIcon(srcRel, destPath, opts = {}) {
        const srcAbs = resolveSrc(style, srcRel);
        if (!fs.existsSync(srcAbs)) {
            missing.push(`${opts.label}: ${srcRel}`);
            return false;
        }
        if (opts.recolorToCurrentColor) {
            // VS Code colors product icons via CSS `color`, which only works when
            // the SVG uses fill="currentColor"/stroke="currentColor". Hugeicons
            // ships with hard-coded #141B34 fills, so without this rewrite the
            // icons render as dark navy on dark themes (invisible).
            const svg = fs.readFileSync(srcAbs, "utf8")
                .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
                .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"');
            fs.writeFileSync(destPath, svg);
        } else if (opts.recolorTo) {
            const svg = fs.readFileSync(srcAbs, "utf8")
                .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `fill="${opts.recolorTo}"`)
                .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `stroke="${opts.recolorTo}"`);
            fs.writeFileSync(destPath, svg);
        } else {
            fs.copyFileSync(srcAbs, destPath);
        }
        copied++;
        return true;
    }

    // ---- File icons ----
    // Two variants per icon: dark (default) + light (used when a light color
    // theme is active, via the `light` block in the theme JSON).
    const iconDefs = {};
    const byExt = {};
    const byName = {};
    const byLang = {};
    const lightDefs = {};
    const lightByExt = {};
    const lightByName = {};
    const lightByLang = {};

    for (const icon of fileIcons) {
        const darkDest = path.join(fileIconsDarkDir, `${icon.name}.svg`);
        const lightDest = path.join(fileIconsLightDir, `${icon.name}.svg`);
        if (!copyIcon(icon.src, darkDest, {
            label: `file-icon ${icon.name} (dark)`,
            recolorTo: DARK_FILL,
        })) continue;
        copyIcon(icon.src, lightDest, {
            label: `file-icon ${icon.name} (light)`,
            recolorTo: LIGHT_FILL,
        });

        const defKey = `_${icon.name.replace(/-/g, "_")}`;
        const lightKey = `${defKey}_light`;
        iconDefs[defKey] = { iconPath: `../icons/${style.id}/file-icons/dark/${icon.name}.svg` };
        lightDefs[lightKey] = { iconPath: `../icons/${style.id}/file-icons/light/${icon.name}.svg` };

        for (const ext of icon.extensions ?? []) {
            byExt[ext.toLowerCase()] = defKey;
            lightByExt[ext.toLowerCase()] = lightKey;
        }
        for (const fn of icon.fileNames ?? []) {
            byName[fn.toLowerCase()] = defKey;
            lightByName[fn.toLowerCase()] = lightKey;
        }
        for (const lid of icon.languageIds ?? []) {
            byLang[lid.toLowerCase()] = defKey;
            lightByLang[lid.toLowerCase()] = lightKey;
        }
    }

    const folderNameMap = {};
    const folderNameExpandedMap = {};
    const folderNameMapLight = {};
    const folderNameExpandedMapLight = {};
    for (const [name, iconName] of Object.entries(folderNames)) {
        const defKey = `_${iconName.replace(/-/g, "_")}`;
        const lightKey = `${defKey}_light`;
        if (!iconDefs[defKey]) continue;
        folderNameMap[name.toLowerCase()] = defKey;
        folderNameExpandedMap[name.toLowerCase()] = defKey;
        folderNameMapLight[name.toLowerCase()] = lightKey;
        folderNameExpandedMapLight[name.toLowerCase()] = lightKey;
    }

    const fileTheme = {
        $schema: "vscode://schemas/icon-theme",
        iconDefinitions: { ...iconDefs, ...lightDefs },
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
        light: {
            file: "_file_light",
            folder: "_folder_light",
            folderExpanded: "_folder_open_light",
            rootFolder: "_folder_light",
            rootFolderExpanded: "_folder_open_light",
            fileExtensions: lightByExt,
            fileNames: lightByName,
            languageIds: lightByLang,
            folderNames: folderNameMapLight,
            folderNamesExpanded: folderNameExpandedMapLight,
        },
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
        if (!copyIcon(icon.src, dest, {
            label: `product-icon ${icon.id}`,
            recolorToCurrentColor: true,
        })) continue;
        productDefs[icon.id] = { iconPath: `../icons/${style.id}/product-icons/${icon.id}.svg` };
    }
    const productTheme = {
        $schema: "vscode://schemas/product-icon-theme",
        iconDefinitions: productDefs,
        fonts: [],
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
