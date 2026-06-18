import type { CapacitorConfig } from '@capacitor/cli';
import * as path from 'path';
import 'dotenv/config';

const config: CapacitorConfig = {
  appId: 'com.iamvkryt.yomusic',
  appName: 'Yo Music',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
    CapacitorHttp: {
      enabled: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#18C066',
    },
  },
};
// Inject server block for dev
if (process.env.NODE_ENV === 'development') {
  config.server = {
    url: 'http://localhost:5173',
    cleartext: true,
  };
}

// Inject Android signing config (useful for Release builds)
if (process.env.KEYSTORE_PASSWORD) {
  config.android = {
    buildOptions: {
      keystorePath: path.resolve(__dirname, 'android/keystores/release-key.jks'),
      keystorePassword: process.env.KEYSTORE_PASSWORD,
      keystoreAlias: process.env.KEYSTORE_ALIAS,
      keystoreAliasPassword: process.env.KEYSTORE_ALIAS_PASSWORD,
      releaseType: 'APK',
      signingType: 'apksigner',
    },
  };
}

export default config;
