"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

export function SettingsNavigation() {
  const pathname = usePathname();

  return (
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
  );
}