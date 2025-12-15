'use client';

import {useEffect, useState} from 'react';
import {getOrCreateDeviceId} from '@/lib/getDeviceId';
import {onForegroundMessage, requestPermissionAndGetToken} from '@/lib/firebase';
import {apiDelete, apiPost} from '@/lib/apiClient';

async function saveToken(deviceId: string, token: string) {
  const response = await apiPost('/api/notifications/tokens', {
    device_id: deviceId,
    token,
  });

  if (!response.ok) {
    const {error} = await response.json().catch(() => ({error: 'Error desconocido'}));
    throw new Error(error || 'No se pudo guardar el token FCM');
  }
}

async function removeToken(deviceId: string) {
  try {
    const response = await apiDelete('/api/notifications/tokens', {device_id: deviceId});
    if (!response.ok) {
      const {error} = await response.json().catch(() => ({error: 'Error desconocido'}));
      console.warn('No se pudo eliminar el token FCM:', error);
    }
  } catch (error) {
    console.error('Error eliminando token FCM:', error);
  }
}

export default function FirebaseMessagingInitializer() {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isSaved) return;

    const initializeFirebaseMessaging = async () => {
      try {
        const deviceId = getOrCreateDeviceId();
        if (!deviceId) {
          console.warn('No se pudo obtener un deviceId para push notifications');
          return;
        }

        const token = await requestPermissionAndGetToken();

        if (!token) {
          console.log('No FCM token or permission denied');
          await removeToken(deviceId);
          return;
        }

        await saveToken(deviceId, token);
        console.log('Token saved for device:', deviceId);
        setIsSaved(true);

        onForegroundMessage(async (payload) => {
          console.log('Foreground message received:', payload);

          const title =
            payload?.notification?.title ??
            payload?.data?.title ??
            '¡Hora de tu pausa activa!';
          const body =
            payload?.notification?.body ??
            payload?.data?.body ??
            'Toca para registrar tu ejercicio del día';

          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, {
              body,
              icon: '/logoprincipalRecurso 4@4x.png',
              data: payload?.data ?? {},
            });
          } catch (err) {
            if (Notification.permission === 'granted') {
              new Notification(title, {body});
            } else {
              console.warn('No notification permission in foreground:', err);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
      }
    };

    initializeFirebaseMessaging();
  }, [isSaved]);

  return null;
}
