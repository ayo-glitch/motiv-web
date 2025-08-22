"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Loader2, Download, Share2 } from "lucide-react";
import { useMyEvents, useEventMutations } from "@/lib/hooks";
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

export default function HostRavesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [raveToDelete, setRaveToDelete] = useState<string | null>(null);
  const router = useRouter();

  // Fetch events data
  const { data: eventsData, isLoading, error } = useMyEvents();
  const { deleteEvent, isDeleting, publishAllDrafts, isPublishingDrafts } = useEventMutations();
  


  const events = eventsData?.data ?? [];
  


  const handleEdit = (raveId: string) => {
    router.push(`/hosts/raves/edit/${raveId}`);
  };

  const handleDeleteClick = (raveId: string) => {
    setRaveToDelete(raveId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (raveToDelete) {
      try {
        await deleteEvent(raveToDelete);
        setDeleteDialogOpen(false);
        setRaveToDelete(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleExportRaves = () => {
    try {
      const exportData = formatDataForCSV(filteredEvents, {
        'Event Name': 'title',
        'Date': 'date',
        'Time': 'time', 
        'Location': 'location',
        'Status': 'status',
        'Ticket Price': 'price',
        'Max Attendees': 'max_attendees',
        'Current Attendees': 'current_attendees',
        'Description': 'description',
        'Created At': 'created_at'
      });

      exportToCSV({
        filename: `my-raves-${new Date().toISOString().split('T')[0]}`,
        headers: ['Event Name', 'Date', 'Time', 'Location', 'Status', 'Ticket Price', 'Max Attendees', 'Current Attendees', 'Description', 'Created At'],
        data: exportData,
        dateFields: ['Date', 'Created At']
      });

      toast.success('Raves exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export raves');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter events based on search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Raves</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleExportRaves}
            variant="outline"
            className="w-full sm:w-auto touch-manipulation"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {/* Temporary button to publish all drafts */}
          {events.some(event => event.status === 'draft') && (
            <Button 
              onClick={() => publishAllDrafts()}
              disabled={isPublishingDrafts}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto touch-manipulation"
            >
              {isPublishingDrafts ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish All Drafts'
              )}
            </Button>
          )}
          <Button 
            className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto touch-manipulation"
            onClick={() => router.push('/hosts/create-event')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rave
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#D72638] focus:ring-[#D72638] touch-manipulation"
          />
        </div>
        
        <div className="flex gap-3 sm:gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Raves Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load events</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all" ? "No events match your filters" : "No events created yet"}
            </p>
            <Button onClick={() => router.push('/hosts/create-event')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">EVENT NAME</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">DATE</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">VENUE</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">TAGS</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">ATTENDEES</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm">STATUS</th>
                  <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-600 text-xs sm:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-900 font-medium">{event.title}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">{event.location}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="flex flex-wrap gap-1">
                        {event.tags?.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {(event.tags?.length ?? 0) > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{(event.tags?.length ?? 0) - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                      {event.attendee_count || 0}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8 touch-manipulation hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            const eventUrl = `${window.location.origin}/event/${event.id}`;
                            navigator.clipboard.writeText(eventUrl);
                            toast.success('Event link copied to clipboard!');
                          }}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(event.id)}
                            className="text-red-600 focus:text-red-600"
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
            <AlertDialogTitle>Delete Rave</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rave? This action cannot be undone.
              All associated data including tickets and attendees will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}