"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const handleEmailClick = () => {
    window.open('mailto:support@motiv.com', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+2341234567890', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Contact Us</DialogTitle>
          <DialogDescription className="text-gray-600">
            Get in touch with our team for support or inquiries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <Mail className="w-5 h-5 text-[#D72638]" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Email Support</div>
                <div className="text-sm text-gray-600">support@motiv.com</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#D72638]" />
            </button>

            <button
              onClick={handlePhoneClick}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <Phone className="w-5 h-5 text-[#D72638]" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Phone Support</div>
                <div className="text-sm text-gray-600">+234 (0) 123 456 7890</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#D72638]" />
            </button>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-[#D72638]" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Location</div>
                <div className="text-sm text-gray-600">Lagos, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}