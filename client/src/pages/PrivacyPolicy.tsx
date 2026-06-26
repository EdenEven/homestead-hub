/**
 * Privacy Policy Page — A1 Homestead Hub
 * Compliant with: Google AdSense, Google Analytics, CCPA, GDPR basics
 * Last updated: June 2026
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const EFFECTIVE_DATE = "June 26, 2026";
const SITE_NAME = "A1 Homestead Hub";
const SITE_URL = "https://a1homesteadhub.com";
const CONTACT_EMAIL = "a1homesteaderhub@gmail.com";
const OWNER_NAME = "Nikki Russell";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-14 w-full">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(0.50 0.10 145)" }}>
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.50 0.04 80)" }}>
            Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Operated by {OWNER_NAME}
          </p>
        </div>

        <div className="space-y-10 text-base leading-relaxed" style={{ color: "oklch(0.35 0.04 50)" }}>

          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              1. Introduction
            </h2>
            <p>
              Welcome to {SITE_NAME} ("{SITE_URL}"). This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website. Please read this policy carefully. If you
              disagree with its terms, please discontinue use of the site.
            </p>
            <p className="mt-3">
              We reserve the right to make changes to this policy at any time. We will alert you to changes by
              updating the effective date above. Your continued use of the site after any changes constitutes your
              acceptance of the revised policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              2. Information We Collect
            </h2>
            <p className="mb-3">We may collect the following categories of information:</p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.02 80)" }}>
                <p className="font-semibold mb-1" style={{ color: "oklch(0.30 0.06 50)" }}>Account Information</p>
                <p>When you create an account, we collect your name, email address, and login credentials. If you sign in with Google, we receive your Google profile name and email.</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.02 80)" }}>
                <p className="font-semibold mb-1" style={{ color: "oklch(0.30 0.06 50)" }}>Usage Data</p>
                <p>We automatically collect information about how you interact with the site, including pages visited, time spent, links clicked, and browser/device information. This is collected via cookies and analytics tools.</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.02 80)" }}>
                <p className="font-semibold mb-1" style={{ color: "oklch(0.30 0.06 50)" }}>User-Generated Content</p>
                <p>Content you submit — including barter listings, community posts, course enrollments, and messages — is stored on our servers.</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.02 80)" }}>
                <p className="font-semibold mb-1" style={{ color: "oklch(0.30 0.06 50)" }}>Payment Information</p>
                <p>If you subscribe to Schoolhouse Pro, payment is processed by Stripe. We do not store your full credit card number. Stripe's privacy policy governs payment data: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>stripe.com/privacy</a>.</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.02 80)" }}>
                <p className="font-semibold mb-1" style={{ color: "oklch(0.30 0.06 50)" }}>Voice Data</p>
                <p>If you use the Voice Q&amp;A feature in the Schoolhouse, audio recordings are temporarily uploaded to our servers for transcription and then deleted. We do not retain voice recordings.</p>
              </div>
            </div>
          </section>

          {/* 3. Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              3. Cookies and Tracking Technologies
            </h2>
            <p className="mb-3">
              We use cookies and similar tracking technologies to improve your experience. These include:
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li><strong>Session cookies</strong> — required to keep you logged in during your visit.</li>
              <li><strong>Analytics cookies</strong> — used by our analytics provider (Umami) to understand how visitors use the site. Umami is privacy-focused and does not use cross-site tracking.</li>
              <li><strong>Advertising cookies</strong> — used by <strong>Google AdSense</strong> to serve relevant advertisements. Google may use cookies to show you ads based on your prior visits to this site and other sites on the internet. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>aboutads.info</a>.</li>
            </ul>
          </section>

          {/* 4. Google AdSense */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              4. Google AdSense
            </h2>
            <p className="mb-3">
              {SITE_NAME} uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads
              based on your prior visits to this website or other websites. Google's use of advertising cookies
              enables it and its partners to serve ads to you based on your visit to our site and/or other sites
              on the internet.
            </p>
            <p className="mb-3">
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to
              our website. Google's use of the DART cookie enables it to serve ads to our users based on their
              visit to our site and other sites on the internet.
            </p>
            <p>
              You may opt out of the use of the DART cookie by visiting the{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>
                Google ad and content network privacy policy
              </a>. For more information about how Google uses data when you use our site, visit{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>
                Google Privacy Policy
              </a>.
            </p>
          </section>

          {/* 5. How We Use Information */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              5. How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-1 pl-5 list-disc">
              <li>Provide, operate, and maintain the site and its features</li>
              <li>Process transactions and manage your subscription</li>
              <li>Send you transactional emails (account confirmations, receipts)</li>
              <li>Send community updates and newsletters (only if you subscribe)</li>
              <li>Improve and personalize your experience</li>
              <li>Monitor and analyze usage to improve the site</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* 6. Sharing */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              6. Sharing of Your Information
            </h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information with:
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li><strong>Service providers</strong> — companies that help us operate the site (Stripe for payments, Resend for email, ElevenLabs for voice synthesis, Google for analytics and advertising). These providers are contractually obligated to protect your data.</li>
              <li><strong>Legal requirements</strong> — if required by law, court order, or governmental authority.</li>
              <li><strong>Business transfers</strong> — if the site is acquired or merged, your information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              7. Data Retention
            </h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we
              will delete your personal data within 30 days, except where we are required to retain it for legal
              or accounting purposes. Anonymized usage data may be retained indefinitely.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              8. Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="space-y-1 pl-5 list-disc">
              <li><strong>Access</strong> — request a copy of the data we hold about you</li>
              <li><strong>Correction</strong> — request correction of inaccurate data</li>
              <li><strong>Deletion</strong> — request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Opt-out of advertising</strong> — opt out of personalized ads via Google Ad Settings</li>
              <li><strong>California residents (CCPA)</strong> — you have the right to know what personal information is collected, the right to delete it, and the right to opt out of its sale (we do not sell personal information)</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          {/* 9. Children */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              9. Children's Privacy
            </h2>
            <p>
              The Schoolhouse section of this site is designed for use by children under parental supervision.
              We do not knowingly collect personal information from children under 13 without verifiable parental
              consent. The Schoolhouse does not require children to create accounts — student profiles are created
              and managed by parents or guardians. If you believe we have inadvertently collected information from
              a child under 13, please contact us immediately at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "oklch(0.40 0.10 220)" }}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          {/* 10. Security */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              10. Security
            </h2>
            <p>
              We use industry-standard security measures including HTTPS encryption, hashed passwords, and
              access-controlled databases to protect your information. However, no method of transmission over
              the internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          {/* 11. Third-Party Links */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              11. Third-Party Links
            </h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for the privacy practices
              of those sites and encourage you to review their privacy policies before providing any personal
              information.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              12. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 p-5 rounded-xl" style={{ background: "oklch(0.94 0.03 145)", border: "1px solid oklch(0.85 0.05 145)" }}>
              <p className="font-semibold mb-1" style={{ color: "oklch(0.25 0.08 145)" }}>{OWNER_NAME}</p>
              <p style={{ color: "oklch(0.35 0.06 145)" }}>{SITE_NAME}</p>
              <p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "oklch(0.35 0.10 220)" }}>
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                <a href={SITE_URL} className="underline" style={{ color: "oklch(0.35 0.10 220)" }}>
                  {SITE_URL}
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
