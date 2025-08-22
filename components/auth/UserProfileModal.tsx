"use client";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Calendar, MapPin, Edit2, LogOut, Key, Loader2 } from "lucide-react";
import { useState } from "react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: any) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onUpdateProfile,
}: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || user?.Name || "",
    username: user?.username || user?.Username || "",
    email: user?.email || user?.Email || "",
    location: user?.location || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    onUpdateProfile(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.Name || "",
      username: user?.username || user?.Username || "",
      email: user?.email || user?.Email || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    setPasswordResetLoading(true);
    setPasswordResetMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email || user?.Email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordResetMessage("Password reset link sent to your email");
      } else {
        setPasswordResetMessage(data.error || "Failed to send reset email");
      }
    } catch (error) {
      setPasswordResetMessage("Network error. Please try again.");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-[#1a1a1a] border-gray-700 [&>button]:text-white [&>button]:hover:text-gray-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            My Profile
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Manage your account information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {(user.avatar || user.Avatar) ? (
                <img
                  src={user.avatar || user.Avatar}
                  alt={user.name || user.Name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-[#000] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {(user.name || user.Name)?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              {user.provider === "google" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{user.name || user.Name}</h3>
              <p className="text-sm text-gray-300">@{user.username || user.Username}</p>
              <p className="text-xs text-gray-400">{user.email || user.Email}</p>
              <p className="text-xs text-gray-400 capitalize">
                {(user.role || user.Role || 'guest').toLowerCase()} account
              </p>
            </div>
            {!isEditing && (
              <div
                onClick={() => setIsEditing(true)}
                className="text-white cursor-pointer hover:text-gray-300"
              >
                <Edit2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-300"
                  >
                    Username
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-8 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Enter your username"
                      minLength={3}
                      maxLength={30}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-300"
                  >
                    Location (Optional)
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2 justify-center">
                  <div
                    onClick={handleSave}
                    className="text-red-500 cursor-pointer hover:text-red-400"
                  >
                    Save Changes
                  </div>
                  <div
                    onClick={handleCancel}
                    className="text-white cursor-pointer hover:text-gray-300"
                  >
                    Cancel
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name || user.Name}
                      </p>
                      <p className="text-xs text-gray-400">Full Name</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="w-4 h-4 flex items-center justify-center text-gray-400 text-sm font-bold">@</span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.username || user.Username}
                      </p>
                      <p className="text-xs text-gray-400">Username</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.email || user.Email}
                      </p>
                      <p className="text-xs text-gray-400">Email Address</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-400">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {(user.role || user.Role || 'guest').toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-400">Account Type</p>
                    </div>
                  </div>

                  {user.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.location}
                        </p>
                        <p className="text-xs text-gray-400">Location</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {new Date(user.created_at || user.createdAt || user.CreatedAt || new Date()).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">Member Since</p>
                    </div>
                  </div>
                </div>

                {/* Password Reset Section - Only show for non-Google users */}
                {user.provider !== "google" && (
                  <div className="pt-4 border-t border-gray-700">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Security</h4>
                      
                      {passwordResetMessage && (
                        <div className={`p-3 rounded-lg text-sm ${
                          passwordResetMessage.includes("sent") || passwordResetMessage.includes("success")
                            ? "bg-green-900/20 border border-green-700 text-green-300"
                            : "bg-red-900/20 border border-red-700 text-red-300"
                        }`}>
                          {passwordResetMessage}
                        </div>
                      )}

                      <div
                        onClick={handlePasswordReset}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                      >
                        <Key className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            Change Password
                          </p>
                          <p className="text-xs text-gray-400">
                            Send password reset link to your email
                          </p>
                        </div>
                        {passwordResetLoading && (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2 text-center">
                  <div
                    onClick={onClose}
                    className="text-white cursor-pointer hover:text-gray-300"
                  >
                    Close
                  </div>
                  <div
                    onClick={onLogout}
                    className="text-red-500 cursor-pointer hover:text-red-400 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
