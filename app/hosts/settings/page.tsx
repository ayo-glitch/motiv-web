"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/hosts/OnboardingProgress";

const settingsNavItems = [
  {
    title: "Account Info",
    href: "/hosts/settings",
  },
  {
    title: "Change Email",
    href: "/hosts/settings/change-email",
  },
  {
    title: "Password",
    href: "/hosts/settings/password",
  },
  {
    title: "Set Up bank details",
    href: "/hosts/settings/bank-details",
  },
  {
    title: "Go back to Dashboard",
    href: "/hosts/dashboard",
  },
];

export default function HostSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "", // Add phone to user model if needed
        bio: "", // Add bio to user model if needed
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...user!,
        name: formData.name,
        email: formData.email,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Account Settings</h1>
          
          {/* Mobile Navigation - Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex-shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block space-y-2">
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Welcome Message for New Users */}
          <div className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Welcome to MOTIV! 🎉</h2>
            <p className="text-sm sm:text-base opacity-90">
              Complete your profile to start creating amazing rave events. Let's get you set up!
            </p>
          </div>

          {/* Onboarding Progress */}
          <OnboardingProgress 
            steps={[
              {
                id: 'account',
                title: 'Complete account information',
                completed: !!(formData.name && formData.email)
              },
              {
                id: 'profile',
                title: 'Add profile details',
                completed: false // Will be true when we add more profile fields
              },
              {
                id: 'verification',
                title: 'Verify your identity',
                completed: false // Future feature
              },
              {
                id: 'first-event',
                title: 'Create your first event',
                completed: false // Will check if user has created events
              }
            ]}
          />

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Account Information</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading profile...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] touch-manipulation"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] touch-manipulation"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] touch-manipulation"
                    placeholder="Enter your phone number"
                  />
                  <p className="text-xs text-gray-500 mt-1">Phone number support coming soon</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] touch-manipulation resize-none"
                    placeholder="Tell us about yourself"
                  />
                  <p className="text-xs text-gray-500 mt-1">Bio support coming soon</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto bg-[#D72638] hover:bg-[#B91E2F] text-white px-6 py-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 touch-manipulation disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/hosts/dashboard')}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 touch-manipulation"
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}