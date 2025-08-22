"use client";

import {
  LayoutDashboard,
  Star,
  Users,
  Settings,
  LogOut,
  Calendar,
  BarChart3,
  CreditCard,
  QrCode,
  X,
  User,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/hosts/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Raves",
    href: "/hosts/raves",
    icon: Calendar,
  },
  {
    title: "Attendees",
    href: "/hosts/attendees",
    icon: Users,
  },
  {
    title: "Scan QR Code",
    href: "/hosts/scan-qr",
    icon: QrCode,
  },
  {
    title: "Analytics",
    href: "/hosts/analytics",
    icon: BarChart3,
  },
  {
    title: "Reviews",
    href: "/hosts/reviews",
    icon: Star,
  },
  {
    title: "Payments",
    href: "/hosts/payments",
    icon: CreditCard,
  },
  // {
  //   title: "Account Settings",
  //   href: "/hosts/settings",
  //   icon: Settings,
  // },
];

interface HostSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HostSidebar({ isOpen, onClose }: HostSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/hosts/signin");
  };

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
      return;
    }
    // If user is logged in, navigation will proceed normally
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
        <div className="p-4">
          {/* User Info Section */}
          {user ? (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {user.avatar || user.Avatar ? (
                  <img
                    src={user.avatar || user.Avatar}
                    alt={user.name || user.Name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold">
                    {(user.name || user.Name)?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.Name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || user.Email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 mb-3">
                <Lock className="w-4 h-4" />
                <p className="text-sm font-medium">Sign in required</p>
              </div>
              <p className="text-xs text-yellow-600 mb-3">
                Please sign in to access host features
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white text-sm py-2"
              >
                Sign In
              </Button>
            </div>
          )}

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const isDisabled = !user;

              return (
                <Link
                  key={item.href}
                  href={user ? item.href : "#"}
                  onClick={(e) => handleProtectedClick(e, item.href)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isDisabled
                      ? "text-gray-400 cursor-not-allowed opacity-60"
                      : isActive
                      ? "bg-[#D72638] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex items-center gap-2">
                    {item.title}
                    {isDisabled && <Lock className="w-3 h-3" />}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          {user && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="text-xl font-bold text-[#D72638] font-anton">
              MOTIV
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-[#D72638] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile User Info Section */}
          {user ? (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {user.avatar || user.Avatar ? (
                  <img
                    src={user.avatar || user.Avatar}
                    alt={user.name || user.Name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold">
                    {(user.name || user.Name)?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.Name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || user.Email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 mb-3">
                <Lock className="w-4 h-4" />
                <p className="text-sm font-medium">Sign in required</p>
              </div>
              <p className="text-xs text-yellow-600 mb-3">
                Please sign in to access host features
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white text-sm py-2"
              >
                Sign In
              </Button>
            </div>
          )}

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const isDisabled = !user;

              return (
                <Link
                  key={item.href}
                  href={user ? item.href : "#"}
                  onClick={(e) => {
                    if (!user) {
                      handleProtectedClick(e, item.href);
                    } else {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation",
                    isDisabled
                      ? "text-gray-400 cursor-not-allowed opacity-60"
                      : isActive
                      ? "bg-[#D72638] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex items-center gap-2">
                    {item.title}
                    {isDisabled && <Lock className="w-3 h-3" />}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          {user && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full touch-manipulation"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          onClose(); // Close mobile sidebar if open
          // Redirect to dashboard after successful authentication
          router.push("/hosts/dashboard");
        }}
      />
    </>
  );
}
