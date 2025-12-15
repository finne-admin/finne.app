importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyA2yPIAbqGJp7cwNWv7npATR9-x0yCHX5M',
  authDomain: 'elite-caster-474014-u9.firebaseapp.com',
  projectId: 'elite-caster-474014-u9',
  storageBucket: 'elite-caster-474014-u9.firebasestorage.app',
  messagingSenderId: '114634150787',
  appId: '1:114634150787:web:9536e666b8fa2546589cb6',
  measurementId: 'G-KJJLVYYB2K',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.data?.title ?? '¡Pausa Activa!';
  const notificationOptions = {
    body: payload.data?.body ?? '¡Es hora de tu pausa activa!',
    icon: '/logoprincipalRecurso 4@4x.png',
    data: payload.data ?? {},
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const action = event.action;
      const notificationData = event.notification.data || {};

      try {
        if (action === 'GO_ACTION') {
          await clients.openWindow('/notifications');
        } else if (action === 'SNOOZE_ACTION') {
          await fetch('https://cgpqlasmzpabwrubvhyl.supabase.co/functions/v1/handle-snooze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: notificationData.user_id }),
          });
        } else {
          await clients.openWindow('/notifications');
        }
      } catch (error) {
        console.error('Error handling notification click:', error);
      }
    })(),
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event.notification);
});

self.addEventListener('push', (event) => {
  if (Notification.permission !== 'granted' || !event.data) {
    return;
  }

  let parsed;
  let isDevtoolsTest = false;

  try {
    parsed = event.data.json();
  } catch (_err) {
    isDevtoolsTest = true;
  }

  if (!isDevtoolsTest) {
    const looksLikeFcm =
      parsed?.data?.firebaseMessaging || parsed?.notification || parsed?.from;
    if (looksLikeFcm) {
      return;
    }
  }

  const title = isDevtoolsTest
    ? 'Push test desde DevTools'
    : parsed?.title || 'Push test';

  const body = isDevtoolsTest ? event.data.text() : parsed?.body || '';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/logoprincipalRecurso 4@4x.png',
      data: parsed?.data || {},
    })
  );
});
