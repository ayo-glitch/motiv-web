"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Facebook, Twitter, MessageCircle, Linkedin } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  title?: string;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  shareUrl = "https://motiv.com/event/sample-event", 
  title = "Check out this amazing event!" 
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank');
      }
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share with friends</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Social Media Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.name}
                  onClick={option.onClick}
                  className={`${option.color} text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <IconComponent size={18} />
                  <span className="text-sm font-medium">{option.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300">Copy Link</p>
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-800 border-gray-600 text-white text-sm"
              />
              <Button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <span className="text-sm">Copied!</span>
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}