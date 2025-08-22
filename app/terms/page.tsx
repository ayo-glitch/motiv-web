"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using MOTIV, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of MOTIV per device for personal, non-commercial transitory viewing only.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on MOTIV</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Event Hosting</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  As an event host on MOTIV, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Provide accurate and complete information about your events</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Ensure the safety and security of your event attendees</li>
                  <li>Honor all ticket sales and refund policies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Ticket Purchases</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When purchasing tickets through MOTIV:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>All sales are final unless otherwise specified by the event host</li>
                  <li>You are responsible for providing accurate contact information</li>
                  <li>Tickets are non-transferable unless permitted by the event host</li>
                  <li>MOTIV acts as a platform and is not responsible for event cancellations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Privacy Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy, 
                  which is incorporated into these terms by reference.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
                <p className="text-gray-300 leading-relaxed">
                  The materials on MOTIV are provided on an 'as is' basis. MOTIV makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including without limitation, implied warranties or 
                  conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property 
                  or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitations</h2>
                <p className="text-gray-300 leading-relaxed">
                  In no event shall MOTIV or its suppliers be liable for any damages (including, without limitation, damages for 
                  loss of data or profit, or due to business interruption) arising out of the use or inability to use MOTIV, 
                  even if MOTIV or a MOTIV authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Revisions</h2>
                <p className="text-gray-300 leading-relaxed">
                  MOTIV may revise these terms of service at any time without notice. By using MOTIV, you are agreeing to be bound 
                  by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us through our contact form or 
                  email us at support@motiv.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}