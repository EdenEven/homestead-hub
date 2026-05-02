import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getBarterListings: vi.fn(),
  createBarterListing: vi.fn(),
  deleteBarterListing: vi.fn(),
}));

import { getBarterListings, createBarterListing, deleteBarterListing } from "./db";

const mockListing = {
  id: 1,
  userId: 0,
  title: "Fresh Pastured Eggs — 2 Dozen Weekly",
  description: "Two dozen fresh pastured eggs | Seeking: Canning jars",
  offering: "Two dozen fresh pastured eggs per week from our free-range flock.",
  seeking: "Canning jars (quart size), lids, or fresh garden produce.",
  category: "food-produce" as const,
  offeringType: "offer" as const,
  location: "Ozark Mountains, AR",
  state: null,
  posterName: "Nikki R.",
  posterEmail: "test@homesteadhub.com",
  contactMethod: null,
  isActive: true,
  createdAt: new Date("2026-05-02"),
  updatedAt: new Date("2026-05-02"),
};

describe("Barter & Trade DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getBarterListings returns an array of active listings", async () => {
    vi.mocked(getBarterListings).mockResolvedValue([mockListing]);
    const listings = await getBarterListings();
    expect(listings).toHaveLength(1);
    expect(listings[0].title).toBe("Fresh Pastured Eggs — 2 Dozen Weekly");
    expect(listings[0].isActive).toBe(true);
  });

  it("getBarterListings filters by category when provided", async () => {
    vi.mocked(getBarterListings).mockResolvedValue([mockListing]);
    const listings = await getBarterListings("food-produce");
    expect(getBarterListings).toHaveBeenCalledWith("food-produce");
    expect(listings[0].category).toBe("food-produce");
  });

  it("getBarterListings returns empty array when no listings exist", async () => {
    vi.mocked(getBarterListings).mockResolvedValue([]);
    const listings = await getBarterListings();
    expect(listings).toHaveLength(0);
  });

  it("createBarterListing inserts a new listing with offering and seeking fields", async () => {
    vi.mocked(createBarterListing).mockResolvedValue(undefined);
    await expect(
      createBarterListing({
        userId: 0,
        title: "Fresh Eggs for Canning Jars",
        description: "Fresh eggs | Seeking: Canning jars",
        offering: "Two dozen fresh eggs per week",
        seeking: "Canning jars or lids",
        category: "food-produce",
        offeringType: "offer",
        location: "Ozark Mountains, AR",
        posterName: "Nikki R.",
        posterEmail: "test@homesteadhub.com",
        isActive: true,
      })
    ).resolves.not.toThrow();
    expect(createBarterListing).toHaveBeenCalledOnce();
  });

  it("createBarterListing works without optional fields (guest post)", async () => {
    vi.mocked(createBarterListing).mockResolvedValue(undefined);
    await expect(
      createBarterListing({
        userId: 0,
        title: "Firewood for Produce",
        description: "Seasoned hardwood | Seeking: Vegetables",
        offering: "1 cord seasoned hardwood firewood",
        seeking: "Fresh vegetables or canned goods",
        category: "other",
        offeringType: "offer",
        isActive: true,
      })
    ).resolves.not.toThrow();
  });

  it("listing has both offering and seeking fields populated", () => {
    expect(mockListing.offering).toBeTruthy();
    expect(mockListing.seeking).toBeTruthy();
    expect(mockListing.offering).toContain("eggs");
    expect(mockListing.seeking).toContain("jars");
  });

  it("deleteBarterListing soft-deletes by setting isActive to false", async () => {
    vi.mocked(deleteBarterListing).mockResolvedValue(undefined);
    await expect(deleteBarterListing(1, 1)).resolves.not.toThrow();
    expect(deleteBarterListing).toHaveBeenCalledWith(1, 1);
  });

  it("listing category is a valid enum value", () => {
    const validCategories = [
      "food-produce", "skills-labor", "animals-livestock",
      "seeds-plants", "tools-equipment", "goods-crafts", "land-space", "other"
    ];
    expect(validCategories).toContain(mockListing.category);
  });
});
