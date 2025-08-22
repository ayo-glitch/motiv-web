"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Phone, Mail, Download, QrCode, Loader2, Eye, MoreHorizontal, Share2 } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode";
import { generateTicketPDF } from "@/lib/utils/pdfGenerator";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TicketCardProps {
  ticket: {
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
  };
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Generate QR code image
    QRCode.toDataURL(ticket.qrCode, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    .then((url: string) => setQrCodeUrl(url))
    .catch((err: any) => console.error('Error generating QR code:', err));
  }, [ticket.qrCode]);

  const eventDate = new Date(ticket.event.start_date);
  const isPastEvent = eventDate < new Date();

  const downloadTicket = async () => {
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

  return (
    <Card className="overflow-hidden border-2 border-gray-200 hover:border-[#D72638] transition-colors duration-300">
      <CardHeader className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold mb-2">{ticket.event.title}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{format(eventDate, 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[250px] sm:max-w-[200px]">{ticket.event.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <Badge 
              variant={isPastEvent ? "secondary" : "default"}
              className={`text-xs ${isPastEvent ? "bg-gray-500" : "bg-green-500"}`}
            >
              {isPastEvent ? "Past Event" : "Upcoming"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-white hover:bg-white/10 cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/event/${ticket.event.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Event
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadTicket} disabled={isDownloading}>
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download Ticket'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const eventUrl = `${window.location.origin}/event/${ticket.event.id}`;
                  navigator.clipboard.writeText(eventUrl);
                  toast.success('Event link copied to clipboard!');
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Ticket Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Ticket Details</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Type:</span>
                  <span className="font-medium">{ticket.ticketType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₦{ticket.ticketType.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{ticket.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Time:</span>
                  <span className="font-medium">{ticket.event.start_time} - {ticket.event.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchased:</span>
                  <span className="font-medium">{format(new Date(ticket.purchasedAt), 'PPp')}</span>
                </div>
                {ticket.event.manual_description && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-xs block mb-1">Location Details:</span>
                    <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
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
              <h3 className="font-semibold text-base sm:text-lg mb-3">Attendee Information</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{ticket.attendeeData.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{ticket.attendeeData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{ticket.attendeeData.phone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Link href={`/ticket/${ticket.id}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center text-xs sm:text-sm"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  View Ticket
                </Button>
              </Link>
              <Button
                onClick={downloadTicket}
                disabled={isDownloading || !qrCodeUrl}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 w-full sm:w-auto justify-center text-xs sm:text-sm"
              >
                {isDownloading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {isDownloading ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center order-first lg:order-last">
            <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 mb-3 sm:mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="Ticket QR Code" 
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center bg-gray-100 rounded">
                  <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center max-w-[200px] px-2">
              Show this QR code at the event entrance for verification
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}