import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'music_alerts';
const NOTIFICATION_ID_AM = 111;
const NOTIFICATION_ID_PM = 222;

const morningMessages = [
  "Don't forget to listen to the latest releases!",
  'Fresh music is waiting for you!',
];

const eveningMessages = ['Relax with some trending music!', 'Catch up on the latest releases!'];

function getRandomMessage(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

async function setupDailyNotifications() {
  try {
    const permission = await LocalNotifications.requestPermissions();

    if (permission.display !== 'granted') {
      return;
    }

    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Music Alerts',
      importance: 5,
      visibility: 1,
    });

    const saved = localStorage.getItem('daily_notifs_set');

    // Check existing scheduled notifications
    const pending = await LocalNotifications.getPending();

    const ids = pending.notifications.map((n) => n.id);

    console.log('pending ids:', ids);

    const isValid = saved === 'true' && ids.includes(1) && ids.includes(2);

    if (isValid) {
      console.log('notifications healthy');
      return;
    }
    // repair everything
    await LocalNotifications.cancel({
      notifications: [{ id: NOTIFICATION_ID_AM }, { id: NOTIFICATION_ID_PM }],
    });

    const notifications = [];

    notifications.push({
      id: NOTIFICATION_ID_AM,
      title: 'Yo Music',
      body: getRandomMessage(morningMessages),
      channelId: CHANNEL_ID,
      schedule: {
        on: {
          hour: 8,
          minute: 0,
        },
        repeats: true,
        allowWhileIdle: true,
      },
    });

    notifications.push({
      id: NOTIFICATION_ID_PM,
      title: 'Yo Music',
      body: getRandomMessage(eveningMessages),
      channelId: CHANNEL_ID,
      schedule: {
        on: {
          hour: 20,
          minute: 0,
        },
        repeats: true,
        allowWhileIdle: true,
      },
    });

    if (notifications.length) {
      await LocalNotifications.schedule({
        notifications,
      });
      localStorage.setItem('daily_notifs_set', 'true');

      console.log('Daily notifications scheduled');
    } else {
      console.log('already set notifs');
    }
  } catch (e) {
    console.error(e);
  }
}

export default function DailyNotification() {
  useEffect(() => {
    setupDailyNotifications();
  }, []);

  return null;
}
