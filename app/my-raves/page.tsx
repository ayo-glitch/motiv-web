"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { TicketCard } from "@/components/tickets/TicketCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Ticket,
  TrendingUp,
  Clock,
  Download,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { generateTicketPDF } from "@/lib/utils/pdfGenerator";
import QRCode from "qrcode";

interface TicketData {
  id: string;
  event: {
    id: string;
    title: string;
    start_date: string;
    start_time: string;
    end_time: string;
    location: string;
    banner_image_url?: string;
    manual_description?: string;
  };
  ticketType: {
    id: string;
    name: string;
    price: number;
  };
  qrCode: string;
  attendeeData: {
    fullName: string;
    email: string;
    phone: string;
  };
  purchasedAt: string;
  quantity: number;
}

export default function MyRavesPage() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyTickets();
    }
  }, [isAuthenticated, user]);

  const fetchMyTickets = async () => {
    try {
      const response = await apiClient.get<any[]>("/users/me/tickets");
      console.log("Tickets response:", response); // Debug log

      // Handle different response formats
      const rawTickets = response || [];

      // Transform backend data to frontend format
      const transformedTickets = Array.isArray(rawTickets)
        ? rawTickets.map((ticket: any) => {
            // More robust event data extraction
            const eventData = ticket.Event || ticket.event || {};
            const ticketTypeData =
              ticket.TicketType || ticket.ticket_type || {};

            // Log for debugging
            console.log("Processing ticket:", {
              ticketId: ticket.id || ticket.ID,
              eventId: ticket.event_id || ticket.EventID,
              eventData: eventData,
              hasEventTitle: !!eventData.title || !!eventData.Title,
            });

            return {
              id: ticket.id || ticket.ID,
              event: {
                id:
                  eventData.id ||
                  eventData.ID ||
                  ticket.event_id ||
                  ticket.EventID ||
                  "unknown",
                title: eventData.title || eventData.Title || "Unknown Event",
                start_date:
                  eventData.start_date ||
                  eventData.StartDate ||
                  eventData.start_date ||
                  new Date().toISOString(),
                start_time:
                  eventData.start_time || eventData.StartTime || "00:00",
                end_time: eventData.end_time || eventData.EndTime || "23:59",
                location: eventData.location || eventData.Location || "TBD",
                banner_image_url:
                  eventData.banner_image_url || eventData.BannerImageURL || "",
                manual_description:
                  eventData.manual_description ||
                  eventData.ManualDescription ||
                  eventData.manual_Description ||
                  null,
              },
              ticketType: {
                id:
                  ticketTypeData.id ||
                  ticketTypeData.ID ||
                  ticket.ticket_type_id ||
                  ticket.TicketTypeID ||
                  "unknown",
                name:
                  ticketTypeData.name ||
                  ticketTypeData.Name ||
                  "General Admission",
                price: ticketTypeData.price || ticketTypeData.Price || 0,
              },
              qrCode: ticket.qr_code || ticket.QRCode || "",
              attendeeData: {
                fullName:
                  ticket.attendee_full_name ||
                  ticket.AttendeeFullName ||
                  "Unknown",
                email: ticket.attendee_email || ticket.AttendeeEmail || "",
                phone: ticket.attendee_phone || ticket.AttendeePhone || "",
              },
              purchasedAt:
                ticket.created_at ||
                ticket.CreatedAt ||
                new Date().toISOString(),
              quantity: ticket.quantity || ticket.Quantity || 1,
            };
          })
        : [];

      setTickets(
        transformedTickets.sort(
          (a, b) =>
            new Date(b.purchasedAt).getTime() -
            new Date(a.purchasedAt).getTime()
        )
      );
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load your tickets");
      setTickets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2 text-white">
                Sign In Required
              </h2>
              <p className="text-gray-400">
                Please sign in to view your tickets and events.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your raves...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Separate tickets into upcoming and past events, sorted by most recent
  const now = new Date();
  const safeTickets = tickets || []; // Ensure tickets is always an array

  // Sort tickets by start date (most recent first for past, nearest first for upcoming)
  const upcomingTickets = safeTickets
    .filter((ticket) => new Date(ticket.event.start_date) >= now)
    .sort(
      (a, b) =>
        new Date(a.event.start_date).getTime() -
        new Date(b.event.start_date).getTime()
    ); // Nearest upcoming first

  const pastTickets = safeTickets
    .filter((ticket) => new Date(ticket.event.start_date) < now)
    .sort(
      (a, b) =>
        new Date(b.event.start_date).getTime() -
        new Date(a.event.start_date).getTime()
    ); // Most recent past first

  // Calculate stats
  const totalEvents = safeTickets.length;
  const totalSpent = safeTickets.reduce(
    (sum, ticket) => sum + ticket.ticketType.price * ticket.quantity,
    0
  );
  const upcomingEvents = upcomingTickets.length;

  // Bulk download function
  const downloadAllTickets = async (
    ticketList: TicketData[],
    type: "upcoming" | "past"
  ) => {
    if (ticketList.length === 0) {
      toast.error(`No ${type} tickets to download`);
      return;
    }

    try {
      setDownloadingAll(true);
      toast.info(`Generating PDFs for ${ticketList.length} ticket(s)...`);

      // Generate QR codes for all tickets
      const qrCodePromises = ticketList.map((ticket) =>
        QRCode.toDataURL(ticket.qrCode, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
      );

      const qrCodeUrls = await Promise.all(qrCodePromises);

      // Generate PDFs for each ticket
      for (let i = 0; i < ticketList.length; i++) {
        await generateTicketPDF(ticketList[i], qrCodeUrls[i]);
        // Small delay to prevent browser from getting overwhelmed
        if (i < ticketList.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      toast.success(`Successfully downloaded ${ticketList.length} ticket(s)`);
    } catch (error) {
      console.error("Error downloading tickets:", error);
      toast.error("Failed to download tickets. Please try again.");
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Raves</h1>
            <p className="text-sm sm:text-base text-gray-400">
              Manage your event tickets and experiences
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400">
                      Total Events
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {totalEvents}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#D72638]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400">
                      Total Spent
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      ₦{totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400">
                      Upcoming Events
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {upcomingEvents}
                    </p>
                  </div>
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-[#1a1a1a] border-gray-800 h-auto p-1">
              <TabsTrigger
                value="upcoming"
                className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-[#D72638] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Up</span>
                <span className="ml-0.5 sm:ml-1">({upcomingEvents})</span>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-[#D72638] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Past Events</span>
                <span className="sm:hidden">Past</span>
                <span className="ml-0.5 sm:ml-1">({pastTickets.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingTickets.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Your Upcoming Events ({upcomingTickets.length})
                    </h3>
                    <Button
                      onClick={() =>
                        downloadAllTickets(upcomingTickets, "upcoming")
                      }
                      disabled={downloadingAll}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-[#D72638] text-white border-[#D72638] hover:bg-[#B91E2F] text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center"
                    >
                      {downloadingAll ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {downloadingAll ? "Downloading..." : "Download All PDFs"}
                      </span>
                      <span className="sm:hidden">
                        {downloadingAll ? "Downloading..." : "Download PDFs"}
                      </span>
                    </Button>
                  </div>
                  {upcomingTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </>
              ) : (
                <Card className="bg-[#1a1a1a] border-gray-800">
                  <CardContent className="p-6 sm:p-12 text-center">
                    <Ticket className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      No Upcoming Events
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-4">
                      You don't have any upcoming events. Discover amazing
                      events happening near you!
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center px-4 py-2 bg-[#D72638] text-white rounded-lg hover:bg-[#B91E2F] transition-colors text-sm sm:text-base"
                    >
                      Explore Events
                    </a>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastTickets.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Your Past Events ({pastTickets.length})
                    </h3>
                    <Button
                      onClick={() => downloadAllTickets(pastTickets, "past")}
                      disabled={downloadingAll}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-[#D72638] text-white border-[#D72638] hover:bg-[#B91E2F] text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center"
                    >
                      {downloadingAll ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {downloadingAll ? "Downloading..." : "Download All PDFs"}
                      </span>
                      <span className="sm:hidden">
                        {downloadingAll ? "Downloading..." : "Download PDFs"}
                      </span>
                    </Button>
                  </div>
                  {pastTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </>
              ) : (
                <Card className="bg-[#1a1a1a] border-gray-800">
                  <CardContent className="p-6 sm:p-12 text-center">
                    <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      No Past Events
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">
                      Your event history will appear here once you attend some
                      events.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
