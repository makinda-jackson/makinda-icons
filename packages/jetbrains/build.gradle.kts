// Makinda Icons — JetBrains plugin build
// Uses the new IntelliJ Platform Gradle Plugin (2.x).

plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij.platform") version "2.1.0"
}

group = "com.makinda.icons"
version = providers.gradleProperty("pluginVersion").get()

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

kotlin {
    jvmToolchain(17)
}

dependencies {
    intellijPlatform {
        // 2023.3 = IC-233 baseline (covers all current JetBrains IDEs)
        intellijIdeaCommunity("2023.3")
        instrumentationTools()
    }
}

intellijPlatform {
    pluginConfiguration {
        ideaVersion {
            sinceBuild.set("233")
            // No untilBuild — file icons don't depend on internal APIs that change
            // across major IDE versions, so accept all future builds.
            untilBuild.set(provider { null })
        }
    }

    signing {
        certificateChain = providers.environmentVariable("CERTIFICATE_CHAIN")
        privateKey = providers.environmentVariable("PRIVATE_KEY")
        password = providers.environmentVariable("PRIVATE_KEY_PASSWORD")
    }

    publishing {
        token = providers.environmentVariable("PUBLISH_TOKEN")
    }
}
