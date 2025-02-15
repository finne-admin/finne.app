'use client';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, onMessage, getToken } from 'firebase/messaging';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const firebaseConfig = {
    apiKey: "AIzaSyCeTWV4MAIuT5J5iOdV5omkiMNZcxsGAkc",
    authDomain: "finne-app.firebaseapp.com",
    projectId: "finne-app",
    storageBucket: "finne-app.firebasestorage.app",
    messagingSenderId: "233326747096",
    appId: "1:233326747096:web:02be2c3fbfc04ef0e4e6ad",
    measurementId: "G-DTPM6L289S"
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

        const supabase = createClientComponentClient();
        const deviceId = localStorage.getItem('device_id');
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user?.id) {
            await supabase
                .from('fcm_tokens')
                .delete()
                .eq('user_id', session.user.id)
                .eq('device_id', deviceId);
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