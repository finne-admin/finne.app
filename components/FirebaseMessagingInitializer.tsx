'use client';

import { useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '@/lib/getDeviceId';
import {onForegroundMessage, requestPermissionAndGetToken} from '@/lib/firebase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function FirebaseMessagingInitializer() {
  const [isSaved, setIsSaved] = useState(false); // To prevent double calls
  const supabase = createClientComponentClient();

  useEffect(() => {
    // If we've already saved the token for this session, skip
    if (isSaved) return;

    (async () => {
      // 1. Get or generate the device_id from localStorage
      const deviceId = getOrCreateDeviceId();

      // 2. Request notification permission & retrieve token
      const token = await requestPermissionAndGetToken();
      if (!token) {
        console.log('No FCM token or permission denied');
        return;
      }

      // 3. Get the logged in user from Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        console.warn('User not logged in, cannot save token');
        return;
      }

      const userId = session.user.id;

      // 4. Upsert to /api/save-fcm-token
      const response = await fetch('/api/save-fcm-token', {
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

      const unsubscribe = onForegroundMessage((payload) => {
        console.log('Foreground message received:', payload);
        if (payload?.notification) {
          const { title, body } = payload.notification;
          // Optionally show a custom UI or use the browser Notification API
          new Notification(title, { body });


        }
      });

      // Cleanup subscription on unmount
      return unsubscribe;
    })();
  }, [isSaved, supabase]);

  return null; // No UI
}
