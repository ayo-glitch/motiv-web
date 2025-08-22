"use client";

import { useEvents } from "@/lib/hooks";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EventListProps {
  searchQuery?: string;
  tags?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  eventType?: string;
}

export function EventList({ searchQuery, tags, location, dateFrom, dateTo, eventType }: EventListProps) {
  const [mounted, setMounted] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useEvents({
    search: searchQuery,
    tags,
    location,
    dateFrom,
    dateTo,
    eventType,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load events</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Handle both paginated response and simple array response
  const events =
    data?.pages.flatMap((page) => {
      // If the response is already an array (old backend format)
      if (Array.isArray(page)) {
        return page;
      }
      // If the response has the expected pagination structure
      return page.data || [];
    }) ?? [];

  // DEBUG: Log event IDs to check for duplicates or missing keys
  const eventIds = events.map((e) => e.id || e.ID);
  if (new Set(eventIds).size !== eventIds.length) {
    console.warn("Duplicate event IDs found:", eventIds);
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No events found</p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          try {
            const startDate = new Date(event.start_date || event.StartDate);
            const month = startDate
              .toLocaleDateString("en-US", { month: "short" })
              .toUpperCase();
            const day = startDate.getDate().toString().padStart(2, "0");
            const tags =
              (event.tags && Array.isArray(event.tags)) ? event.tags : 
              (event.Tags && Array.isArray(event.Tags)) ? event.Tags : [];

            return (
              <EventCard
                key={event.id || event.ID}
                id={event.id || event.ID}
                image={
                  event.banner_image_url || event.BannerImageURL ||
                  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop&auto=format"
                }
                title={event.title || event.Title}
                location={event.location || event.Location}
                time={`${event.start_time || event.StartTime} - ${event.end_time || event.EndTime}`}
                month={month}
                day={day}
                tags={tags}
                showTags={true}
                price="From ₦500"
                interested={0}
              />
            );
          } catch (error) {
            console.error("Error rendering event:", event.id || event.ID, error);
            return null;
          }
        })}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Events"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
