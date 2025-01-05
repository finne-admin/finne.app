importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration (from your Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCeTWV4MAIuT5J5iOdV5omkiMNZcxsGAkc",
    authDomain: "finne-app.firebaseapp.com",
    projectId: "finne-app",
    storageBucket: "finne-app.firebasestorage.app",
    messagingSenderId: "233326747096",
    appId: "1:233326747096:web:02be2c3fbfc04ef0e4e6ad",
    measurementId: "G-DTPM6L289S"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title ?? 'Background Title';
    const notificationOptions = {
        body: payload.notification?.body ?? 'Background Body',
        icon: '/logoprincipalRecurso 4@4x.png', // Add your own icon if needed
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
