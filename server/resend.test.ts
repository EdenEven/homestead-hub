import { describe, it, expect } from "vitest";

/**
 * Validates that the RESEND_API_KEY env var is set and accepted by the Resend API.
 * This test hits the /domains endpoint (read-only, no side effects).
 */
describe("Resend API Key", () => {
  it("should be set in environment", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeTruthy();
    expect(key).toMatch(/^re_/);
  });

  it("should be accepted by Resend API", { timeout: 15000 }, async () => {
    const key = process.env.RESEND_API_KEY;
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body).toHaveProperty("data");
  });
});
