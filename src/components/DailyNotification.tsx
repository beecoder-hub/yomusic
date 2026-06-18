import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

// Unique IDs for both daily slots
const NOTIFICATION_ID_AM = 1;
const NOTIFICATION_ID_PM = 2;
const CHANNEL_ID = 'music_alerts';

const messages = [
  "Don't forget to listen to the latest releases!",
  'Start listening to your favorite songs!',
  'Take a look at new releases!',
  'Enjoy the latest trending music now!',
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

async function setupDailyNotifications() {
  const today = new Date().toDateString();

  // Parse localized persistence safely
  const savedNotifData = localStorage.getItem('notif_last_set_v2');
  let notifStatus = { am: '', pm: '' };

  if (savedNotifData) {
    try {
      notifStatus = JSON.parse(savedNotifData);
    } catch (e) {
      console.error('Failed to parse notification storage:', e);
    }
  }

  // Check if BOTH are already scheduled for today
  if (notifStatus.am === today && notifStatus.pm === today) {
    console.log('All notifications are already up to date.');
    return;
  }

  try {
    // 1. Core Request Permissions
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    // 2. Android Channel Configuration
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Music Alerts',
      description: 'Daily reminders for music updates',
      importance: 5, // High importance forces banner/sound
      visibility: 1, // Visible everywhere (Lockscreen included)
    });

    // 3. Inspect Current OS Queue
    const pending = await LocalNotifications.getPending();
    const activeIds = pending.notifications.map((n) => n.id);

    const notificationsToSchedule = [];

    // --- 8:00 AM Notification Handling ---
    if (notifStatus.am !== today) {
      if (activeIds.includes(NOTIFICATION_ID_AM)) {
        await LocalNotifications.cancel({
          notifications: [{ id: NOTIFICATION_ID_AM }],
        });
      }
      notificationsToSchedule.push({
        id: NOTIFICATION_ID_AM,
        title: 'Yo Music',
        body: getRandomMessage(),
        channelId: CHANNEL_ID,
        schedule: {
          on: { hour: 8, minute: 0 },
          repeats: true,
          allowWhileIdle: true, // Android 11+ Doze Mode delay
        },
      });
      notifStatus.am = today;
    }

    // --- 9:00 PM Notification Handling ---
    if (notifStatus.pm !== today) {
      if (activeIds.includes(NOTIFICATION_ID_PM)) {
        await LocalNotifications.cancel({
          notifications: [{ id: NOTIFICATION_ID_PM }],
        });
      }
      notificationsToSchedule.push({
        id: NOTIFICATION_ID_PM,
        title: 'Yo Music',
        body: getRandomMessage(),
        channelId: CHANNEL_ID,
        schedule: {
          on: { hour: 20, minute: 0 }, // 8 PM
          repeats: true,
          allowWhileIdle: true, // Android 11+ Doze Mode delay
        },
      });
      notifStatus.pm = today;
    }

    // 4. Batch Dispatch to Native OS
    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({
        notifications: notificationsToSchedule,
      });

      // Update our storage object
      localStorage.setItem('notif_last_set_v2', JSON.stringify(notifStatus));
      console.log(`Successfully scheduled ${notificationsToSchedule.length} notification(s).`);
    }
  } catch (err) {
    console.error('Notification setup error:', err);
  }
}

export default function DailyNotification() {
  useEffect(() => {
    setupDailyNotifications();
  }, []);

  return <></>;
}

// import { useEffect } from "react";
// import { LocalNotifications } from "@capacitor/local-notifications";

// const NOTIFICATION_ID = 1;

// const messages = [
//   "Don't forget to listen latest releases!",
//   "Start listening to your favorite songs!",
//   "Take a look at new releases!",
//   "Enjoy now latest trending musics!",
// ];

// function getRandomMessage() {
//   return messages[Math.floor(Math.random() * messages.length)];
// }

// async function setupDailyNotification() {
//   const today = new Date().toDateString();
//   const last = localStorage.getItem("notif_last_set");

//   if (last === today) {
//     console.log("Already scheduled today, skipping...");
//     return;
//   }

//   try {
//     // 1. Request permission
//     const permission = await LocalNotifications.requestPermissions();

//     if (permission.display !== "granted") {
//       console.log("Notification permission not granted");
//       return;
//     }

//     // 2. Get pending notifications
//     const pending = await LocalNotifications.getPending();

//     const alreadyScheduled = pending.notifications.some(
//       (n) => n.id === NOTIFICATION_ID
//     );

//     // 3. Cancel existing (so message refreshes daily)
//     if (alreadyScheduled) {
//       await LocalNotifications.cancel({
//         notifications: [{ id: NOTIFICATION_ID }],
//       });
//     }

//     // 4. Schedule new notification
//     await LocalNotifications.schedule({
//       notifications: [
//         {
//           id: NOTIFICATION_ID,
//           title: "Yo Music",
//           body: getRandomMessage(),
//           schedule: {
//             on: {
//               hour: 8,
//               minute: 0,
//             },
//             repeats: true,
//           },
//         },
//       ],
//     });

//     localStorage.setItem("notif_last_set", today);

//     console.log("Daily notification scheduled");
//   } catch (err) {
//     console.error("Notification setup error:", err);
//   }
// }

// export default function DailyNotification() {
//   useEffect(() => {
//     setupDailyNotification();
//   }, []);

//   return <></>;
// }
