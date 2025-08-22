"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User, Mail, Phone, Loader2 } from "lucide-react";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    attendeeFullName: string;
    attendeeEmail: string;
    attendeePhone: string;
  }) => void;
  isLoading?: boolean;
  eventTitle: string;
}

export function RSVPModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  eventTitle,
}: RSVPModalProps) {
  const [formData, setFormData] = useState({
    attendeeFullName: "",
    attendeeEmail: "",
    attendeePhone: "",
  });

  const [errors, setErrors] = useState<{
    attendeeFullName?: string;
    attendeeEmail?: string;
    attendeePhone?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.attendeeFullName.trim()) {
      newErrors.attendeeFullName = "Full name is required";
    }

    if (!formData.attendeeEmail.trim()) {
      newErrors.attendeeEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.attendeeEmail)) {
      newErrors.attendeeEmail = "Please enter a valid email";
    }

    if (!formData.attendeePhone.trim()) {
      newErrors.attendeePhone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                RSVP for Free Event
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {eventTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={formData.attendeeFullName}
                  onChange={(e) => handleChange("attendeeFullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={`pl-10 text-gray-900 ${errors.attendeeFullName ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.attendeeFullName && (
                <p className="text-red-500 text-xs mt-1">{errors.attendeeFullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  value={formData.attendeeEmail}
                  onChange={(e) => handleChange("attendeeEmail", e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 text-gray-900 ${errors.attendeeEmail ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.attendeeEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.attendeeEmail}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="tel"
                  value={formData.attendeePhone}
                  onChange={(e) => handleChange("attendeePhone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`pl-10 text-gray-900 ${errors.attendeePhone ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.attendeePhone && (
                <p className="text-red-500 text-xs mt-1">{errors.attendeePhone}</p>
              )}
            </div>

            {/* Info Text */}
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-xs text-green-700">
                This information will be used for your free ticket. You'll receive a confirmation with your QR code.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 text-gray-900 border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Confirming...
                  </>
                ) : (
                  "Confirm RSVP"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
