# Building the KrishiYantra Android APK

Your app is set up for both **PWA** (install from browser) and **Capacitor** (native APK).

---

## Option 1: Install as PWA (no APK, no Android Studio)

1. Deploy your site to **HTTPS** (e.g. Vercel).
2. On your phone, open the site in **Chrome** (Android) or **Safari** (iOS).
3. Use **“Add to Home screen”** / **“Install app”**.
4. The app opens fullscreen with no browser UI (same experience as the APK).

No APK file is generated; the app runs from the browser engine.

---

## Option 2: Build an APK with Capacitor

### Prerequisites

- **Node.js** (you already have this).
- **Java Development Kit (JDK) 17**  
  - Download: [Adoptium JDK 17](https://adoptium.net/) or [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)  
  - Set `JAVA_HOME` to the JDK install folder (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`).
- **Android Studio** (recommended)  
  - Download: [developer.android.com/studio](https://developer.android.com/studio)  
  - During setup, install **Android SDK** and **Android SDK Build-Tools**.

### Build steps

1. **Build the web app and sync to Android**
   ```bash
   npm run cap:android
   ```
   This runs `npm run build` and copies the built files into the `android` project.

2. **Open the Android project**
   ```bash
   npm run open:android
   ```
   This opens the `android` folder in Android Studio.

3. **Build the APK in Android Studio**
   - Wait for Gradle sync to finish.
   - **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
   - When the build finishes, use **“Locate”** to find the APK.

   **APK location (after a successful build):**  
   `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Transfer and install**
   - Copy `app-debug.apk` to your phone (USB, cloud, etc.).
   - On the phone, allow “Install from unknown sources” if prompted, then open the APK and install.

### Build from command line (optional)

If `JAVA_HOME` points to JDK 17 and Android SDK is installed:

```bash
cd android
./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.

### Release (signed) APK for Play Store

In Android Studio: **Build → Generate Signed Bundle / APK**, then follow the wizard to create a keystore and a release APK or AAB.

---

## Mobile UX already in the app

- **PWA manifest**: installable, standalone display, theme color.
- **Viewport & meta**: mobile-friendly, safe area, status bar.
- **CSS**: safe-area insets for notched devices, tap highlight disabled for a smoother feel.
- **Capacitor**: splash screen and app shell for the APK.

For a **quick install on your phone without building an APK**, use **Option 1** (PWA) after deploying to HTTPS.
