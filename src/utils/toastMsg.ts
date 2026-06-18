import { Toast } from '@capacitor/toast';

export const toastMsg = (msg: string) => {
  console.log('toast: ', msg);

  Toast.show({
    text: msg,
  });
};
