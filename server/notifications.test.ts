import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB module so tests don't need a real database
vi.mock("./db", () => ({
  getActiveAnnouncement: vi.fn(),
  createAnnouncement: vi.fn(),
  clearAnnouncement: vi.fn(),
  savePushSubscription: vi.fn(),
  deletePushSubscription: vi.fn(),
}));

import {
  getActiveAnnouncement,
  createAnnouncement,
  clearAnnouncement,
  savePushSubscription,
  deletePushSubscription,
} from "./db";

describe("Notification DB helpers (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getActiveAnnouncement returns null when no active announcement", async () => {
    vi.mocked(getActiveAnnouncement).mockResolvedValue(null);
    const result = await getActiveAnnouncement();
    expect(result).toBeNull();
  });

  it("getActiveAnnouncement returns the active announcement", async () => {
    const mockAnnouncement = {
      id: 1,
      message: "New blog post just dropped!",
      linkUrl: "/blog/new-post",
      linkText: "Read now →",
      type: "info" as const,
      isActive: true,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(getActiveAnnouncement).mockResolvedValue(mockAnnouncement);
    const result = await getActiveAnnouncement();
    expect(result).toEqual(mockAnnouncement);
    expect(result?.message).toBe("New blog post just dropped!");
  });

  it("createAnnouncement calls DB with correct data", async () => {
    vi.mocked(createAnnouncement).mockResolvedValue(undefined);
    await createAnnouncement({
      message: "Barter board is live!",
      linkUrl: "/barter",
      linkText: "Trade now →",
      type: "success",
      isActive: true,
      createdBy: 1,
    });
    expect(createAnnouncement).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Barter board is live!", type: "success" })
    );
  });

  it("clearAnnouncement deactivates all announcements", async () => {
    vi.mocked(clearAnnouncement).mockResolvedValue(undefined);
    await clearAnnouncement();
    expect(clearAnnouncement).toHaveBeenCalledTimes(1);
  });

  it("savePushSubscription stores endpoint, p256dh, and auth", async () => {
    vi.mocked(savePushSubscription).mockResolvedValue(undefined);
    await savePushSubscription({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
      p256dh: "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlTiESgX776I0w6HsPtj6HXHPDe7IkDkINTEFPY2A",
      auth: "tBHItJI5svbpez7KI4CCXg",
      userId: null,
    });
    expect(savePushSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "https://fcm.googleapis.com/fcm/send/abc123" })
    );
  });

  it("deletePushSubscription removes by endpoint", async () => {
    vi.mocked(deletePushSubscription).mockResolvedValue(undefined);
    await deletePushSubscription("https://fcm.googleapis.com/fcm/send/abc123");
    expect(deletePushSubscription).toHaveBeenCalledWith("https://fcm.googleapis.com/fcm/send/abc123");
  });
});
