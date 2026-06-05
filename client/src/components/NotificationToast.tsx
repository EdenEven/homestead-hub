import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, BookOpen, ArrowLeftRight } from "lucide-react";
import { Link } from "wouter";

interface Toast {
  id: string;
  type: "blog" | "barter";
  title: string;
  subtitle: string;
  link: string;
}

/**
 * Polls for new blog posts and barter listings and shows a toast
 * when something new has appeared since the page loaded.
 */
export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seenBlogIds = useRef<Set<number>>(new Set());
  const seenBarterIds = useRef<Set<number>>(new Set());
  const initialized = useRef(false);

  // Poll blog posts every 2 minutes
  const { data: blogPosts } = trpc.blog.list.useQuery(
    { limit: 5 },
    { refetchInterval: 120_000 }
  );

  // Poll barter listings every 90 seconds
  const { data: barterListings } = trpc.barter.list.useQuery(
    { category: "all" },
    { refetchInterval: 90_000 }
  );

  // Initialize seen sets on first load (no toast for existing items)
  useEffect(() => {
    if (!initialized.current && blogPosts && barterListings) {
      blogPosts.forEach(p => seenBlogIds.current.add(p.id));
      barterListings.forEach(l => seenBarterIds.current.add(l.id));
      initialized.current = true;
    }
  }, [blogPosts, barterListings]);

  // Detect new blog posts
  useEffect(() => {
    if (!initialized.current || !blogPosts) return;
    blogPosts.forEach(post => {
      if (!seenBlogIds.current.has(post.id)) {
        seenBlogIds.current.add(post.id);
        setToasts(prev => [
          ...prev,
          {
            id: `blog-${post.id}`,
            type: "blog",
            title: "New Post Just Dropped!",
            subtitle: post.title,
            link: `/blog/${post.slug}`,
          },
        ]);
      }
    });
  }, [blogPosts]);

  // Detect new barter listings
  useEffect(() => {
    if (!initialized.current || !barterListings) return;
    barterListings.forEach(listing => {
      if (!seenBarterIds.current.has(listing.id)) {
        seenBarterIds.current.add(listing.id);
        setToasts(prev => [
          ...prev,
          {
            id: `barter-${listing.id}`,
            type: "barter",
            title: "New Trade Posted!",
            subtitle: listing.title,
            link: "/barter",
          },
        ]);
      }
    });
  }, [barterListings]);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-xs">
      {toasts.slice(-3).map(toast => (
        <div
          key={toast.id}
          className="bg-stone-900 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === "blog" ? (
              <BookOpen className="w-5 h-5 text-amber-400" />
            ) : (
              <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">{toast.title}</p>
            <p className="text-sm text-gray-200 truncate mt-0.5">{toast.subtitle}</p>
            <Link
              href={toast.link}
              onClick={() => dismiss(toast.id)}
              className="text-xs text-amber-300 hover:text-amber-200 underline mt-1 inline-block"
            >
              {toast.type === "blog" ? "Read it →" : "View board →"}
            </Link>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-gray-500 hover:text-gray-300 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
