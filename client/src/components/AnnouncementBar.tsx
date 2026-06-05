import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Megaphone, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const TYPE_STYLES = {
  info: {
    bg: "bg-blue-600",
    text: "text-white",
    icon: <Info className="w-4 h-4 flex-shrink-0" />,
  },
  success: {
    bg: "bg-emerald-600",
    text: "text-white",
    icon: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
  },
  warning: {
    bg: "bg-amber-500",
    text: "text-white",
    icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
  },
  alert: {
    bg: "bg-red-600",
    text: "text-white",
    icon: <Megaphone className="w-4 h-4 flex-shrink-0" />,
  },
};

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { data: announcement } = trpc.notifications.getAnnouncement.useQuery(undefined, {
    refetchInterval: 60_000, // re-check every minute
  });

  if (!announcement || dismissed) return null;

  const style = TYPE_STYLES[announcement.type] ?? TYPE_STYLES.info;

  return (
    <div className={`${style.bg} ${style.text} w-full z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        {style.icon}
        <p className="flex-1 text-sm font-medium text-center">
          {announcement.message}
          {announcement.linkUrl && (
            <a
              href={announcement.linkUrl}
              className="ml-2 underline font-bold hover:opacity-80"
              target={announcement.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              {announcement.linkText ?? "Learn more →"}
            </a>
          )}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---- Admin control panel for the announcement bar ----
export function AnnouncementAdminPanel() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "alert">("info");
  const [showPanel, setShowPanel] = useState(false);

  const utils = trpc.useUtils();
  const { data: current } = trpc.notifications.getAnnouncement.useQuery();

  const setAnnouncement = trpc.notifications.setAnnouncement.useMutation({
    onSuccess: () => {
      utils.notifications.getAnnouncement.invalidate();
      setMessage("");
      setLinkUrl("");
      setLinkText("");
      setShowPanel(false);
    },
  });

  const clearAnnouncement = trpc.notifications.clearAnnouncement.useMutation({
    onSuccess: () => utils.notifications.getAnnouncement.invalidate(),
  });

  if (user?.role !== "admin") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg transition-colors"
        title="Manage Site Announcement"
      >
        <Megaphone className="w-5 h-5" />
      </button>

      {showPanel && (
        <div className="absolute bottom-14 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Site Announcement</h3>
            <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {current && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
              <p className="font-semibold text-amber-800 mb-1">Current banner:</p>
              <p className="text-amber-700">{current.message}</p>
              <button
                onClick={() => clearAnnouncement.mutate()}
                disabled={clearAnnouncement.isPending}
                className="mt-2 text-red-600 hover:text-red-800 font-medium text-xs"
              >
                {clearAnnouncement.isPending ? "Clearing..." : "✕ Remove banner"}
              </button>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="info">ℹ️ Info (blue)</option>
                <option value="success">✅ Success (green)</option>
                <option value="warning">⚠️ Warning (amber)</option>
                <option value="alert">🚨 Alert (red)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="New blog post just dropped! Check it out..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Link URL (optional)</label>
              <input
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="/blog or https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Link text (optional)</label>
              <input
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                placeholder="Read now →"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={() => setAnnouncement.mutate({ message, linkUrl: linkUrl || undefined, linkText: linkText || undefined, type })}
              disabled={!message.trim() || setAnnouncement.isPending}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {setAnnouncement.isPending ? "Publishing..." : "📢 Publish Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
