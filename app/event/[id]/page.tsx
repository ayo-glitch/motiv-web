"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  Share2,
  Star,
  Plus,
  Minus,
  Loader2,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { RSVPModal } from "@/components/modals/RSVPModal";
import AddReviewModal from "@/components/AddReviewModal";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  useEvent,
  useEvents,
  useIsInWishlist,
  useWishlistMutations,
  useEventReviewsNew,
  useReviewMutationsNew,
} from "@/lib/hooks";
import { useRSVPFreeEvent } from "@/lib/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils/dateUtils";

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { user } = useAuth();

  // Fetch event data from API
  const { data: eventData, isLoading, error } = useEvent(eventId);

  // Fetch other events for recommendations
  const { data: otherEventsData } = useEvents();
  const otherEvents =
    otherEventsData?.pages.flatMap((page) =>
      Array.isArray(page) ? page.slice(0, 3) : page.data?.slice(0, 3) || []
    ) || [];

  // Wishlist functionality - use the actual event ID from the fetched data
  // Prioritize the lowercase 'id' field which should contain the UUID
  const actualEventId = eventData ? (eventData as any).id : eventId;
  

  
  // Only enable wishlist queries if we have a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = actualEventId && uuidRegex.test(actualEventId);
  
  const { data: isInWishlist = false } = useIsInWishlist(isValidUUID ? actualEventId : '');
  const { toggleWishlist, isTogglingWishlist } = useWishlistMutations();

  // Reviews functionality
  const { data: reviewsData, isLoading: reviewsLoading } = useEventReviewsNew(actualEventId);
  const { createReview, isCreating } = useReviewMutationsNew();
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTicketPurchase, setPendingTicketPurchase] = useState(false);
  const [pendingRSVP, setPendingRSVP] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);

  // RSVP functionality for free events
  const { mutate: rsvpFreeEvent, isPending: isRSVPing } = useRSVPFreeEvent(() => {
    setShowRSVPModal(false);
  });

  // Helper functions for ticket availability
  const isTicketAvailable = (ticket: any) =>
    ticket.soldQuantity < ticket.totalQuantity;
  const getRemainingTickets = (ticket: any) =>
    ticket.totalQuantity - ticket.soldQuantity;
  const getMaxSelectableQuantity = (ticket: any) =>
    Math.min(getRemainingTickets(ticket), 10); // Max 10 per order

  const updateTicketQuantity = (ticketId: string, change: number) => {
    const ticket = event.ticketTypes.find(
      (t: any) => (t.id || t.ID) === ticketId
    );
    if (!ticket) return;

    const ticketData = {
      id: ticket.id || ticket.ID,
      soldQuantity: ticket.sold_quantity || ticket.SoldQuantity || 0,
      totalQuantity: ticket.total_quantity || ticket.TotalQuantity || 100,
    };

    if (!isTicketAvailable(ticketData)) return;

    const currentQuantity = selectedTickets[ticketId] || 0;
    const maxQuantity = getMaxSelectableQuantity(ticketData);
    const newQuantity = Math.max(
      0,
      Math.min(maxQuantity, currentQuantity + change)
    );

    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: newQuantity,
    }));
  };

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce(
      (total, [ticketId, quantity]) => {
        const ticket = event.ticketTypes.find(
          (t: any) => (t.id || t.ID) === ticketId
        );
        const price = ticket ? ticket.price || ticket.Price || 0 : 0;
        return total + price * quantity;
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

  const getSelectedTicketDetails = () => {
    return Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => {
        const ticket = event.ticketTypes.find(
          (t: any) => (t.id || t.ID) === ticketId
        );
        return {
          ticketTypeId: ticket?.id || ticket?.ID || '',
          ticketTypeName: ticket?.name || ticket?.Name || '',
          quantity,
          price: ticket?.price || ticket?.Price || 0,
        };
      })
      .filter(item => item.ticketTypeId !== '');
  };

  const handleBuyTickets = () => {
    if (!user) {
      // Store the intention to purchase tickets and show auth modal
      setPendingTicketPurchase(true);
      setShowAuthModal(true);
      return;
    }
    
    if (getTotalTickets() > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleAuthSuccess = () => {
    // User has successfully authenticated
    if (pendingTicketPurchase && getTotalTickets() > 0) {
      // Continue with the ticket purchase they were trying to make
      setShowPaymentModal(true);
      setPendingTicketPurchase(false);
    } else if (pendingRSVP) {
      // Continue with the RSVP they were trying to make
      setShowRSVPModal(true);
      setPendingRSVP(false);
    } else if (pendingReview) {
      // Continue with the review they were trying to add
      setShowReviewModal(true);
      setPendingReview(false);
    }
  };

  const handleRSVPClick = () => {
    if (!user) {
      // Store the intention to RSVP and show auth modal
      setPendingRSVP(true);
      setShowAuthModal(true);
      return;
    }
    setShowRSVPModal(true);
  };

  const handleReviewClick = () => {
    if (!user) {
      // Store the intention to add a review and show auth modal
      setPendingReview(true);
      setShowAuthModal(true);
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (review: { rating: number; comment?: string }) => {
    if (!user) {
      toast.error('Please sign in to submit a review');
      return;
    }

    if (!isValidUUID) {
      toast.error('Invalid event ID');
      return;
    }

    createReview({
      eventId: actualEventId,
      rating: review.rating,
      comment: review.comment || ''
    });
    
    setShowReviewModal(false);
  };

  const handleRSVPSubmit = (rsvpData: {
    attendeeFullName: string;
    attendeeEmail: string;
    attendeePhone: string;
  }) => {
    if (!actualEventId) {
      toast.error('Invalid event ID');
      return;
    }

    rsvpFreeEvent({
      eventId: actualEventId,
      ...rsvpData,
    });
    
    // Modal will be closed by the success handler in useRSVPFreeEvent
  };

  const handleWishlistToggle = () => {
    if (!user) {
      alert("Please sign in to add events to your wishlist");
      return;
    }
    

    if (!isValidUUID) {
      console.error('Invalid UUID format:', actualEventId);
      toast.error('Invalid event ID format. Please try refreshing the page.');
      return;
    }
    
    toggleWishlist(actualEventId, isInWishlist);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#D72638]" />
            <p className="text-gray-400">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load event details</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data to match component expectations
  const eventDataAny = eventData as any;
  const event = {
    id: eventDataAny.id || eventDataAny.ID,
    title: eventDataAny.title || eventDataAny.Title,
    image:
      eventDataAny.banner_image_url ||
      eventDataAny.BannerImageURL ||
      eventDataAny.bannerImageURL ||
      "https://res.cloudinary.com/dkuphcizs/image/upload/v1753716184/christian-agbede-MCEIUEsj918-unsplash_sbeu82.png",
    date: new Date(
      eventDataAny.start_date ||
        eventDataAny.StartDate ||
        eventDataAny.startDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: `${
      eventDataAny.start_time ||
      eventDataAny.StartTime ||
      eventDataAny.startTime
    } - ${
      eventDataAny.end_time || eventDataAny.EndTime || eventDataAny.endTime
    }`,
    location: eventDataAny.location || eventDataAny.Location,
    fullAddress: eventDataAny.location || eventDataAny.Location,
    coordinates: (eventDataAny.latitude && eventDataAny.longitude) ? {
                  lat: eventDataAny.latitude,
                  lng: eventDataAny.longitude
                } : (eventDataAny.Latitude && eventDataAny.Longitude) ? {
                  lat: eventDataAny.Latitude,
                  lng: eventDataAny.Longitude
                } : eventDataAny.locationData?.coordinates || 
                    eventDataAny.coordinates || 
                    null, // No fallback coordinates - let the UI handle missing coordinates
    host: {
      name:
        eventDataAny.host?.name ||
        eventDataAny.Host?.Name ||
        eventDataAny.host?.Name ||
        "Event Host",
      image:
        eventDataAny.host?.avatar ||
        eventDataAny.Host?.Avatar ||
        eventDataAny.host?.Avatar ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    description:
      eventDataAny.description ||
      eventDataAny.Description ||
      "Join us for an amazing event!",
    manual_description:
      eventDataAny.manual_description ||
      eventDataAny.ManualDescription ||
      eventDataAny.manual_Description ||
      null,
    event_type: eventDataAny.event_type || eventDataAny.EventType || "ticketed",
    ticketTypes: eventDataAny.ticket_types || eventDataAny.TicketTypes || [],
  };

  // Get reviews from API
  const reviews = reviewsData?.reviews || [];
  const reviewStats = reviewsData?.stats;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Event Title Overlay */}
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {event.title}
          </h1>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute top-6 right-6 flex gap-3">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full w-12 h-12 transition-all duration-300 ${
              isInWishlist 
                ? "bg-red-100 hover:bg-red-200 text-red-600 border-red-200" 
                : "bg-white/90 hover:bg-white text-black"
            }`}
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isInWishlist ? "fill-red-500 text-red-500 scale-110" : ""
              }`}
            />
            {isTogglingWishlist && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-black rounded-full w-12 h-12"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Event Info Section - Right under the image */}
      <div className="bg-[#0D0D0D] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left side - Date and Time + Location */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date and Time */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Date and Time
                </h2>
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>{event.time}</span>
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
                    <span className="leading-relaxed">{event.location}</span>
                    {event.manual_description && (
                      <div className="mt-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {event.manual_description
                            .split("\n")
                            .map((paragraph: string, index: number) => (
                              <span key={index}>
                                {paragraph}
                                {index < event.manual_description!.split("\n").length - 1 && <br />}
                              </span>
                            ))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Check if we have valid coordinates for map display */}
                {event.coordinates && 
                 event.coordinates.lat && 
                 event.coordinates.lng && 
                 event.coordinates.lat !== 6.4281 && // Not default fallback coordinates
                 event.coordinates.lng !== 3.4219 ? (
                  <>
                    {/* Real Google Map */}
                    <div className="rounded-lg h-64 overflow-hidden mb-4">
                      <iframe
                        src={`https://maps.google.com/maps?q=${event.coordinates.lat},${event.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Event Location Map"
                      />
                    </div>
                    {/* Search on Google Maps button */}
                    <Button
                      variant="outline"
                      className="text-[#D72638] border-[#D72638] hover:bg-[#D72638] hover:text-white"
                      onClick={() => {
                        const searchQuery = encodeURIComponent(event.location);
                        window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Open in Google Maps
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Manual address - no map coordinates */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-gray-300 text-sm mb-2">
                        📍 Manual address provided by event host
                      </p>
                      <p className="text-gray-400 text-xs">
                        Map coordinates not available for this location
                      </p>
                    </div>
                    {/* Search on Google Maps button */}
                    <Button
                      variant="outline"
                      className="text-[#D72638] border-[#D72638] hover:bg-[#D72638] hover:text-white"
                      onClick={() => {
                        const searchQuery = encodeURIComponent(event.location);
                        window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Search on Google Maps
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right side - Ticket Selection */}
            <div>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-[#333] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">
                  {event.event_type === "free" ? "Free Event" : "Select Tickets"}
                </h3>

                {/* Ticket Types */}
                <div className="space-y-4 mb-6">
                  {/* Check if event is free */}
                  {event.event_type === "free" ? (
                    <div className="border border-green-600 rounded-lg p-6 bg-green-50">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-2xl font-bold text-green-600">FREE</span>
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            NO COST
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Free Entry
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          This is a free event - no payment required!
                        </p>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white px-8"
                          onClick={handleRSVPClick}
                        >
                          RSVP for Free
                        </Button>
                      </div>
                    </div>
                  ) : event.ticketTypes && event.ticketTypes.length > 0 ? (
                    event.ticketTypes.map((ticket: any) => {
                      const ticketData = {
                        id: ticket.id || ticket.ID,
                        name: ticket.name || ticket.Name,
                        price: ticket.price || ticket.Price,
                        description:
                          ticket.description ||
                          ticket.Description ||
                          "Event ticket",
                        totalQuantity:
                          ticket.total_quantity || ticket.TotalQuantity || 100,
                        soldQuantity:
                          ticket.sold_quantity || ticket.SoldQuantity || 0,
                      };
                      const isSoldOut = !isTicketAvailable(ticketData);
                      const remaining = getRemainingTickets(ticketData);
                      const isLowStock = remaining <= 10 && remaining > 0;

                      return (
                        <div
                          key={ticketData.id}
                          className={`border rounded-lg p-4 ${
                            isSoldOut
                              ? "border-gray-700 bg-gray-800/50"
                              : "border-gray-600"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-semibold ${
                                    isSoldOut ? "text-gray-500" : "text-white"
                                  }`}
                                >
                                  {ticketData.name}
                                </h4>
                                {isSoldOut && (
                                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                    SOLD OUT
                                  </span>
                                )}
                                {isLowStock && (
                                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                    Only {remaining} left!
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-sm mb-1 ${
                                  isSoldOut ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {ticketData.description}
                              </p>
                              <p
                                className={`font-bold ${
                                  isSoldOut ? "text-gray-500" : "text-[#D72638]"
                                }`}
                              >
                                ₦{ticketData.price.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {ticketData.soldQuantity} of{" "}
                                {ticketData.totalQuantity} sold
                              </p>
                            </div>

                            {!isSoldOut && (
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-8 h-8 border border-gray-600 rounded bg-transparent hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  onClick={() =>
                                    updateTicketQuantity(ticketData.id, -1)
                                  }
                                  disabled={!selectedTickets[ticketData.id]}
                                >
                                  <Minus className="h-4 w-4 text-white" />
                                </button>
                                <span className="w-8 text-center text-white font-semibold">
                                  {selectedTickets[ticketData.id] || 0}
                                </span>
                                <button
                                  className="w-8 h-8 border border-gray-600 rounded bg-transparent hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  onClick={() =>
                                    updateTicketQuantity(ticketData.id, 1)
                                  }
                                  disabled={
                                    selectedTickets[ticketData.id] >=
                                    getMaxSelectableQuantity(ticketData)
                                  }
                                >
                                  <Plus className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            )}

                            {isSoldOut && (
                              <div className="text-gray-500 text-sm font-medium">
                                Unavailable
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        No tickets available for this event
                      </p>
                    </div>
                  )}
                </div>

                {/* Total and Buy Button - Only show for ticketed events */}
                {event.event_type !== "free" && getTotalTickets() > 0 && (
                  <div className="border-t border-gray-600 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Total Tickets:</span>
                      <span className="text-white font-semibold">
                        {getTotalTickets()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300">Total Price:</span>
                      <span className="text-[#D72638] font-bold text-lg">
                        ₦{getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buy Button - Only show for ticketed events */}
                {event.event_type !== "free" && (
                  <>
                    <Button
                      className="w-full bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300 hover:scale-105"
                      disabled={getTotalTickets() === 0}
                      onClick={handleBuyTickets}
                    >
                      {getTotalTickets() > 0
                        ? `Buy ${getTotalTickets()} Ticket${
                            getTotalTickets() > 1 ? "s" : ""
                          }`
                        : "Select Tickets"}
                    </Button>

                    <p className="text-xs text-gray-400 text-center mt-3">
                      Secure payment • Instant confirmation
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          {/* Host Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Hosted by</h2>
            <div className="flex items-center gap-4">
              {/* <div className="relative">
                <Image
                  src={event.host.image}
                  alt={event.host.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#D72638] rounded-full p-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div> */}
              <div>
                <h4 className="font-semibold text-lg text-white">
                  {event.host.name}
                </h4>
                {/* <Badge
                  variant="secondary"
                  className="bg-[#D72638] text-white text-xs px-2 py-1"
                >
                  Verified
                </Badge> */}
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Rave Description
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              {event.description
                .split("\n")
                .map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Reviews</h2>
                {reviewStats && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">
                        {reviewStats.average_rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-400">
                        ({reviewStats.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-4 py-2 rounded-lg"
                onClick={handleReviewClick}
              >
                Add Review
              </Button>
            </div>

            <div className="border border-gray-600 border-opacity-50 rounded-lg p-6">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D72638] mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any, index: number) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white">
                          {review.user?.name || 'Anonymous User'}
                        </h4>
                        <span className="text-gray-400 text-sm">
                          {formatRelativeTime(review)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                          <span className="text-white font-semibold ml-2">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      {index < reviews.length - 1 && (
                        <hr className="border-gray-700" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No reviews yet</p>
                  <p className="text-gray-500 text-sm">
                    Be the first to review this event!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Events Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Other Events you may like
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEvents.map((otherEvent: any, index: number) => {
              const eventDate = new Date(
                otherEvent.start_date ||
                  otherEvent.StartDate ||
                  otherEvent.startDate
              );
              

              
              return (
                <EventCard
                  key={index}
                  id={otherEvent.id || otherEvent.ID}
                  image={
                    otherEvent.banner_image_url ||
                    otherEvent.BannerImageURL ||
                    "https://res.cloudinary.com/dkuphcizs/image/upload/v1753716184/frankie-cordoba-SvWTcA5D4Uk-unsplash_eboztl.png"
                  }
                  title={otherEvent.title || otherEvent.Title}
                  location={otherEvent.location || otherEvent.Location}
                  time={`${otherEvent.start_time || otherEvent.StartTime} - ${
                    otherEvent.end_time || otherEvent.EndTime
                  }`}
                  month={eventDate
                    .toLocaleDateString("en-US", { month: "short" })
                    .toUpperCase()}
                  day={eventDate.getDate().toString().padStart(2, "0")}
                  price={
                    otherEvent.event_type === "free" ? "Free" : "From ₦500"
                  }
                  tags={otherEvent.tags || otherEvent.Tags || []}
                  showTags={true}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal Components */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        event={{
          id: event.id,
          title: event.title,
          start_date: eventDataAny.start_date || eventDataAny.StartDate || eventDataAny.startDate,
          start_time: eventDataAny.start_time || eventDataAny.StartTime || eventDataAny.startTime,
          end_time: eventDataAny.end_time || eventDataAny.EndTime || eventDataAny.endTime,
          location: event.location,
          banner_image_url: event.image,
        }}
        selectedTickets={getSelectedTicketDetails()}
        userEmail={user?.email || user?.Email || ''}
      />

      <AddReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />

      <RSVPModal
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        onSubmit={handleRSVPSubmit}
        isLoading={isRSVPing}
        eventTitle={event.title}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingTicketPurchase(false);
          setPendingRSVP(false);
          setPendingReview(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
