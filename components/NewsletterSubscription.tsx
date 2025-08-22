"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically make an API call to subscribe the user
    console.log("Subscribing email:", email);
    
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail("");
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-[#333] rounded-2xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#D72638] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Subscribe to get updated on new events, exclusive deals, and the hottest raves in Lagos
            </p>
          </div>

          {isSubmitted ? (
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-6">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Thanks for subscribing! We'll keep you updated.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-[#0D0D0D] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#D72638] focus:ring-[#D72638] rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            </form>
          )}

          <p className="text-gray-500 text-sm mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}