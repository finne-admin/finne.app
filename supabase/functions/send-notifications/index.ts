import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { JWT } from 'npm:google-auth-library@9';
import serviceAccount from './service-account.json' with { type: 'json' };

// Helper function to get FCM access token
const getAccessToken = ({
                          clientEmail,
                          privateKey,
                        }: {
  clientEmail: string;
  privateKey: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    jwtClient.authorize((err: any, tokens: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens!.access_token!);
    });
  });
};

// Helper function to send a single notification
async function sendNotification(token: string, currentInterval: string, accessToken: string) {
  const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token,
            notification: {
              title: '¡Hora de moverte!',
              body: `Recordatorio de ejercicio a las ${currentInterval}`,
            },
            data: {
              click_action: '/routine',
            },
          },
        }),
      }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

// Helper function to handle invalid tokens
async function handleInvalidTokens(responses: any[], tokens: string[], supabase: any) {
  const invalidTokens = responses
      .map((response, index) => {
        if (response.error?.message?.includes('registration-token-not-registered')) {
          return tokens[index];
        }
        return null;
      })
      .filter((token): token is string => token !== null);

  if (invalidTokens.length > 0) {
    console.log(`Eliminando ${invalidTokens.length} tokens inválidos`);
    const { error } = await supabase
        .from('fcm_tokens')
        .delete()
        .in('token', invalidTokens);

    if (error) {
      console.error('Error deleting invalid tokens:', error);
    }
  }
}

// Main Edge Function
serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get FCM access token
    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    });

    // Get current time interval
    const now = new Date();
    const currentInterval = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log(`Current interval: ${currentInterval}`);

    // Fetch default notification times from the database
    const { data: defaultTimesRow, error: defaultTimesError } = await supabase
        .from('default_notification_times')
        .select('times')
        .single();

    if (defaultTimesError) {
      console.error('Error fetching default times:', defaultTimesError);
      return new Response('Error fetching default times', { status: 500 });
    }

    const defaultTimes: string[] = defaultTimesRow?.times || [];
    console.log('Default times fetched:', defaultTimes);

    // Fetch tokens and user preferences
    const { data: tokens, error: tokensError } = await supabase
        .from('fcm_tokens')
        .select('token, user_id');

    if (tokensError) {
      console.error('Error fetching tokens:', tokensError);
      return new Response('Error fetching tokens', { status: 500 });
    }

    const { data: preferences, error: preferencesError } = await supabase
        .from('notification_preferences')
        .select('user_id, times');

    if (preferencesError) {
      console.error('Error fetching preferences:', preferencesError);
      return new Response('Error fetching preferences', { status: 500 });
    }

    // Map user preferences for quick lookup
    const preferencesMap = new Map();
    preferences.forEach((pref: { user_id: any; times: any; }) => {
      preferencesMap.set(pref.user_id, pref.times);
    });

    // Match tokens with default or custom times
    const tokensToNotify = tokens
        .filter((tokenRecord: { user_id: any; }) => {
          const userTimes = preferencesMap.get(tokenRecord.user_id) || defaultTimes;
          return userTimes.includes(currentInterval);
        })
        .map((record: { token: any; }) => record.token);

    if (tokensToNotify.length === 0) {
      console.log(`No users configured for ${currentInterval}`);
      return new Response('No tokens to notify', { status: 200 });
    }

    console.log(`Notifying ${tokensToNotify.length} users at ${currentInterval}`);

    // Send notifications
    const notificationPromises = tokensToNotify.map((token: string) =>
        sendNotification(token, currentInterval, accessToken).catch(error => ({ error }))
    );

    const results = await Promise.all(notificationPromises);

    // Handle invalid tokens
    await handleInvalidTokens(results, tokensToNotify, supabase);

    // Log results
    const successCount = results.filter((r: { error: any; }) => !r.error).length;
    const failureCount = results.filter((r: { error: any; }) => r.error).length;

    const result = `Notifications sent: ${successCount}, failures: ${failureCount}`;
    console.log(result);

    return new Response(result, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unhandled error in function:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
