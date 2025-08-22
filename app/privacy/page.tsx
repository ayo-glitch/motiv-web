import React from 'react';

export const metadata = {
  title: 'Privacy Policy - MOTIV',
  description: 'Privacy policy for MOTIV',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective date: August 14, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="leading-relaxed">
          We collect information you provide directly (such as when you create an account),
          information about your activity on the service, and information from third-party services
          (for example, when you sign in with Google).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
        <p className="leading-relaxed">
          We use the information to provide, maintain, and improve our services, to communicate with
          you, and to detect and prevent abuse. We may also use information for analytics and
          personalization.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Sharing and Disclosure</h2>
        <p className="leading-relaxed">
          We do not sell your personal information. We may share information with service
          providers and partners who perform services for us, and if required by law or to protect
          rights and safety.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Security</h2>
        <p className="leading-relaxed">
          We take reasonable measures to protect your information, but no online service is
          completely secure. Report any suspected breaches to our support team.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Your Choices</h2>
        <p className="leading-relaxed">
          You can access or update your account information, and choose what communications you
          receive. For account deletion or privacy requests, contact support.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
        <p className="leading-relaxed">
          For privacy questions, contact us at <a className="text-primary underline" href="mailto:support@motivapp.com">support@motivapp.com</a>.
        </p>
      </section>

      <p className="text-xs text-muted-foreground mt-8">© {new Date().getFullYear()} MOTIV. All rights reserved.</p>
    </main>
  );
}
