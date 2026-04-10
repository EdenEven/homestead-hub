import * as dotenv from "dotenv";
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_URL || !FORGE_KEY) {
  console.error("Missing FORGE env vars");
  process.exit(1);
}

const baseUrl = FORGE_URL.endsWith("/") ? FORGE_URL : `${FORGE_URL}/`;
const fullUrl = new URL("webdevtoken.v1.WebDevService/CallApi", baseUrl).toString();

try {
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "connect-protocol-version": "1",
      authorization: `Bearer ${FORGE_KEY}`,
    },
    body: JSON.stringify({
      apiId: "YahooFinance/get_stock_chart",
      query: { symbol: "ZC=F", region: "US", interval: "1d", range: "2d" },
    }),
  });

  console.log("HTTP Status:", response.status);
  if (!response.ok) {
    const text = await response.text();
    console.error("Error body:", text.slice(0, 300));
    process.exit(1);
  }

  const data = await response.json();
  const raw = typeof data?.jsonData === "string" ? JSON.parse(data.jsonData) : data;
  const meta = raw?.chart?.result?.[0]?.meta;
  if (meta) {
    console.log("✅ SUCCESS - Corn price:", meta.regularMarketPrice);
  } else {
    console.log("⚠️ Response OK but no meta:", JSON.stringify(data).slice(0, 200));
  }
} catch (e) {
  console.error("❌ FAILED:", e.message);
}
