"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Share2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventId?: string;
}

export function PublishSuccessModal({ isOpen, onClose, eventTitle, eventId }: PublishSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewMyRaves = () => {
    router.push("/hosts/raves");
  };

  const handleViewEvent = () => {
    if (eventId) {
      router.push(`/event/${eventId}`);
    }
  };

  const handleShareEvent = () => {
    if (eventId) {
      const eventUrl = `${window.location.origin}/event/${eventId}`;
      navigator.clipboard.writeText(eventUrl);
      // You could show a toast notification here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rave Published Successfully! 🎉
        </h2>
        
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">"{eventTitle || "Your Rave"}"</span> is now live and ready for ravers!
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Your event is now visible to the public and people can start buying tickets.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleViewMyRaves}
            className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3 text-base font-semibold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View My Raves
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleViewEvent}
              variant="outline"
              className="py-2.5 text-sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview Event
            </Button>
            
            <Button
              onClick={handleShareEvent}
              variant="outline"
              className="py-2.5 text-sm"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share Event
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm">💡 Next Steps:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Share your event on social media</li>
            <li>• Monitor ticket sales in your dashboard</li>
            <li>• Engage with attendees through reviews</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}