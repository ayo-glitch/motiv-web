"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, Calendar, Wallet, MoreHorizontal, Edit, Trash2, Loader2, Share2 } from "lucide-react";
import { useHostDashboard, useMyEvents, useEventMutations } from "@/lib/hooks";
import { toast } from "sonner";
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

export default function HostDashboard() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const router = useRouter();

  // Fetch real data
  const { data: dashboardStats, isLoading: statsLoading } = useHostDashboard();
  const { data: eventsData, isLoading: eventsLoading } = useMyEvents();
  const { publishAllDrafts, isPublishingDrafts, deleteEvent, isDeleting } = useEventMutations();

  const events = eventsData?.data ?? [];
  


  const statsCards = [
    {
      title: "Total Revenue",
      value: dashboardStats ? `₦${dashboardStats.total_revenue.toLocaleString()}` : "₦0",
      subtitle: "All time earnings",
      icon: Wallet,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Raves",
      value: dashboardStats ? dashboardStats.total_events.toString() : "0",
      subtitle: "Events created",
      icon: Calendar,
      trend: "+6",
      trendUp: true,
    },
    {
      title: "Total Attendees",
      value: dashboardStats ? dashboardStats.total_attendees.toLocaleString() : "0",
      subtitle: "Across all events",
      icon: Users,
      trend: "+847",
      trendUp: true,
    },
  ];

  const handleEdit = (eventId: string) => {
    router.push(`/hosts/raves/edit/${eventId}`);
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        setDeleteDialogOpen(false);
        setEventToDelete(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back, Rave host</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's what's happening with your events today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
            className="bg-[#D72638] hover:bg-[#B91E2F] text-white w-full sm:w-auto touch-manipulation"
            onClick={() => router.push('/hosts/create-event')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rave
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                    <span className="truncate">{stat.subtitle}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Events Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Your Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {eventsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No events created yet</p>
              <Button onClick={() => router.push('/hosts/create-event')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">Event name</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">Date</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">Location</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {events
                    .sort((a, b) => new Date(b.createdAt || b.start_date).getTime() - new Date(a.createdAt || a.start_date).getTime())
                    .slice(0, 5).map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 font-medium">{event.title}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                        {new Date(event.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">{event.location}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 touch-manipulation hover:bg-gray-100 cursor-pointer">
                              <MoreHorizontal className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/event/${event.id}`)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              View Event
                            </DropdownMenuItem>
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
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