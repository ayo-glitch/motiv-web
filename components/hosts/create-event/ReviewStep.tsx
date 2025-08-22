"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventFormData } from "@/hooks/useEventCreation";
import { Event } from "@/lib/types/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Plus,
  Minus,
  Star,
  Share2,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PublishSuccessModal } from "./PublishSuccessModal";

interface ReviewStepProps {
  formData: EventFormData;
  onBack: () => void;
  onSave?: () => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
  event?: Event | null;
}

export function ReviewStep({ formData, onBack, onSave, isLoading = false, isEdit = false, event }: ReviewStepProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});

  const handlePublish = async () => {
    console.log("ReviewStep handlePublish called, onSave exists:", !!onSave);
    if (onSave) {
      try {
        console.log("Calling onSave...");
        await onSave();
        console.log("onSave completed successfully");
        if (!isEdit) {
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error("Failed to publish/save event:", error);
      }
    } else {
      console.error("onSave function not provided");
    }
  };

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + change),
    }));
  };

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce(
      (total, [ticketId, quantity]) => {
        const ticket = formData.ticketTypes.find((t: any) => t.id === ticketId);
        return total + (ticket ? ticket.price * quantity : 0);
      },
      0
    );
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Review</h1>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">Nearly there! Check everything's correct.</p>

          {/* Detailed Event Preview - Like Event Page */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#0D0D0D] text-white">
            {/* Hero Section */}
            <div className="relative h-[40vh] overflow-hidden">
              {(formData.bannerImage || formData.bannerImageURL) ? (
                <Image
                  src={formData.bannerImage ? URL.createObjectURL(formData.bannerImage) : formData.bannerImageURL!}
                  alt="Event banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-300">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Event Banner Preview</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Event Title Overlay */}
              <div className="absolute bottom-6 left-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {formData.title || "Your Rave Title"}
                </h1>
              </div>

              {/* Action buttons overlay */}
              <div className="absolute top-6 right-6 flex gap-3">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black rounded-full w-10 h-10"
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black rounded-full w-10 h-10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Info Section */}
            <div className="bg-[#0D0D0D] border-b border-gray-800">
              <div className="p-4 sm:p-6">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Left side - Date and Time + Location */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Date and Time */}
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Date and Time
                      </h2>
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span>{formatDate(formData.startDate) || "Event Date"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <Clock className="h-5 w-5" />
                        <span>
                          {formData.startTime ? formatTime(formData.startTime) : "Start Time"}
                          {formData.endTime && ` - ${formatTime(formData.endTime)}`}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="text-[#D72638] border-[#D72638] hover:bg-[#D72638] hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>

                    {/* Location */}
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Location
                      </h2>
                      <div className="flex items-start gap-2 text-gray-300 mb-4">
                        <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <span>{formData.location?.address || "Event Location"}</span>
                          {formData.location?.coordinates && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.location.coordinates.lat.toFixed(6)}, {formData.location.coordinates.lng.toFixed(6)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mock Map */}
                      <div className="rounded-lg h-32 sm:h-48 bg-gray-700 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                          <p className="text-sm sm:text-base">Map Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Ticket Selection */}
                  <div className="lg:sticky lg:top-4">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-[#333] rounded-lg p-4 sm:p-6">
                      <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
                        Select Tickets
                      </h3>

                      {formData.eventType === "free" ? (
                        <div className="text-center py-6 sm:py-8">
                          <Ticket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-green-500" />
                          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Free Event</h4>
                          <p className="text-gray-400 text-xs sm:text-sm mb-4">No tickets required</p>
                          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 sm:py-3 text-sm sm:text-base">
                            Register for Free
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Ticket Types */}
                          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            {formData.ticketTypes.map((ticket: any) => (
                              <div
                                key={ticket.id}
                                className="border border-gray-600 rounded-lg p-3 sm:p-4"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold text-sm sm:text-base truncate">
                                      {ticket.name || "Ticket Name"}
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                                      {ticket.description || "Ticket description"}
                                    </p>
                                    <p className="text-[#D72638] font-bold text-sm sm:text-base mt-1">
                                      ₦{ticket.price.toLocaleString()}
                                    </p>
                                    {isEdit && ticket.totalQuantity !== undefined && (
                                      <div className="mt-2 text-xs text-gray-400">
                                        <div className="flex items-center gap-4">
                                          <span>Total: {ticket.totalQuantity}</span>
                                          <span>Sold: {ticket.soldQuantity || 0}</span>
                                          <span className="text-green-400">
                                            Remaining: {(ticket.totalQuantity || 0) - (ticket.soldQuantity || 0)}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                                    <button
                                      className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-600 rounded bg-transparent hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                                      onClick={() => updateTicketQuantity(ticket.id, -1)}
                                      disabled={!selectedTickets[ticket.id]}
                                    >
                                      <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </button>
                                    <span className="w-8 sm:w-10 text-center text-white font-semibold text-sm sm:text-base">
                                      {selectedTickets[ticket.id] || 0}
                                    </span>
                                    <button
                                      className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-600 rounded bg-transparent hover:bg-gray-700 text-white flex items-center justify-center transition-colors touch-manipulation"
                                      onClick={() => updateTicketQuantity(ticket.id, 1)}
                                    >
                                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total and Buy Button */}
                          {getTotalTickets() > 0 && (
                            <div className="border-t border-gray-600 pt-3 sm:pt-4 mb-3 sm:mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300 text-sm sm:text-base">Total Tickets:</span>
                                <span className="text-white font-semibold text-sm sm:text-base">
                                  {getTotalTickets()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <span className="text-gray-300 text-sm sm:text-base">Total Price:</span>
                                <span className="text-[#D72638] font-bold text-base sm:text-lg">
                                  ₦{getTotalPrice().toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}

                          <Button
                            className="w-full bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation"
                            disabled={getTotalTickets() === 0}
                          >
                            {getTotalTickets() > 0
                              ? `Buy ${getTotalTickets()} Ticket${
                                  getTotalTickets() > 1 ? "s" : ""
                                }`
                              : "Select Tickets"}
                          </Button>

                          <p className="text-xs text-gray-400 text-center mt-2 sm:mt-3">
                            Secure payment • Instant confirmation
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Host and Description Section */}
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Host Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Hosted by</h2>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      H
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#D72638] rounded-full p-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-white truncate">
                      Host Name
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-[#D72638] text-white text-xs px-2 py-1 mt-1"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                  Rave Description
                </h2>
                <div className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {formData.description ? (
                    formData.description.split("\n").map((paragraph: string, index: number) => (
                      <p key={index} className="mb-3 sm:mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>Your event description will appear here...</p>
                  )}
                </div>

                {/* Tags Display */}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                      Event Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tagId: string) => {
                        // Mock tag data for display - in real app, you'd fetch this
                        const tagNames: { [key: string]: string } = {
                          'afrobeats': 'Afrobeats',
                          'hip-hop': 'Hip Hop',
                          'dancehall': 'Dancehall',
                          'amapiano': 'Amapiano',
                          'reggae': 'Reggae',
                          'electronic': 'Electronic',
                          'r&b': 'R&B',
                          'gospel': 'Gospel',
                          'highlife': 'Highlife',
                          'fuji': 'Fuji',
                          'outdoor': 'Outdoor',
                          'indoor': 'Indoor',
                          'rooftop': 'Rooftop',
                          'club': 'Club',
                          'festival': 'Festival',
                          'concert': 'Concert',
                          'party': 'Party',
                          'networking': 'Networking',
                          'vip': 'VIP Experience',
                          'all-ages': 'All Ages'
                        };
                        
                        return (
                          <span
                            key={tagId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D72638]/20 text-[#D72638] border border-[#D72638]/30"
                          >
                            {tagNames[tagId] || tagId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-6"
            >
              Go back
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEdit ? "Saving..." : "Publishing..."}
                </>
              ) : (
                isEdit ? "Save Changes" : "Publish Rave"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        eventTitle={formData.title}
        eventId={event?.id}
      />
    </>
  );
}