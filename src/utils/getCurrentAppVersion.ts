import { App } from '@capacitor/app';

export const getCurrentAppVersion = async () => {
  try {
    const info = await App.getInfo(); //  Get Dynamic App Version!
    const APP_VERSION = Number(info.version);
    return APP_VERSION ? APP_VERSION : 0;
  } catch (error) {
    return 0;
  }
};
