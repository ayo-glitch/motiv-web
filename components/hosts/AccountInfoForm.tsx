"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AccountInfoForm() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    website: "",
    location: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        website: "", // Add to user model if needed
        location: "", // Add to user model if needed
        phoneNumber: "", // Add to user model if needed
        address: "", // Add to user model if needed
        city: "", // Add to user model if needed
        country: "", // Add to user model if needed
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
        name: formData.fullName,
        email: formData.email,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
      
      {/* Profile Photo Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <Button variant="outline" className="border-gray-300" disabled>
            Upload Photo (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
                required
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
                placeholder="Coming soon"
                disabled
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
                placeholder="Coming soon"
                disabled
              />
            </div>
          </div>
        </form>
      </div>

      {/* Contact Details */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
        <p className="text-sm text-gray-600 mb-4">
          This contact information will be used to contact you for booking orders.
        </p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="focus:ring-[#D72638] focus:border-[#D72638]"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="focus:ring-[#D72638] focus:border-[#D72638]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City/State
              </label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleInputChange}
                className="focus:ring-[#D72638] focus:border-[#D72638]"
              />
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isUpdatingProfile}
        className="bg-[#D72638] hover:bg-[#B91E2F] text-white disabled:opacity-50"
      >
        {isUpdatingProfile ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          'Save Profile'
        )}
      </Button>
    </div>
  );
}