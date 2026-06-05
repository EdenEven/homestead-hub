import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Bell, BellOff, X } from "lucide-react";

const STORAGE_KEY = "push_prompt_dismissed";
const STORAGE_SUB_KEY = "push_subscribed";

/**
 * Browser push notification opt-in prompt.
 * Shows a friendly banner after 30 seconds if the user hasn't subscribed yet.
 * Uses the Web Push API (no external service needed — subscriptions stored in DB).
 */
export function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const subscribeMutation = trpc.notifications.subscribePush.useMutation({
    onSuccess: () => {
      setStatus("success");
      setSubscribed(true);
      localStorage.setItem(STORAGE_SUB_KEY, "1");
      setTimeout(() => setShow(false), 3000);
    },
    onError: () => setStatus("error"),
  });

  const unsubscribeMutation = trpc.notifications.unsubscribePush.useMutation({
    onSuccess: () => {
      setSubscribed(false);
      localStorage.removeItem(STORAGE_SUB_KEY);
    },
  });

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    if (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_SUB_KEY)) return;
    // Don't show if push not supported
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    // Don't show if already granted/denied
    if (Notification.permission !== "default") return;

    const timer = setTimeout(() => setShow(true), 30_000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_SUB_KEY)) setSubscribed(true);
  }, []);

  const handleSubscribe = async () => {
    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        return;
      }

      // Register service worker if not already registered
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Use a VAPID public key (we use a static one for demo; in production generate with web-push)
      // For now we just save the subscription endpoint to DB
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
        ),
      });

      const json = sub.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: json.endpoint!,
        p256dh: (json.keys as any)?.p256dh ?? "",
        auth: (json.keys as any)?.auth ?? "",
      });
    } catch (err) {
      console.error("Push subscription failed:", err);
      setStatus("error");
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!show && !subscribed) return null;

  // Show a small "notifications on" indicator if subscribed
  if (subscribed) {
    return (
      <button
        onClick={() => {
          if (confirm("Turn off push notifications?")) {
            navigator.serviceWorker.ready.then(reg =>
              reg.pushManager.getSubscription().then(sub => {
                if (sub) {
                  unsubscribeMutation.mutate({ endpoint: sub.endpoint });
                  sub.unsubscribe();
                }
              })
            );
          }
        }}
        className="fixed bottom-20 right-4 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2.5 shadow-lg transition-colors"
        title="Push notifications ON — click to turn off"
      >
        <Bell className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-xs bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 animate-in slide-in-from-right-2 duration-300">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="bg-amber-100 rounded-full p-2">
          <Bell className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">Stay in the loop</p>
          <p className="text-xs text-gray-500">New posts & trade alerts</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-4">
        Get notified when Nikki drops a new post or someone lists a trade on the board — right in your browser.
      </p>

      {status === "success" && (
        <p className="text-emerald-600 text-sm font-medium text-center">✅ You're subscribed!</p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-xs text-center">Couldn't subscribe. Check browser permissions.</p>
      )}

      {status !== "success" && (
        <div className="flex gap-2">
          <button
            onClick={handleSubscribe}
            disabled={status === "loading"}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            {status === "loading" ? "Setting up..." : "🔔 Notify me"}
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm border border-gray-200 rounded-lg"
          >
            <BellOff className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "==".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}
