import { Share } from '@capacitor/share';
type sharePropType = {
  title: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
};
export const handleShare = ({ title, text, url, dialogTitle }: sharePropType) => {
  const shareObj: sharePropType = {
    title: title,
    text: text || title,
    dialogTitle: dialogTitle || 'Share with buddies',
  };
  if (url) {
    shareObj.url = url;
  }
  Share.share(shareObj);
};
