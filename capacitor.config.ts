import type { CapacitorConfig } from '@capacitor/cli';

// If you change appId, appName, or webDir, update android/capacitor.config.json the same way
// so `npx cap` still works when run from the android/ folder.
const config: CapacitorConfig = {
  appId: 'com.worldexplorers.app',
  appName: 'מגלי העולם',
  webDir: 'dist',
};

export default config;
