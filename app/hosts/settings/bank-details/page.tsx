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

export default function HostBankDetailsPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bank details:", formData);
  };

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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank:
                </label>
                <select
                  id="bankName"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638]"
                >
                  <option value="">Select</option>
                  <option value="access">Access Bank</option>
                  <option value="gtb">GTBank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="uba">UBA</option>
                  <option value="fidelity">Fidelity Bank</option>
                  <option value="fcmb">FCMB</option>
                  <option value="sterling">Sterling Bank</option>
                  <option value="union">Union Bank</option>
                </select>
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Account Number:
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  required
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638]"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Account Name:
                </label>
                <input
                  id="accountName"
                  name="accountName"
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638]"
                  placeholder="Enter account name"
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Bank Details
                </button>
                
                <p className="text-xs text-gray-500">
                  We take a commission of 1% of all transactions
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}