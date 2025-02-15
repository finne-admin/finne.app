importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeTWV4MAIuT5J5iOdV5omkiMNZcxsGAkc",
    authDomain: "finne-app.firebaseapp.com",
    projectId: "finne-app",
    storageBucket: "finne-app.firebasestorage.app",
    messagingSenderId: "233326747096",
    appId: "1:233326747096:web:02be2c3fbfc04ef0e4e6ad",
    measurementId: "G-DTPM6L289S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Extract title and body from the data field
    const notificationTitle = payload.data?.title ?? 'Background Title';
    const notificationOptions = {
        body: payload.data?.body ?? 'Background Body',
        icon: '/logoprincipalRecurso 4@4x.png',
        data: payload.data, // Pass the data to the notification
    };

    // Display the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification immediately

    event.waitUntil(
        (async () => {
            const action = event.action; // The action identifier (e.g., "GO_ACTION", "SNOOZE_ACTION")
            const notificationData = event.notification.data || {};
            const userId = notificationData.user_id; // Custom data passed with the notification

            try {
                if (action === 'GO_ACTION') {
                    // Open or focus a specific page in your PWA
                    await clients.openWindow('/notification');
                } else if (action === 'SNOOZE_ACTION') {
                    // Send a POST request to your backend function (e.g., to snooze a reminder)
                    await fetch('https://cgpqlasmzpabwrubvhyl.supabase.co/functions/v1/handle-snooze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: userId }),
                    });
                } else {
                    // Default action: open the homepage or another default page
                    await clients.openWindow('/');
                }
            } catch (error) {
                console.error('Error handling notification click:', error);
            }
        })()
    );
});

// (Optional) Listen for notification close events
self.addEventListener('notificationclose', (event) => {
    console.log('Notification was closed', event.notification);
});