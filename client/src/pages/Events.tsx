/*
 * Community Events Page — A1 Homestead Hub
 * Shows upcoming community events. Past events are automatically hidden.
 * Admins see a management panel to create, edit, and delete events.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  MapPin,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Star,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

type EventCategory =
  | "festival"
  | "market"
  | "workshop"
  | "swap_meet"
  | "community"
  | "homestead_tour"
  | "other";

const CATEGORY_LABELS: Record<EventCategory, string> = {
  festival: "Festival",
  market: "Market / Fair",
  workshop: "Workshop",
  swap_meet: "Swap Meet",
  community: "Community",
  homestead_tour: "Homestead Tour",
  other: "Other",
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  festival: "bg-amber-100 text-amber-800 border-amber-200",
  market: "bg-green-100 text-green-800 border-green-200",
  workshop: "bg-blue-100 text-blue-800 border-blue-200",
  swap_meet: "bg-purple-100 text-purple-800 border-purple-200",
  community: "bg-teal-100 text-teal-800 border-teal-200",
  homestead_tour: "bg-orange-100 text-orange-800 border-orange-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

function formatEventDate(eventDate: Date, endDate?: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const start = new Date(eventDate);
  const startStr = start.toLocaleDateString("en-US", opts);
  const timeStr = start.toLocaleTimeString("en-US", timeOpts);

  if (endDate) {
    const end = new Date(endDate);
    const endDateStr = end.toLocaleDateString("en-US", opts);
    if (startStr !== endDateStr) {
      return `${startStr} – ${endDateStr}`;
    }
  }
  return `${startStr} · ${timeStr}`;
}

// ─── Admin Event Form ─────────────────────────────────────────────────────────

type EventFormData = {
  title: string;
  description: string;
  eventDate: string;
  endDate: string;
  location: string;
  address: string;
  category: EventCategory;
  imageUrl: string;
  externalUrl: string;
  isFeatured: boolean;
};

const EMPTY_FORM: EventFormData = {
  title: "",
  description: "",
  eventDate: "",
  endDate: "",
  location: "",
  address: "",
  category: "community",
  imageUrl: "",
  externalUrl: "",
  isFeatured: false,
};

function EventFormDialog({
  trigger,
  initialData,
  eventId,
  onSuccess,
}: {
  trigger: React.ReactNode;
  initialData?: Partial<EventFormData>;
  eventId?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventFormData>({ ...EMPTY_FORM, ...initialData });
  const utils = trpc.useUtils();

  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Event created! It's now live on the Events board.");
      utils.events.getUpcoming.invalidate();
      utils.events.getAll.invalidate();
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Event updated!");
      utils.events.getUpcoming.invalidate();
      utils.events.getAll.invalidate();
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      eventDate: new Date(form.eventDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      location: form.location,
      address: form.address || undefined,
      category: form.category,
      imageUrl: form.imageUrl || undefined,
      externalUrl: form.externalUrl || undefined,
      isFeatured: form.isFeatured,
    };
    if (eventId) {
      updateMutation.mutate({ id: eventId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{eventId ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Scott City 4th of July Celebration"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Start Date & Time *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Venue / Location Name *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Scott City Park"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as EventCategory }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="address">Full Address (optional)</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="e.g. 123 Main St, Scott City, KS 67871"
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tell the community what to expect..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="externalUrl">Link to Original Post / Event Page</Label>
            <Input
              id="externalUrl"
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="isFeatured">Feature this event (shows star badge)</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800 text-white">
              {isLoading ? "Saving..." : eventId ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
  isAdmin,
  onDeleted,
}: {
  event: any;
  isAdmin: boolean;
  onDeleted: () => void;
}) {
  const utils = trpc.useUtils();
  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Event removed.");
      utils.events.getUpcoming.invalidate();
      utils.events.getAll.invalidate();
      onDeleted();
    },
    onError: (e) => toast.error(e.message),
  });

  const cat = event.category as EventCategory;
  const dateStr = formatEventDate(event.eventDate, event.endDate);

  // Build edit form initial values
  const toDatetimeLocal = (d: Date | null) => {
    if (!d) return "";
    const dt = new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  const editInitial: Partial<EventFormData> = {
    title: event.title,
    description: event.description,
    eventDate: toDatetimeLocal(event.eventDate),
    endDate: toDatetimeLocal(event.endDate),
    location: event.location,
    address: event.address ?? "",
    category: cat,
    imageUrl: event.imageUrl ?? "",
    externalUrl: event.externalUrl ?? "",
    isFeatured: event.isFeatured,
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Category bar */}
      <div className={`h-1.5 w-full ${cat === "festival" ? "bg-amber-400" : cat === "market" ? "bg-green-500" : cat === "workshop" ? "bg-blue-500" : cat === "community" ? "bg-teal-500" : "bg-stone-400"}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[cat]}`}>
              {CATEGORY_LABELS[cat]}
            </span>
            {event.isFeatured && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
              </span>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-1 shrink-0">
              <EventFormDialog
                trigger={
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-stone-400 hover:text-stone-700">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                }
                initialData={editInitial}
                eventId={event.id}
                onSuccess={() => {}}
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-stone-400 hover:text-red-600"
                onClick={() => {
                  if (confirm(`Remove "${event.title}"?`)) deleteMutation.mutate({ id: event.id });
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-stone-900 text-lg leading-snug mb-3">{event.title}</h3>

        {/* Date & Location */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <CalendarDays className="w-4 h-4 text-green-700 shrink-0" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="w-4 h-4 text-green-700 shrink-0" />
            <span>{event.location}{event.address ? ` — ${event.address}` : ""}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">
          {event.description}
        </p>

        {/* Footer */}
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            View Full Details <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Admins see all events; public sees only upcoming
  const upcomingQuery = trpc.events.getUpcoming.useQuery(undefined, { enabled: !isAdmin });
  const allQuery = trpc.events.getAll.useQuery(undefined, { enabled: isAdmin });

  const rawEvents = isAdmin ? (allQuery.data ?? []) : (upcomingQuery.data ?? []);
  const isLoading = isAdmin ? allQuery.isLoading : upcomingQuery.isLoading;

  const events = filterCategory === "all"
    ? rawEvents
    : rawEvents.filter((e: any) => e.category === filterCategory);

  const categories = Array.from(new Set(rawEvents.map((e: any) => e.category as EventCategory)));

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-800 to-green-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-green-300 text-sm font-medium mb-3 uppercase tracking-widest">
            <CalendarDays className="w-4 h-4" />
            Community Events
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            What's Happening Near You
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Fairs, markets, workshops, swap meets, and homestead gatherings in your region.
            Events are removed automatically once they pass — so everything here is upcoming.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="border-b border-stone-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("all")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filterCategory === "all" ? "bg-green-700 text-white border-green-700" : "bg-white text-stone-600 border-stone-300 hover:border-green-600"}`}
            >
              All Events {rawEvents.length > 0 && `(${rawEvents.length})`}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filterCategory === cat ? "bg-green-700 text-white border-green-700" : "bg-white text-stone-600 border-stone-300 hover:border-green-600"}`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Admin: add event button */}
          {isAdmin && (
            <EventFormDialog
              trigger={
                <Button className="bg-green-700 hover:bg-green-800 text-white gap-1.5">
                  <Plus className="w-4 h-4" /> Add Event
                </Button>
              }
              onSuccess={() => setRefreshKey((k) => k + 1)}
            />
          )}
        </div>
      </section>

      {/* Events grid */}
      <main className="max-w-5xl mx-auto px-4 py-10 flex-1 w-full">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="w-14 h-14 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-600 mb-2">
              {filterCategory === "all" ? "No upcoming events yet" : `No ${CATEGORY_LABELS[filterCategory as EventCategory]} events`}
            </h2>
            <p className="text-stone-400 text-sm max-w-sm mx-auto">
              {isAdmin
                ? "Click \"Add Event\" to post the first one."
                : "Check back soon — community events will appear here as they're posted."}
            </p>
          </div>
        ) : (
          <>
            {isAdmin && (
              <p className="text-xs text-stone-400 mb-4 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Admin view — showing all events including past ones. Public visitors only see upcoming events.
              </p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAdmin={isAdmin}
                  onDeleted={() => setRefreshKey((k) => k + 1)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Submit your own event CTA */}
      <section className="bg-green-800 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-serif mb-3">Know About an Event?</h2>
          <p className="text-green-200 mb-6">
            If you know of a homestead fair, seed swap, workshop, or community gathering that should be on this board, reach out and we'll add it.
          </p>
          <a
            href="/partners"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Contact Us <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
