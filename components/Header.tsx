"use client";

import {
  Search,
  Menu,
  X,
  LogIn,
  Home,
  Heart,
  Calendar,
  LogOut,
  Share2,
  Plus,
  MessageCircle,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchModal } from "@/components/modals/SearchModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { ShareModal } from "@/components/modals/ShareModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserProfileModal } from "@/components/auth/UserProfileModal";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // normalize avatar url from possible casing differences
  const avatarUrl = user ? (user.avatar ?? user.Avatar ?? null) : null;


  // Preload avatar to detect if it actually loads or errors (helps debugging hotlink/CSP issues)
  useEffect(() => {
    if (!avatarUrl) {
      setAvatarError(false);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    // avoid sending referrer (some providers block hotlinking based on referrer)
    (img as any).referrerPolicy = "no-referrer";
    img.onload = () => {
      console.log("avatar loaded:", avatarUrl);
      setAvatarError(false);
    };
    img.onerror = (e) => {
      console.log("avatar failed to load:", avatarUrl, e);
      setAvatarError(true);
    };
    img.src = avatarUrl;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [avatarUrl]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false);
  };

  return (
    <div>
      
  
    <header className="backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50 border-b border-gray-800/50">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div
          className="text-2xl md:text-3xl font-bold text-[#D72638] font-anton hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => router.push("/")}
        >
          MOTIV 
        </div>
        

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-white font-semibold hover:text-gray-300 transition-all duration-300 relative group"
          >
            Share
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => router.push("/hosts/signin")}
            className="text-white font-semibold hover:text-gray-300 transition-all duration-300 relative group"
          >
            Create Rave
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="text-white font-semibold hover:text-gray-300 transition-all duration-300 relative group"
          >
            Contact us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white px-6 py-2 rounded-full shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Search
          </Button>

          {/* User Authentication */}
          {user ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300"
            >
              {avatarUrl && !avatarError ? (
                <img
                  src={avatarUrl}
                  alt={user.name || user.Name}
                  className="w-8 h-8 rounded-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onLoad={() => setAvatarError(false)}
                  onError={() => {
                    console.log("img onError for:", avatarUrl);
                    setAvatarError(true);
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-[#000] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(user.username || user.Name)?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span className="font-medium">{user.name || user.Name} </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-white font-semibold hover:text-gray-300 transition-all duration-300 relative group"
            >
              Sign In
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          )}

          {/* Desktop Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-gray-800/50 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-gray-300 transition-colors duration-300"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Menu Dropdown */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 hidden md:block"
            onClick={toggleMenu}
          />
          <div className="absolute top-full right-4 mt-2 w-72 bg-[#0D0D0D]/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50 hidden md:block overflow-hidden">
            <div className="p-3">
              <div className="space-y-0.5">
                {/* Navigation Items */}
                <a
                  href="/"
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Home className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Home</span>
                </a>

                <button
                  onClick={() => {
                    setIsSearchModalOpen(true);
                    toggleMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Search className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Search Events</span>
                </button>

                <a
                  href="/wishlist"
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Heart className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Wishlist</span>
                </a>

                <a
                  href="/my-raves"
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Calendar className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">My Raves</span>
                </a>

                <button
                  onClick={() => {
                    router.push("/hosts/signin");
                    toggleMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Plus className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Create Rave</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-700/50 my-2"></div>

                {/* Additional Menu Items */}
                <button
                  onClick={() => {
                    setIsShareModalOpen(true);
                    toggleMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <Share2 className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Share</span>
                </button>

                <button
                  onClick={() => {
                    setIsContactModalOpen(true);
                    toggleMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                  <span className="font-medium text-sm">Contact Us</span>
                </button>

                {/* Host Mode Toggle */}
                <div className="border-t border-gray-700/50 my-2"></div>

                <a
                  href={user ? "/hosts/dashboard" : "#"}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setIsAuthModalOpen(true);
                    }
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white hover:from-[#B91E2F] hover:to-[#A01A2A] transition-all duration-200 hover:scale-[1.02]"
                >
                  <Crown className="w-4 h-4" />
                  <span className="font-medium text-sm">Host Mode</span>
                </a>

                {/* Logout */}
                {user && (
                  <>
                    <div className="border-t border-gray-700/50 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium text-sm">Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 sm:w-80 border-l border-gray-800/50 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } bg-[#0D0D0D]/98 backdrop-blur-md`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
            <div className="text-lg font-bold text-[#D72638] font-anton">
              MOTIV
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-gray-800/50 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col flex-1 px-4 py-4 overflow-y-auto">
            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg mb-4">
                {avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={user.name || user.Name}
                    className="w-8 h-8 rounded-full object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onLoad={() => setAvatarError(false)}
                    onError={() => {
                      console.log("mobile img onError for:", avatarUrl);
                      setAvatarError(true);
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(user.name || user.Name)?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate text-sm">
                    {user.name || user.Name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {user.email || user.Email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <span className="text-xs font-bold">•••</span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 p-3 bg-[#D72638] hover:bg-[#B91E2F] rounded-lg transition-colors mb-4"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Sign In</span>
              </button>
            )}

            {/* Navigation Items */}
            <div className="space-y-1">
              <a
                href="/"
                onClick={toggleMenu}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Home className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Home</span>
              </a>

              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Search className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Search Events</span>
              </button>

              <a
                href="/wishlist"
                onClick={toggleMenu}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Heart className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Wishlist</span>
              </a>

              <a
                href="/my-raves"
                onClick={toggleMenu}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Calendar className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">My Raves</span>
              </a>

              <button
                onClick={() => {
                  router.push("/hosts/signin");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Plus className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Create Rave</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-700/50 my-3"></div>

              <button
                onClick={() => {
                  setIsShareModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <Share2 className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Share</span>
              </button>

              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
              >
                <MessageCircle className="w-4 h-4 group-hover:text-[#D72638] transition-colors" />
                <span className="font-medium text-sm">Contact Us</span>
              </button>
            </div>

            {/* Host Mode - Prominent placement */}
            <div className="mt-4 pt-3 border-t border-gray-700/50">
              <a
                href={user ? "/hosts/dashboard" : "#"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setIsAuthModalOpen(true);
                  }
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white hover:from-[#B91E2F] hover:to-[#A01A2A] transition-all duration-200 hover:scale-[1.02]"
              >
                <Crown className="w-4 h-4" />
                <span className="font-medium text-sm">Host Mode</span>
              </a>
            </div>

            {/* Logout */}
            {user && (
              <div className="mt-auto pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      {user && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onLogout={handleLogout}
          onUpdateProfile={updateProfile}
        />
      )}
    </header>
      </div>
  );
}
