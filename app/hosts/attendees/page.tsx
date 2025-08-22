"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, MoreHorizontal, Edit, Trash2, QrCode, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAttendees, useAttendeeMutations, useMyEvents } from "@/lib/hooks";
import { exportToCSV, formatDataForCSV } from "@/lib/utils/csvExport";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HostAttendeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedTicketType, setSelectedTicketType] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendeeToDelete, setAttendeeToDelete] = useState<string | null>(null);

  // Fetch data
  const { data: attendeesData, isLoading, error } = useAttendees({
    search: searchQuery || undefined,
    event_id: selectedEvent !== "all" ? selectedEvent : undefined,
    ticket_type: selectedTicketType !== "all" ? selectedTicketType : undefined,
  });
  const { data: eventsData } = useMyEvents();
  const { cancel, export: exportAttendees, isCancelling, isExporting } = useAttendeeMutations();

  const attendees = attendeesData?.data ?? [];
  const events = eventsData?.data ?? [];

  // Get unique ticket types from attendees
  const uniqueTicketTypes = [...new Set(attendees.map(attendee => attendee.ticket_type))];

  const filteredAttendees = attendees;

  const handleEdit = (attendeeId: string) => {
    // TODO: Implement edit attendee functionality
    console.log("Edit attendee:", attendeeId);
  };

  const handleDeleteClick = (attendeeId: string) => {
    setAttendeeToDelete(attendeeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (attendeeToDelete) {
      try {
        await cancel({ attendeeId: attendeeToDelete });
        setDeleteDialogOpen(false);
        setAttendeeToDelete(null);
      } catch (error) {
        console.error("Failed to cancel attendee:", error);
      }
    }
  };

  const handleExport = async () => {
    try {
      // Try the backend export first
      await exportAttendees({
        search: searchQuery || undefined,
        event_id: selectedEvent !== "all" ? selectedEvent : undefined,
        ticket_type: selectedTicketType !== "all" ? selectedTicketType : undefined,
      });
    } catch (error) {
      // If backend export fails, use frontend CSV export
      console.warn('Backend export failed, using frontend export:', error);
      
      try {
        const exportData = formatDataForCSV(attendees, {
          'Name': 'user.name',
          'Email': 'user.email', 
          'Phone': 'user.phone',
          'Event': 'event.title',
          'Ticket Type': 'ticket_type',
          'Purchase Date': 'created_at',
          'Status': 'status',
          'Check-in Status': 'checked_in',
          'Check-in Time': 'checked_in_at'
        });

        exportToCSV({
          filename: `attendees-${new Date().toISOString().split('T')[0]}`,
          headers: ['Name', 'Email', 'Phone', 'Event', 'Ticket Type', 'Purchase Date', 'Status', 'Check-in Status', 'Check-in Time'],
          data: exportData,
          dateFields: ['Purchase Date', 'Check-in Time']
        });

        toast.success('Attendees exported successfully');
      } catch (csvError) {
        console.error('CSV export failed:', csvError);
        toast.error('Failed to export attendees');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendees</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link href="/hosts/scan-qr">
            <Button className="bg-[#D72638] hover:bg-[#B91E2F] text-white w-full sm:w-auto touch-manipulation">
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code
            </Button>
          </Link>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto touch-manipulation"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#D72638] focus:ring-[#D72638] touch-manipulation"
          />
        </div>
        
        <div className="flex gap-3 sm:gap-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="flex-1 sm:w-40">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
            <SelectTrigger className="flex-1 sm:w-40">
              <SelectValue placeholder="All Ticket Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ticket Types</SelectItem>
              {uniqueTicketTypes.map(ticketType => (
                <SelectItem key={ticketType} value={ticketType}>{ticketType}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedEvent !== "all" || selectedTicketType !== "all" || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEvent("all");
                setSelectedTicketType("all");
                setSearchQuery("");
              }}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredAttendees.length} of {attendeesData?.total || 0} attendees
          {(selectedEvent !== "all" || selectedTicketType !== "all" || searchQuery) && (
            <span className="ml-2">
              {selectedEvent !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 mr-2">
                  Event: {events.find(e => e.id === selectedEvent)?.title || selectedEvent}
                </span>
              )}
              {selectedTicketType !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 mr-2">
                  Ticket: {selectedTicketType}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                  Search: "{searchQuery}"
                </span>
              )}
            </span>
          )}
        </span>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading attendees...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load attendees</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredAttendees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedEvent !== "all" || selectedTicketType !== "all" 
                ? "No attendees match your filters" 
                : "No attendees yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">ATTENDEE</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">CONTACT</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">EVENT</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">TICKET TYPE</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">PURCHASE DATE</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">AMOUNT</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">STATUS</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-900 font-medium">{attendee.name}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-blue-600 break-all">{attendee.email}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">{attendee.event_title}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {attendee.ticket_type}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {new Date(attendee.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-900">
                      ₦{attendee.amount.toLocaleString()}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attendee.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
                        attendee.status === 'checked_in' ? 'bg-green-100 text-green-800' :
                        attendee.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {attendee.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8 touch-manipulation">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(attendee.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(attendee.id)}
                            className="text-red-600 focus:text-red-600"
                            disabled={isCancelling}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Attendee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this attendee? This action cannot be undone.
              The attendee will lose access to the event and their ticket will be cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}