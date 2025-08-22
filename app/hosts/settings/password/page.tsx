"use client";

import { useState } from "react";
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

export default function HostPasswordPage() {
  const pathname = usePathname();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex gap-8">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
          <nav className="space-y-2">
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
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Set Password</h2>
            <p className="text-gray-600 mb-6">A password has not been set for your account.</p>
            
            <button className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
              Set Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}