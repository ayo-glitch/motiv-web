"use client";

import { User, Menu, X, Share2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContactModal } from "@/components/ContactModal";
import { ShareModal } from "@/components/hosts/ShareModal";
import { UserProfileModal } from "@/components/auth/UserProfileModal";
import { useAuth } from "@/contexts/AuthContext";

interface HostHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function HostHeader({ onMenuClick, isSidebarOpen }: HostHeaderProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleLogoClick = () => {
    router.push("/hosts/dashboard");
  };

  const handleFindRaves = () => {
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    setProfileModalOpen(false);
  };



  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Side - Menu Button + Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile Menu Button */}
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-gray-600 hover:text-[#D72638] hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-4 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="text-xl sm:text-2xl font-bold text-[#D72638] font-anton">
              MOTIV
            </div>
            <span className="hidden sm:block text-gray-400">|</span>
            <span className="hidden sm:block text-gray-600 font-medium">
              Host Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Links - Desktop Only */}
        <nav className="hidden xl:flex items-center space-x-6 lg:space-x-8">
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-[#D72638] font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleFindRaves}
            className="text-gray-600 hover:text-[#D72638] font-medium transition-colors duration-200"
          >
            Find Raves
          </button>
          <button
            onClick={() => setContactModalOpen(true)}
            className="text-gray-600 hover:text-[#D72638] font-medium transition-colors duration-200"
          >
            Contact us
          </button>
        </nav>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">


          {/* User Profile */}
          {user && (
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#D72638] transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
            >
              {user.avatar || user.Avatar ? (
                <img
                  src={user.avatar || user.Avatar}
                  alt={user.name || user.Name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(user.name || user.Name)?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span className="hidden md:block font-medium truncate max-w-32">
                {user.name || user.Name}
              </span>
            </button>
          )}

          {/* Logout Button - Mobile */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="sm:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 touch-manipulation"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      
      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* User Profile Modal */}
      {user && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onLogout={handleLogout}
          onUpdateProfile={updateProfile}
        />
      )}
    </header>
  );
}
