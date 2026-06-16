/**
 * Email Service — Resend
 *
 * Handles all outbound email for A1 Homestead Hub.
 * Uses Resend (resend.com) — free tier: 3,000 emails/month, 100/day.
 *
 * From address: Uses Resend's shared onboarding domain until a1homesteadhub.com
 * is verified in the Resend dashboard. After verification, update FROM_ADDRESS.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Until a1homesteadhub.com is verified in Resend, use the onboarding address.
// After DNS verification, change this to: noreply@a1homesteadhub.com
const FROM_ADDRESS = "A1 Homestead Hub <onboarding@resend.dev>";
const REPLY_TO = "nikki@a1homesteadhub.com";
const SITE_URL = "https://a1homesteadhub.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — email not sent");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to,
        reply_to: REPLY_TO,
        subject,
        html,
        text: text ?? html.replace(/<[^>]+>/g, ""),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Email] Resend error ${res.status}:`, err);
      return false;
    }

    const data = await res.json() as any;
    console.log(`[Email] Sent to ${to} — id: ${data.id}`);
    return true;
  } catch (err) {
    console.error("[Email] sendEmail threw:", err);
    return false;
  }
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, firstName?: string | null): Promise<boolean> {
  const name = firstName?.trim() || "Friend";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to A1 Homestead Hub</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f0e8; font-family: Georgia, serif; color: #2d2a24; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: #1a2e1a; padding: 32px 40px; text-align: center; }
    .header img { width: 48px; height: 48px; border-radius: 8px; }
    .header h1 { color: #d4a843; font-size: 22px; margin: 12px 0 4px; letter-spacing: 0.5px; }
    .header p { color: #8fad6e; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
    .body { padding: 40px; }
    .body h2 { color: #1a2e1a; font-size: 24px; margin: 0 0 16px; }
    .body p { font-size: 16px; line-height: 1.7; color: #3d3830; margin: 0 0 16px; }
    .cta-block { background: #f5f0e8; border-left: 4px solid #d4a843; padding: 20px 24px; margin: 28px 0; border-radius: 0 8px 8px 0; }
    .cta-block p { margin: 0 0 8px; font-size: 15px; }
    .cta-block p:last-child { margin: 0; }
    .btn { display: inline-block; background: #d4a843; color: #1a2e1a; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 6px; text-decoration: none; margin: 8px 8px 8px 0; }
    .btn-outline { display: inline-block; border: 2px solid #1a2e1a; color: #1a2e1a; font-weight: bold; font-size: 15px; padding: 12px 26px; border-radius: 6px; text-decoration: none; margin: 8px 8px 8px 0; }
    .links { margin: 28px 0; }
    .links a { color: #4a7c3f; font-size: 15px; text-decoration: none; margin-right: 20px; }
    .footer { background: #1a2e1a; padding: 24px 40px; text-align: center; }
    .footer p { color: #6b7c5e; font-size: 12px; margin: 4px 0; }
    .footer a { color: #8fad6e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>A1 Homestead Hub</h1>
      <p>Self-Reliant Living Community</p>
    </div>
    <div class="body">
      <h2>Welcome, ${name}. You're in.</h2>
      <p>
        You just joined a community built around one idea: <strong>people who know how to feed, 
        shelter, and sustain themselves are more free than people who don't.</strong>
      </p>
      <p>
        A1 Homestead Hub is your daily resource for homesteading skills, community connections, 
        seed-to-table knowledge, and the kind of practical education that used to get passed down 
        at the kitchen table. We're rebuilding that.
      </p>

      <div class="cta-block">
        <p><strong>Here's what's waiting for you:</strong></p>
        <p>🌱 <strong>Skills Hub</strong> — 9 complete skill guides from butchering to water systems</p>
        <p>📚 <strong>The Schoolhouse</strong> — K–12 homestead curriculum, STEM, and college prep</p>
        <p>🔄 <strong>Barter &amp; Trade</strong> — Connect with local homesteaders to trade goods and skills</p>
        <p>🗺️ <strong>Land Access Map</strong> — Find land in your region</p>
        <p>📰 <strong>Daily Blog</strong> — New homesteading content published every morning</p>
      </div>

      <p style="text-align:center; margin: 28px 0;">
        <a href="${SITE_URL}/skills" class="btn">Explore Skills Hub</a>
        <a href="${SITE_URL}/community" class="btn-outline">Meet the Community</a>
      </p>

      <p>
        New content arrives every single day — a new blog post, a new skill tip, and new 
        course material in the Schoolhouse. The site is alive and growing. So is this community.
      </p>
      <p>
        If you ever have a question, hit reply. I read every one.
      </p>
      <p style="margin-top: 28px;">
        — Nikki Russell<br />
        <em>Founder, A1 Homestead Hub</em>
      </p>
    </div>
    <div class="footer">
      <p>A1 Homestead Hub · <a href="${SITE_URL}">a1homesteadhub.com</a></p>
      <p>You're receiving this because you signed up at A1 Homestead Hub.</p>
      <p><a href="${SITE_URL}">Visit the site</a> · <a href="mailto:nikki@a1homesteadhub.com">Contact us</a></p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: "Welcome to A1 Homestead Hub — You're in.",
    html,
  });
}

// ─── Partner Application Notification ────────────────────────────────────────

export async function sendPartnerApplicationEmail(application: {
  name: string;
  company: string;
  email: string;
  partnerType: string;
  message: string;
}): Promise<boolean> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Partner Application</title>
  <style>
    body { font-family: Georgia, serif; color: #2d2a24; background: #f5f0e8; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; }
    h2 { color: #1a2e1a; }
    .field { margin: 12px 0; }
    .label { font-weight: bold; color: #4a7c3f; }
    .value { color: #2d2a24; }
    .btn { display: inline-block; background: #d4a843; color: #1a2e1a; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>🤝 New Partner Application</h2>
    <div class="field"><span class="label">Name:</span> <span class="value">${application.name}</span></div>
    <div class="field"><span class="label">Company:</span> <span class="value">${application.company}</span></div>
    <div class="field"><span class="label">Email:</span> <span class="value"><a href="mailto:${application.email}">${application.email}</a></span></div>
    <div class="field"><span class="label">Partnership Type:</span> <span class="value">${application.partnerType}</span></div>
    <div class="field"><span class="label">Message:</span><br /><span class="value">${application.message.replace(/\n/g, "<br />")}</span></div>
    <a href="${SITE_URL}/partners" class="btn">View Partner Page</a>
  </div>
</body>
</html>`;

  return sendEmail({
    to: "nikki@a1homesteadhub.com",
    subject: `New Partner Application: ${application.name} (${application.company})`,
    html,
  });
}
