'use client';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyA2yPIAbqGJp7cwNWv7npATR9-x0yCHX5M",
  authDomain: "elite-caster-474014-u9.firebaseapp.com",
  projectId: "elite-caster-474014-u9",
  storageBucket: "elite-caster-474014-u9.firebasestorage.app",
  messagingSenderId: "114634150787",
  appId: "1:114634150787:web:9536e666b8fa2546589cb6",
  measurementId: "G-KJJLVYYB2K"
};

let firebaseApp: FirebaseApp;
let messaging: Messaging;

export function getFirebaseApp(): FirebaseApp {
    if (!firebaseApp) {
        firebaseApp = initializeApp(firebaseConfig);
    }
    return firebaseApp;
}

export function getFirebaseMessaging(): Messaging {
    if (!messaging) {
        const app = getFirebaseApp();
        messaging = getMessaging(app);
    }
    return messaging;
}

export async function requestPermissionAndGetToken(): Promise<string | null> {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission not granted');
            return null;
        }

        const messagingInstance = getFirebaseMessaging();
        const currentToken = await getToken(messagingInstance, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
        });

        if (currentToken) {
            console.log('FCM Token:', currentToken);
            return currentToken;
        }

        console.log('No registration token available. Request permission to generate one.');
        return null;
    } catch (error) {
        console.error('An error occurred while retrieving token:', error);
        return null;
    }
}

export function onForegroundMessage(callback: (payload: any) => void) {
    const messagingInstance = getFirebaseMessaging();
    onMessage(messagingInstance, callback);
}
