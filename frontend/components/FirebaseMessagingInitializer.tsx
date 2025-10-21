'use client';

import {useEffect, useState} from 'react';
import {getOrCreateDeviceId} from '@/lib/getDeviceId';
import {onForegroundMessage, requestPermissionAndGetToken} from '@/lib/firebase';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient";

export default function FirebaseMessagingInitializer() {
  const [isSaved, setIsSaved] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (isSaved) return;

    const initializeFirebaseMessaging = async () => {
      try {
        const deviceId = getOrCreateDeviceId();
        const token = await requestPermissionAndGetToken();

        if (!token) {
          console.log('No FCM token or permission denied');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          console.warn('User not logged in, cannot save token');
          return;
        }

        const userId = session.user.id;
        const response = await apiFetch('/api/save-fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, device_id: deviceId, token }),
        });

        if (response.ok) {
          console.log('Token saved for device:', deviceId);
          setIsSaved(true);
        } else {
          const { error } = await response.json();
          console.error('Error saving token:', error);
        }

        return onForegroundMessage((payload) => {
          console.log('Foreground message received:', payload);
          if (payload?.notification) {
            const {title, body} = payload.notification;
            new Notification(title, {body});
          }
        });
      } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
      }
    };

    initializeFirebaseMessaging();
  }, [isSaved, supabase]);

  return null;
}
