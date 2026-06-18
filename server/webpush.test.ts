/**
 * webpush.test.ts
 * Validates that VAPID environment variables are present and well-formed.
 * A valid VAPID public key is a base64url-encoded 65-byte uncompressed EC point
 * (starts with 'B' and is ~88 characters long).
 */

import { describe, it, expect } from "vitest";

describe("VAPID secrets", () => {
  it("VAPID_PUBLIC_KEY is set and looks like a valid VAPID key", () => {
    const key = process.env.VAPID_PUBLIC_KEY;
    expect(key, "VAPID_PUBLIC_KEY must be set").toBeTruthy();
    // Base64url-encoded 65-byte key is 87-88 chars
    expect(key!.length, "VAPID_PUBLIC_KEY should be ~88 chars").toBeGreaterThanOrEqual(80);
    // Must only contain base64url characters
    expect(/^[A-Za-z0-9_-]+$/.test(key!), "VAPID_PUBLIC_KEY must be base64url").toBe(true);
  });

  it("VAPID_PRIVATE_KEY is set and looks like a valid VAPID key", () => {
    const key = process.env.VAPID_PRIVATE_KEY;
    expect(key, "VAPID_PRIVATE_KEY must be set").toBeTruthy();
    expect(key!.length, "VAPID_PRIVATE_KEY should be ~43 chars").toBeGreaterThanOrEqual(40);
    expect(/^[A-Za-z0-9_-]+$/.test(key!), "VAPID_PRIVATE_KEY must be base64url").toBe(true);
  });

  it("VITE_VAPID_PUBLIC_KEY matches VAPID_PUBLIC_KEY", () => {
    const pub = process.env.VAPID_PUBLIC_KEY;
    const vitePub = process.env.VITE_VAPID_PUBLIC_KEY;
    expect(vitePub, "VITE_VAPID_PUBLIC_KEY must be set").toBeTruthy();
    expect(vitePub, "VITE_VAPID_PUBLIC_KEY must match VAPID_PUBLIC_KEY").toBe(pub);
  });
});
