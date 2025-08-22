"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Download, 
  QrCode, 
  Loader2, 
  ArrowLeft,
  Clock,
  Ticket as TicketIcon
} from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode";
import { generateTicketPDF } from "@/lib/utils/pdfGenerator";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

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

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && params.id) {
      fetchTicket();
    }
  }, [isAuthenticated, user, params.id]);

  useEffect(() => {
    if (ticket?.qrCode) {
      // Generate QR code image
      QRCode.toDataURL(ticket.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then((url: string) => setQrCodeUrl(url))
      .catch((err: any) => console.error('Error generating QR code:', err));
    }
  }, [ticket?.qrCode]);

  const fetchTicket = async () => {
    try {
      const response = await apiClient.get<any>(`/users/me/tickets/${params.id}`);
      console.log("Ticket response:", response);

      if (response) {
        // Transform backend data to frontend format
        const rawTicket = response;
        const eventData = rawTicket.Event || rawTicket.event || {};
        const ticketTypeData = rawTicket.TicketType || rawTicket.ticket_type || {};

        const transformedTicket: TicketData = {
          id: rawTicket.id || rawTicket.ID,
          event: {
            id: eventData.id || eventData.ID || rawTicket.event_id || rawTicket.EventID || "unknown",
            title: eventData.title || eventData.Title || "Unknown Event",
            start_date: eventData.start_date || eventData.StartDate || eventData.start_date || new Date().toISOString(),
            start_time: eventData.start_time || eventData.StartTime || "00:00",
            end_time: eventData.end_time || eventData.EndTime || "23:59",
            location: eventData.location || eventData.Location || "TBD",
            banner_image_url: eventData.banner_image_url || eventData.BannerImageURL || "",
            manual_description: eventData.manual_description || eventData.ManualDescription || eventData.manual_Description || null,
          },
          ticketType: {
            id: ticketTypeData.id || ticketTypeData.ID || rawTicket.ticket_type_id || rawTicket.TicketTypeID || "unknown",
            name: ticketTypeData.name || ticketTypeData.Name || "General Admission",
            price: ticketTypeData.price || ticketTypeData.Price || 0,
          },
          qrCode: rawTicket.qr_code || rawTicket.QRCode || "",
          attendeeData: {
            fullName: rawTicket.attendee_full_name || rawTicket.AttendeeFullName || "Unknown",
            email: rawTicket.attendee_email || rawTicket.AttendeeEmail || "",
            phone: rawTicket.attendee_phone || rawTicket.AttendeePhone || "",
          },
          purchasedAt: rawTicket.created_at || rawTicket.CreatedAt || new Date().toISOString(),
          quantity: rawTicket.quantity || rawTicket.Quantity || 1,
        };

        setTicket(transformedTicket);
      } else {
        toast.error("Ticket not found");
        router.push("/my-raves");
      }
    } catch (error: any) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket");
      router.push("/my-raves");
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    if (!ticket) return;
    
    try {
      setIsDownloading(true);
      
      if (!qrCodeUrl) {
        toast.error('QR code is still loading. Please try again.');
        return;
      }

      await generateTicketPDF(ticket, qrCodeUrl);
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download ticket. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6 text-center">
              <TicketIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2 text-white">
                Sign In Required
              </h2>
              <p className="text-gray-400">
                Please sign in to view your ticket.
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
            <p className="text-gray-400">Loading your ticket...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6 text-center">
              <TicketIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2 text-white">
                Ticket Not Found
              </h2>
              <p className="text-gray-400 mb-4">
                The ticket you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button
                onClick={() => router.push("/my-raves")}
                className="bg-[#D72638] hover:bg-[#B91E2F]"
              >
                Back to My Raves
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(ticket.event.start_date);
  const isPastEvent = eventDate < new Date();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            onClick={() => router.push("/my-raves")}
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Raves
          </Button>

          {/* Ticket Card */}
          <Card className="overflow-hidden border-2 border-gray-800 bg-[#1a1a1a]">
            <CardHeader className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-3">{ticket.event.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(eventDate, 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{ticket.event.start_time} - {ticket.event.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.event.location}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={isPastEvent ? "secondary" : "default"}
                  className={`${isPastEvent ? "bg-gray-500" : "bg-green-500"} text-white`}
                >
                  {isPastEvent ? "Past Event" : "Upcoming"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Ticket Details */}
                <div className="space-y-6">
                  {/* Ticket Information */}
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-white">Ticket Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Ticket Type:</span>
                        <span className="font-medium text-white">{ticket.ticketType.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Price:</span>
                        <span className="font-medium text-white">₦{ticket.ticketType.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Quantity:</span>
                        <span className="font-medium text-white">{ticket.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Total Paid:</span>
                        <span className="font-medium text-white">₦{(ticket.ticketType.price * ticket.quantity).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Purchased:</span>
                        <span className="font-medium text-white">{format(new Date(ticket.purchasedAt), 'PPp')}</span>
                      </div>
                      {ticket.event.manual_description && (
                        <div className="py-3 border-b border-gray-700">
                          <span className="text-gray-400 text-sm block mb-2">Location Details:</span>
                          <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
                            {ticket.event.manual_description
                              .split("\n")
                              .map((paragraph: string, index: number) => (
                                <span key={index}>
                                  {paragraph}
                                  {index < ticket.event.manual_description!.split("\n").length - 1 && <br />}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendee Information */}
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-white">Attendee Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 py-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{ticket.attendeeData.fullName}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{ticket.attendeeData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{ticket.attendeeData.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="pt-4">
                    <Button
                      onClick={downloadTicket}
                      disabled={isDownloading || !qrCodeUrl}
                      className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white"
                      size="lg"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download Ticket PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="Ticket QR Code" 
                        className="w-64 h-64"
                      />
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-lg mb-2 text-white">Entry QR Code</h4>
                    <p className="text-sm text-gray-400 max-w-[280px]">
                      Show this QR code at the event entrance for verification. 
                      Make sure your screen brightness is high for easy scanning.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}