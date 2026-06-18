/**
 * Web Push Delivery Helper
 *
 * Wraps the `web-push` library with VAPID credentials from the environment.
 * Call `sendPushToAll(notification)` to broadcast to all stored subscriptions.
 * Invalid / expired subscriptions (410 Gone) are automatically removed.
 */

import webpush from "web-push";
import { getAllPushSubscriptions, deletePushSubscription } from "./db";

// ─── VAPID setup ─────────────────────────────────────────────────────────────

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_SUBJECT = "mailto:nikki@a1homesteadhub.com";

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("[WebPush] VAPID keys not set — push notifications disabled.");
    return;
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  initialized = true;
}

// ─── Notification payload ────────────────────────────────────────────────────

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

// ─── Broadcast ───────────────────────────────────────────────────────────────

/**
 * Send a push notification to every stored subscription.
 * Returns { sent, failed, removed } counts.
 */
export async function sendPushToAll(notification: PushNotificationPayload): Promise<{
  sent: number;
  failed: number;
  removed: number;
}> {
  ensureInitialized();

  if (!initialized) {
    return { sent: 0, failed: 0, removed: 0 };
  }

  const subscriptions = await getAllPushSubscriptions();
  let sent = 0;
  let failed = 0;
  let removed = 0;

  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    url: notification.url ?? "https://a1homesteadhub.com",
    icon: notification.icon ?? "https://a1homesteadhub.com/favicon.ico",
  });

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
        sent++;
      } catch (err: any) {
        // 410 Gone or 404 = subscription is no longer valid; remove it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await deletePushSubscription(sub.endpoint);
          removed++;
        } else {
          console.error(`[WebPush] Failed to send to ${sub.endpoint.slice(0, 40)}…:`, err.message);
          failed++;
        }
      }
    })
  );

  console.log(`[WebPush] Broadcast complete — sent: ${sent}, failed: ${failed}, removed: ${removed}`);
  return { sent, failed, removed };
}
