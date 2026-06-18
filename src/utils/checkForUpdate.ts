import { CapacitorHttp } from '@capacitor/core';
import { getCurrentAppVersion } from './getCurrentAppVersion';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5173' : `https://yomusic.vercel.app`;

export const checkForUpdate = async () => {
  const APP_VERSION = await getCurrentAppVersion();
  if (APP_VERSION === 0) {
    return false; // handle web
  }

  const response = await CapacitorHttp.request({
    url: `${BASE_URL}/update.json`,
  });
  if (response.status !== 200) {
    return false;
  }
  const updateAvailable = APP_VERSION < response.data[0].version;
  if (!updateAvailable) {
    return false;
  }
  return {
    version: updateAvailable ? response.data[0].version : APP_VERSION,
    whatsNew: updateAvailable ? response.data[0].whatsNew : '',
    changeLog: updateAvailable ? response.data[0].changeLog : [],
  };
};
