# Makinda Icons — JetBrains plugin

File icons for the IntelliJ Platform family.

## Status

**Experimental.** Targets: IntelliJ IDEA, WebStorm, PyCharm, Rider, GoLand,
RubyMine, CLion, PhpStorm, DataGrip, Android Studio.

JetBrains exposes `FileIconProvider` for Explorer/Project tool window file
icons. UI/product icons are **not** part of this plugin — JetBrains does not
expose a stable public API for those.

## Source of truth

All icon data lives in [`scripts/manifest.mjs`](../../scripts/manifest.mjs) at
the repo root. The emitter [`scripts/build-jetbrains.mjs`](../../scripts/build-jetbrains.mjs)
reads that manifest and regenerates everything under `src/main/resources/icons/`
and the `MakindaFileIconProvider` Kotlin class. **Never edit those files
directly** — they are overwritten on every build.

## Build

Gradle wrapper is checked in. From the repo root:

```sh
npm run build:jetbrains   # regenerates SVGs + Kotlin provider + plugin.xml
cd packages/jetbrains
./gradlew buildPlugin     # produces build/distributions/*.zip
```

First run downloads IntelliJ IC 2023.3 (~700 MB) and caches it. Subsequent builds finish in seconds.

## Install locally

In any JetBrains IDE: `Settings → Plugins → ⚙ → Install Plugin from Disk…` →
pick the `.zip` from `build/distributions/`.

## Publish

```sh
PUBLISH_TOKEN=<jetbrains-marketplace-token> ./gradlew publishPlugin
```
