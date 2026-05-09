// Style registry — one entry per upstream style we ship as a theme variant.
//
// `id`           : kebab-case slug used in theme ids and on-disk paths
// `label`        : suffix shown in the VS Code theme picker
// `srcRoot`      : upstream subpath (under ICONS_SRC_ROOT) for this style
// `categoryAlias`: optional remap when a manifest path's category folder
//                  doesn't exist in this style (e.g. Sharp collapses
//                  "Arrows (Round)" / "Arrows (Sharp)" → "Arrows")
// `enabled`      : when false, the style is registered for documentation
//                  purposes but skipped by the build
//
// Phase plan: see docs/project-scope.md §4.

export const styles = [
    {
        id: "solid",
        label: "Solid",
        srcRoot: "Rounded/Solid",
        enabled: true, // Phase 1 — filled (start here)
        // Some icons are renamed in the Solid set vs Duotone. Map manifest
        // paths (left) to the actual on-disk filename (right). Applied after
        // categoryAlias.
        fileAlias: {
            "Add Remove Delete/remove-01.svg": "Add Remove Delete/remove.svg",
            "Add Remove Delete/cancel-01.svg": "Add Remove Delete/clear-01.svg",
            "Add Remove Delete/cancel-square.svg": "Add Remove Delete/clear-square.svg",
        },
    },
    {
        id: "duotone",
        label: "Duotone",
        srcRoot: "Rounded/Duotone",
        enabled: true, // v1.1.0
    },
    {
        id: "twotone",
        label: "Twotone",
        srcRoot: "Rounded/Twotone",
        enabled: true, // v1.1.0
    },
    {
        id: "stroke",
        label: "Stroke",
        srcRoot: "Rounded/Stroke",
        enabled: true, // v1.1.0
    },
    {
        id: "bulk",
        label: "Bulk",
        srcRoot: "Rounded/Bulk",
        enabled: true, // v1.1.0
    },
    {
        id: "sharp-solid",
        label: "Sharp Solid",
        srcRoot: "Sharp/Solid",
        enabled: true, // v1.1.0
        categoryAlias: {
            "Arrows (Round)": "Arrows",
            "Arrows (Sharp)": "Arrows",
        },
    },
    {
        id: "sharp-stroke",
        label: "Sharp Stroke",
        srcRoot: "Sharp/Stroke",
        enabled: true, // v1.1.0
        categoryAlias: {
            "Arrows (Round)": "Arrows",
            "Arrows (Sharp)": "Arrows",
        },
    },
];

export function enabledStyles() {
    return styles.filter((s) => s.enabled);
}
