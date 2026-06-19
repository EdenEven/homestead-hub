/**
 * Social Queue — Admin-only Facebook post management page
 * Route: /admin/social-queue
 *
 * Features:
 * - View all queued posts with status badges
 * - Generate a new caption from any recent blog post
 * - Edit caption/hashtags inline before approving
 * - Approve (posts to Facebook if token is configured, otherwise marks approved)
 * - Delete queue items
 * - Filter by status: all / pending / approved / posted / failed
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CalendarClock,
  Image,
} from "lucide-react";
import { Link } from "wouter";

// ─── types ───────────────────────────────────────────────────────────────────

type QueueStatus = "pending" | "approved" | "posted" | "failed";

const STATUS_COLORS: Record<QueueStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  posted: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS: Record<QueueStatus, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  approved: <CheckCircle2 className="w-3 h-3" />,
  posted: <Send className="w-3 h-3" />,
  failed: <XCircle className="w-3 h-3" />,
};

function StatusBadge({ status }: { status: QueueStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}
    >
      {STATUS_ICONS[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Generate Modal ───────────────────────────────────────────────────────────

function GenerateModal({
  open,
  onClose,
  onGenerated,
}: {
  open: boolean;
  onClose: () => void;
  onGenerated: () => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const { data: posts, isLoading: postsLoading } = trpc.socialQueue.getRecentBlogPosts.useQuery(undefined, {
    enabled: open,
  });

  const generateMutation = trpc.socialQueue.generateFromBlogPost.useMutation({
    onSuccess: () => {
      toast.success("Caption generated!", { description: "New post added to the queue." });
      onGenerated();
      onClose();
      setSelectedSlug("");
    },
    onError: (err) => {
      toast.error("Generation failed", { description: err.message });
    },
  });

  const selectedPost = posts?.find((p) => p.slug === selectedSlug);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-600" />
            Generate Facebook Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Select a recent blog post and the AI will write an engaging Facebook caption with hashtags.
          </p>

          {postsLoading ? (
            <div className="text-sm text-muted-foreground">Loading posts…</div>
          ) : (
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a blog post…" />
              </SelectTrigger>
              <SelectContent>
                {posts?.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedPost && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground line-clamp-3">
              {selectedPost.excerpt ?? "No excerpt available."}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!selectedPost) return;
              generateMutation.mutate({
                slug: selectedPost.slug,
                blogPostId: selectedPost.id,
                title: selectedPost.title,
                excerpt: selectedPost.excerpt ?? "",
              });
            }}
            disabled={!selectedSlug || generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Generate Caption
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Queue Item Card ──────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "instagram") return <Instagram className="w-4 h-4 text-pink-600" />;
  return <Facebook className="w-4 h-4 text-blue-600" />;
}

function QueueCard({
  item,
  onRefresh,
}: {
  item: {
    id: number;
    platform: string;
    caption: string;
    hashtags: string | null;
    mediaUrl: string | null;
    scheduledAt: Date | null;
    status: string;
    postedAt: Date | null;
    fbPostId: string | null;
    errorMessage: string | null;
    createdAt: Date;
  };
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editCaption, setEditCaption] = useState(item.caption);
  const [editHashtags, setEditHashtags] = useState(item.hashtags ?? "");

  const updateMutation = trpc.socialQueue.updateCaption.useMutation({
    onSuccess: () => {
      toast.success("Caption updated");
      setEditing(false);
      onRefresh();
    },
    onError: (err) => toast.error("Update failed", { description: err.message }),
  });

  const approveMutation = trpc.socialQueue.approvePost.useMutation({
    onSuccess: (data) => {
      if (data.posted) {
        toast.success("Post published!", { description: `Post ID: ${data.fbPostId}` });
      } else {
        toast.success("Marked as approved", { description: "Add Meta credentials to enable auto-posting." });
      }
      onRefresh();
    },
    onError: (err) => toast.error("Posting failed", { description: err.message }),
  });

  const deleteMutation = trpc.socialQueue.deleteItem.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      onRefresh();
    },
    onError: (err) => toast.error("Delete failed", { description: err.message }),
  });

  const status = item.status as QueueStatus;
  const previewText = item.caption.length > 180 ? item.caption.slice(0, 180) + "…" : item.caption;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-wrap">
          <PlatformIcon platform={item.platform} />
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <StatusBadge status={status} />
          {item.scheduledAt && status === "pending" && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <CalendarClock className="w-3 h-3" />
              {new Date(item.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          )}
          {item.mediaUrl && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Image className="w-3 h-3" /> media
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {(status === "pending" || status === "failed") && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setEditCaption(item.caption);
                  setEditHashtags(item.hashtags ?? "");
                  setEditing(true);
                }}
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                onClick={() => approveMutation.mutate({ id: item.id })}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-1" />
                    Approve & Post
                  </>
                )}
              </Button>
            </>
          )}
          {status === "approved" && (
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
              onClick={() => approveMutation.mutate({ id: item.id })}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  Post Now
                </>
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            onClick={() => deleteMutation.mutate({ id: item.id })}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Caption body */}
      <div className="px-4 py-3 space-y-2">
        {editing ? (
          <div className="space-y-3">
            <Textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={6}
              className="text-sm resize-none"
              placeholder="Facebook caption…"
            />
            <Input
              value={editHashtags}
              onChange={(e) => setEditHashtags(e.target.value)}
              className="text-sm font-mono"
              placeholder="#homesteading #selfsufficiency …"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  updateMutation.mutate({ id: item.id, caption: editCaption, hashtags: editHashtags })
                }
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {expanded ? item.caption : previewText}
            </p>
            {item.caption.length > 180 && (
              <button
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Show more
                  </>
                )}
              </button>
            )}
            {item.hashtags && (
              <p className="text-xs text-blue-600 font-mono">{item.hashtags}</p>
            )}
          </>
        )}

        {/* Error message */}
        {status === "failed" && item.errorMessage && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            <strong>Error:</strong> {item.errorMessage}
          </div>
        )}

        {/* Posted info */}
        {status === "posted" && item.postedAt && (
          <div className="text-xs text-muted-foreground">
            Posted {new Date(item.postedAt).toLocaleString()}
            {item.fbPostId && (
              <a
                href={`https://www.facebook.com/${item.fbPostId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline"
              >
                View on Facebook →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Manual Create Modal ──────────────────────────────────────────────────────

function CreateModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [platform, setPlatform] = useState<"facebook" | "instagram">("facebook");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [scheduledAt, setScheduledAt] = useState("");

  const createMutation = trpc.socialQueue.createItem.useMutation({
    onSuccess: () => {
      toast.success("Post added to queue");
      onCreated();
      onClose();
      setCaption(""); setHashtags(""); setMediaUrl(""); setScheduledAt("");
    },
    onError: (err) => toast.error("Failed to create post", { description: err.message }),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${platform === "facebook" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-border text-muted-foreground hover:border-foreground/50"}`}
              onClick={() => setPlatform("facebook")}
            >
              <Facebook className="w-4 h-4" /> Facebook
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${platform === "instagram" ? "border-pink-600 bg-pink-50 text-pink-700" : "border-border text-muted-foreground hover:border-foreground/50"}`}
              onClick={() => setPlatform("instagram")}
            >
              <Instagram className="w-4 h-4" /> Instagram
            </button>
          </div>

          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            placeholder="Caption text…"
            className="text-sm resize-none"
          />
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#homesteading #selfsufficiency …"
            className="text-sm font-mono"
          />
          <div className="space-y-2">
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Media URL (image or video, required for Instagram)"
              className="text-sm"
            />
            {mediaUrl && (
              <div className="flex gap-2">
                <button
                  className={`flex-1 rounded border py-1.5 text-xs font-medium ${mediaType === "image" ? "border-foreground bg-muted" : "border-border text-muted-foreground"}`}
                  onClick={() => setMediaType("image")}
                >Image</button>
                <button
                  className={`flex-1 rounded border py-1.5 text-xs font-medium ${mediaType === "video" ? "border-foreground bg-muted" : "border-border text-muted-foreground"}`}
                  onClick={() => setMediaType("video")}
                >Video / Reel</button>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Schedule (optional — leave blank to post immediately on approve)</label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!caption.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate({
              platform,
              caption: caption.trim(),
              hashtags: hashtags.trim() || undefined,
              mediaUrl: mediaUrl.trim() || undefined,
              mediaType: mediaUrl.trim() ? mediaType : undefined,
              scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
            })}
          >
            {createMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Add to Queue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Engagement Tab ───────────────────────────────────────────────────────────

function EngagementTab() {
  const { data: comments, isLoading } = trpc.socialQueue.getEngagement.useQuery();

  if (isLoading) return <div className="py-12 text-center text-muted-foreground text-sm">Loading…</div>;
  if (!comments || comments.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/30 py-16 text-center">
        <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">No comments captured yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Comments are pulled automatically every 15 minutes from posted Facebook content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="rounded-xl border bg-card px-4 py-3 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm">{c.commenterName ?? "Anonymous"}</span>
            <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">{c.message}</p>
          <p className="text-xs text-muted-foreground/60">Post: {c.sourcePostId}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SocialQueue() {
  const { user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<QueueStatus | "all">("all");
  const [activeTab, setActiveTab] = useState<"queue" | "engagement">("queue");
  const [generateOpen, setGenerateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: queue,
    isLoading,
    refetch,
  } = trpc.socialQueue.getQueue.useQuery(
    statusFilter === "all" ? undefined : { status: statusFilter },
    { enabled: !!user && user.role === "admin" }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Admin access required.</p>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  const counts = {
    all: queue?.length ?? 0,
    pending: queue?.filter((i) => i.status === "pending").length ?? 0,
    approved: queue?.filter((i) => i.status === "approved").length ?? 0,
    posted: queue?.filter((i) => i.status === "posted").length ?? 0,
    failed: queue?.filter((i) => i.status === "failed").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8 max-w-3xl">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Facebook className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Social Queue</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Review and approve AI-generated Facebook posts before they go live.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Manual
            </Button>
            <Button onClick={() => setGenerateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-6 border-b">
          {(["queue", "engagement"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "queue" ? "Post Queue" : <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Engagement</span>}
            </button>
          ))}
        </div>

        {activeTab === "engagement" && <EngagementTab />}

        {activeTab === "queue" && <>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(["all", "pending", "approved", "posted", "failed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && counts[s] > 0 && (
                <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Setup banner — shown when no FB credentials are configured */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 mb-6 flex items-start gap-3">
          <Facebook className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Connect your Facebook Page to enable auto-posting</p>
            <p className="text-blue-700 mt-0.5">
              Add your <code className="bg-blue-100 px-1 rounded">FACEBOOK_PAGE_ID</code> and{" "}
              <code className="bg-blue-100 px-1 rounded">FACEBOOK_PAGE_TOKEN</code> in Settings → Secrets. Until
              then, approving a post marks it as ready — you can copy the caption and post manually.
            </p>
          </div>
        </div>

        {/* Queue list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-muted/30 h-32 animate-pulse" />
            ))}
          </div>
        ) : !queue || queue.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 py-16 text-center">
            <Facebook className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No posts in the queue</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "New Post" to generate a Facebook caption from a recent blog post.
            </p>
            <Button className="mt-4 gap-2" onClick={() => setGenerateOpen(true)}>
              <Plus className="w-4 h-4" />
              Generate First Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => (
              <QueueCard
                key={item.id}
                item={{
                  ...item,
                  platform: item.platform,
                  status: item.status as QueueStatus,
                  mediaUrl: item.mediaUrl ?? null,
                  scheduledAt: item.scheduledAt ?? null,
                  postedAt: item.postedAt ?? null,
                  fbPostId: item.fbPostId ?? null,
                  errorMessage: item.errorMessage ?? null,
                }}
                onRefresh={() => refetch()}
              />
            ))}
          </div>
        )}
        </>}
      </main>

      <Footer />

      <GenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerated={() => refetch()}
      />
      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
      />
    </div>
  );
}
