"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

export default function SignInPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Ensure we're on the client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if already logged in, but only after client-side hydration
  useEffect(() => {
    if (isClient && user && !isLoading) {
      router.push('/hosts/dashboard');
    }
  }, [user, router, isClient, isLoading]);

  // Show loading state while checking auth status
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#D72638] font-anton mb-4">
            MOTIV
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header with Logo and Welcome Message */}
      <div className="lg:hidden bg-black text-white px-4 py-8 text-center">
        <div className="text-3xl sm:text-4xl font-bold text-[#D72638] font-anton mb-4">
          MOTIV
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
          Welcome back, party starter.
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          Sign in to manage your events and keep the vibes going.
        </p>
      </div>

      {/* Desktop Left Side - Welcome Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-8 xl:p-12 flex-col justify-center">
        <div className="max-w-md xl:max-w-lg">
          {/* Logo */}
          <div className="text-3xl xl:text-4xl font-bold text-[#D72638] font-anton mb-8 xl:mb-12">
            MOTIV
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl xl:text-4xl font-bold mb-4 xl:mb-6 leading-tight">
            Welcome back, party starter.
          </h1>
          <p className="text-lg xl:text-xl text-gray-300 leading-relaxed">
            Sign in to manage your events and keep the vibes going.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Button */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              Host Login
            </h2>

            <p className="text-gray-600 mb-8">
              Use our universal authentication system to access your host dashboard.
            </p>

            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 sm:py-4 text-base sm:text-lg rounded-lg font-semibold transition-colors duration-200 touch-manipulation mb-6"
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm sm:text-base text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/hosts/signup"
                className="text-[#D72638] hover:text-[#B91E2F] font-semibold transition-colors duration-200 touch-manipulation"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
