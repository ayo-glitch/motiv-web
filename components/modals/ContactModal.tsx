"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, MessageSquare, Instagram } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Contact US</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#D72638]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-medium">+234 800 000 0000</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#D72638]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">support@motiv.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-[#D72638]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Chat</p>
                <p className="text-white font-medium">Live Chat Available</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Instagram className="h-5 w-5 text-[#D72638]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Instagram</p>
                <p className="text-white font-medium">@motiv_events</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}