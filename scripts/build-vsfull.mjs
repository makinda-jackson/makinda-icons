// Makinda Icons — Visual Studio (full Windows IDE) emitter
//
// Generates a VSIX-ready package layout for the Visual Studio Image Service:
//
//   packages/visualstudio/MakindaIcons/
//     extension.vsixmanifest                     (VSIX 2.0 manifest)
//     MakindaIcons.imagemanifest                 (Image Service mapping)
//     Resources/<name>.png                       (16/24/32 px composite — see below)
//     source.extension.code                      (placeholder)
//     [Content_Types].xml                        (VSIX content types)
//     README.md
//
// Visual Studio's image service consumes a single `.imagemanifest` file that
// associates `<Image>` definitions with `<ImageFile Extension="...">` entries.
// VS picks the best size from `<Source>` children at render time. We emit one
// PNG per icon at 16/24/32 px (the spec's recommended file-icon sizes) and
// register one moniker per manifest entry that has at least one extension or
// exact filename.
//
// The actual VSIX is just a zip of the package directory with a `.vsix`
// extension. Auto-zipping is attempted at the end if `zip` is on PATH.
//
// Reference:
//   • Image Service & monikers: https://learn.microsoft.com/visualstudio/extensibility/image-service-and-catalog
//   • VSIX manifest schema:     https://learn.microsoft.com/visualstudio/extensibility/vsix-extension-schema-2-0-reference

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";
import { fileIcons } from "./manifest.mjs";
import { enabledStyles } from "./styles.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const HUGEICONS_ROOT = process.env.HUGEICONS_ROOT
    || "/Users/makindajack/Downloads/Compressed/Hugeicons Pro/25,000+ SVG icons";
const pkgJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

const FILL = "#1e2022"; // dark glyph for VS's typical light Solution Explorer
const SIZES = [16, 24, 32]; // VS Image Service file-icon sizes

const styleId = process.env.STYLE || "solid";
const style = enabledStyles().find((s) => s.id === styleId);
if (!style) {
    console.error(`Unknown or disabled style "${styleId}". Enable it in scripts/styles.mjs first.`);
    process.exit(1);
}

const PKG_NAME = "MakindaIcons";
const PKG_GUID = "8a4f1d6e-2c7b-4b9f-9b3a-3e5a1c0d6f12"; // stable, repo-owned
const PKG_VERSION = pkgJson.version;

const pkgRoot = path.join(repoRoot, "packages", "visualstudio", PKG_NAME);
const resourcesDir = path.join(pkgRoot, "Resources");
fs.mkdirSync(resourcesDir, { recursive: true });
for (const f of fs.readdirSync(resourcesDir)) {
    if (f.endsWith(".png")) fs.unlinkSync(path.join(resourcesDir, f));
}

// ---------- Resolve source SVG (same convention as Sublime / JetBrains) ----------

function resolveSrc(rel) {
    if (path.isAbsolute(rel)) return rel;
    if (style.srcRoot && !rel.startsWith("../")) {
        return path.join(HUGEICONS_ROOT, style.srcRoot, rel);
    }
    return path.join(HUGEICONS_ROOT, rel);
}

function recolor(svg, color) {
    return svg
        .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`)
        .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `stroke="${color}"`);
}

function pascal(name) {
    return name
        .split(/[-_]/)
        .filter(Boolean)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}

function xmlEscape(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ---------- Rasterize + collect bindings ----------

let renderedIcons = 0;
const missingSvgs = [];
const monikers = []; // { name, id, extensions, filenames }
let nextId = 1000; // VS image IDs are arbitrary i32; pick a private range

for (const icon of fileIcons) {
    const srcAbs = resolveSrc(icon.src);
    if (!fs.existsSync(srcAbs)) {
        missingSvgs.push(`${icon.name}: ${icon.src}`);
        continue;
    }
    const svg = recolor(fs.readFileSync(srcAbs, "utf8"), FILL);
    for (const px of SIZES) {
        const png = new Resvg(svg, {
            fitTo: { mode: "width", value: px },
            background: "rgba(0,0,0,0)",
        }).render().asPng();
        fs.writeFileSync(path.join(resourcesDir, `${icon.name}.${px}.png`), png);
    }
    renderedIcons++;
    monikers.push({
        name: icon.name,
        symbol: pascal(icon.name),
        id: nextId++,
        extensions: icon.extensions ?? [],
        filenames: icon.fileNames ?? [],
    });
}

// ---------- Generate .imagemanifest ----------
//
// Symbols section declares re-usable substitutions. Images defines monikers
// (Guid + ID) with one Source per size. ImageFiles routes file extensions
// (and exact filenames) to a moniker.

const symbolsXml = [
    `        <String Name="Resources" Value="/${PKG_NAME};Component/Resources" />`,
    `        <Guid Name="MakindaIconsGuid" Value="{${PKG_GUID}}" />`,
    ...monikers.map((m) => `        <ID Name="${m.symbol}" Value="${m.id}" />`),
].join("\n");

const imagesXml = monikers
    .map((m) => {
        const sources = SIZES.map(
            (px) =>
                `            <Source Uri="$(Resources)/${m.name}.${px}.png"><Size Value="${px}" /></Source>`
        ).join("\n");
        return `        <Image Guid="$(MakindaIconsGuid)" ID="$(${m.symbol})">\n${sources}\n        </Image>`;
    })
    .join("\n");

const imageFilesXml = monikers
    .flatMap((m) => {
        const lines = [];
        for (const ext of m.extensions) {
            lines.push(
                `        <ImageFile Extension="${xmlEscape("." + ext)}" Guid="$(MakindaIconsGuid)" ID="$(${m.symbol})" />`
            );
        }
        for (const fn of m.filenames) {
            lines.push(
                `        <ImageFile Name="${xmlEscape(fn)}" Guid="$(MakindaIconsGuid)" ID="$(${m.symbol})" />`
            );
        }
        return lines;
    })
    .join("\n");

const imageManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<ImageManifest xmlns="http://schemas.microsoft.com/VisualStudio/ImageManifestSchema/2014">
    <Symbols>
${symbolsXml}
    </Symbols>
    <Images>
${imagesXml}
    </Images>
    <ImageFiles>
${imageFilesXml}
    </ImageFiles>
</ImageManifest>
`;

fs.writeFileSync(path.join(pkgRoot, `${PKG_NAME}.imagemanifest`), imageManifestXml);

// ---------- Generate extension.vsixmanifest (VSIX 2.0) ----------

const vsixManifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
    <Metadata>
        <Identity Id="${pkgJson.publisher}.${PKG_NAME}" Version="${PKG_VERSION}" Language="en-US" Publisher="Makinda Jackson" />
        <DisplayName>Makinda Icons</DisplayName>
        <Description xml:space="preserve">File icons for Visual Studio — same icon set as the Makinda Icons VS Code extension. ${renderedIcons} file icons via the Image Service.</Description>
        <MoreInfo>https://github.com/makindajack/makinda-icons</MoreInfo>
        <License>LICENSE.md</License>
        <Tags>icons, file-icons, theme, makinda, hugeicons</Tags>
    </Metadata>
    <Installation>
        <InstallationTarget Id="Microsoft.VisualStudio.Community" Version="[17.0,)" />
        <InstallationTarget Id="Microsoft.VisualStudio.Pro" Version="[17.0,)" />
        <InstallationTarget Id="Microsoft.VisualStudio.Enterprise" Version="[17.0,)" />
    </Installation>
    <Dependencies>
        <Dependency Id="Microsoft.Framework.NDP" DisplayName=".NET Framework" d:Source="Manual" Version="[4.7.2,)" />
    </Dependencies>
    <Prerequisites>
        <Prerequisite Id="Microsoft.VisualStudio.Component.CoreEditor" Version="[17.0,)" DisplayName="Visual Studio core editor" />
    </Prerequisites>
    <Assets>
        <Asset Type="Microsoft.VisualStudio.ImageManifest" d:Source="File" Path="${PKG_NAME}.imagemanifest" />
    </Assets>
</PackageManifest>
`;

fs.writeFileSync(path.join(pkgRoot, "extension.vsixmanifest"), vsixManifest);

// ---------- [Content_Types].xml ----------

const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="vsixmanifest" ContentType="text/xml" />
    <Default Extension="imagemanifest" ContentType="text/xml" />
    <Default Extension="png" ContentType="image/png" />
    <Default Extension="md" ContentType="text/markdown" />
    <Default Extension="txt" ContentType="text/plain" />
</Types>
`;

fs.writeFileSync(path.join(pkgRoot, "[Content_Types].xml"), contentTypes);

// ---------- License copy + Package README ----------

try {
    fs.copyFileSync(path.join(repoRoot, "LICENSE.md"), path.join(pkgRoot, "LICENSE.md"));
} catch {
    /* fine — license stays in repo root if missing */
}

const pkgReadme = `# Makinda Icons — Visual Studio (Windows IDE)

Auto-generated by \`scripts/build-vsfull.mjs\`. Do not edit by hand —
re-run \`npm run build:vsfull\` after changing
[\`scripts/manifest.mjs\`](../../../scripts/manifest.mjs).

## What's here

- \`extension.vsixmanifest\` — VSIX 2.0 manifest, targets VS 2022 (17.0)+
- \`MakindaIcons.imagemanifest\` — VS Image Service map (${monikers.length} monikers,
  ${monikers.reduce((n, m) => n + m.extensions.length, 0)} extension bindings,
  ${monikers.reduce((n, m) => n + m.filenames.length, 0)} filename bindings)
- \`Resources/<name>.<size>.png\` — 16/24/32 px raster variants per icon
- \`[Content_Types].xml\` — required by the VSIX zip format

## Build the VSIX

The VSIX is just a zip of this directory with the extension renamed:

\`\`\`bash
cd "packages/visualstudio/MakindaIcons"
zip -rq ../makinda-icons.vsix .
\`\`\`

\`npm run build:vsfull\` performs that step automatically when \`zip\` is on
PATH. Drop the \`.vsix\` onto Visual Studio (or run \`VSIXInstaller.exe\`) to
install.

## Limitations

- **Windows-only.** This package is irrelevant on macOS and Linux — VS for Mac
  was retired and never shared this extensibility surface.
- **File icons only.** VS's Solution Explorer / tab strip is what the Image
  Service themes; tool-window and command icons are owned by individual
  packages and aren't in scope here (parallel to JetBrains).
- **Single fill.** PNGs are pre-rasterized in \`#1e2022\` to match a typical
  light theme. A future build could ship a parallel \`*.dark.png\` set; VS's
  Image Service can pick by background but only when registered in the
  manifest.
`;

fs.writeFileSync(path.join(pkgRoot, "README.md"), pkgReadme);

// ---------- Auto-zip into .vsix ----------

const vsixOut = path.join(repoRoot, "packages", "visualstudio", "makinda-icons.vsix");
let zipped = false;
try {
    fs.rmSync(vsixOut, { force: true });
    execFileSync("zip", ["-rq", vsixOut, "."], { cwd: pkgRoot, stdio: "inherit" });
    zipped = true;
} catch (err) {
    console.warn(`\nSkipped auto-zip (${err.code === "ENOENT" ? "`zip` not on PATH" : err.message}).`);
    console.warn(`Manual: cd "packages/visualstudio/${PKG_NAME}" && zip -rq ../makinda-icons.vsix .`);
}

// ---------- Report ----------

console.log("makinda-icons (visualstudio) build");
console.log(`  style:               ${style.id}`);
console.log(`  HUGEICONS_ROOT:      ${HUGEICONS_ROOT}`);
console.log(`  rasterized icons:    ${renderedIcons} (×${SIZES.length} sizes = ${renderedIcons * SIZES.length} PNGs)`);
console.log(`  monikers:            ${monikers.length}`);
console.log(`  ext bindings:        ${monikers.reduce((n, m) => n + m.extensions.length, 0)}`);
console.log(`  filename bindings:   ${monikers.reduce((n, m) => n + m.filenames.length, 0)}`);
console.log(`  missing SVGs:        ${missingSvgs.length}`);
for (const m of missingSvgs) console.log(`    • ${m}`);

if (zipped) {
    const bytes = fs.statSync(vsixOut).size;
    console.log(`\nWrote: ${path.relative(repoRoot, vsixOut)} (${(bytes / 1024).toFixed(1)} KB)`);
}

if (missingSvgs.length) process.exit(1);
