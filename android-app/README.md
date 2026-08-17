# PsyEtica Android

Native, account-free Android wrapper for the offline PsyEtica learning app.

## Build

Requirements: Java 17, Android SDK Platform 36, Android Build Tools 36.0.0, and Gradle 8.13+.

1. Set `sdk.dir` in `local.properties`.
2. Run `gradlew.bat assembleDebug` on Windows or `./gradlew assembleDebug` on macOS/Linux.
3. Find the APK in `app/build/outputs/apk/debug/`.

The assets in `app/src/main/assets/www/data/` are a build snapshot of the repository's curated `data/` folder. Re-copy them after source-data updates.
