"use client";

import { useState, useEffect } from "react";
import { HostHeader } from "@/components/hosts/HostHeader";
import { HostSidebar } from "@/components/hosts/HostSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useHostAuth } from "@/lib/middleware/hostAuth";
import { Loader2 } from "lucide-react";

export default function HostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isLoading, canAccessHostFeatures } = useHostAuth();

  // Ensure we're on the client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render layout if user can't access host features
  // (useHostAuth will handle redirects)
  if (!canAccessHostFeatures) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex">
        <HostSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 lg:ml-64 w-full min-w-0">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Toaster />
    </div>
  );
}