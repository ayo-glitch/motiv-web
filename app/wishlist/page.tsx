"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import {
  Search,
  Heart,
  Calendar,
  MapPin,
  Users,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useWishlist, useWishlistMutations } from "@/lib/hooks";

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Get wishlist from API
  const { data: wishlistEvents, isLoading, error } = useWishlist();
  const { removeFromWishlist, isRemovingFromWishlist } = useWishlistMutations();

  const handleRemoveFromWishlist = (eventId: string) => {
    removeFromWishlist(eventId);
  };

  // Ensure wishlistEvents is an array
  const events = Array.isArray(wishlistEvents) ? wishlistEvents : [];

  // Transform API data to match component expectations
  const wishlist = Array.isArray(wishlistEvents) ? wishlistEvents.filter(event => event != null).map((event) => {
    try {
      const eventDate = new Date(event.start_date);
      const addedDate = new Date(event.createdAt || new Date());
      
      return {
        id: event.id,
        title: event.title,
        date: eventDate.toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "short", 
          day: "numeric" 
        }),
        time: `${event.start_time} - ${event.end_time}`,
        location: event.location,
        price: event.event_type === 'free' ? "Free" : "From ₦500",
        image: event.banner_image_url || "https://res.cloudinary.com/dkuphcizs/image/upload/v1753716184/frankie-cordoba-SvWTcA5D4Uk-unsplash_eboztl.png",
        tags: Array.isArray(event.tags) ? event.tags : [],
        attendees: 0, // TODO: Get from analytics if available
        addedDate: addedDate.toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "short", 
          day: "numeric" 
        }),
      };
    } catch (error) {
      console.error("Error transforming wishlist event:", event.id, error);
      return null;
    }
  }).filter(event => event !== null) : [];

  const filteredWishlist = wishlist.filter((event) => {
    const title = event.title || "";
    const location = event.location || "";
    const tags = Array.isArray(event.tags) ? event.tags : [];

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((tag) =>
        tag && tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    try {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "added":
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
        case "name":
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    } catch (error) {
      return 0;
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#D72638]" />
            <p className="text-gray-400">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load your wishlist</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Header />
      <div className="pb-20 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  My Wishlist
                </h1>
                <p className="text-gray-400 mt-1">
                  {wishlist.length} event{wishlist.length !== 1 ? "s" : ""}{" "}
                  saved for later
                </p>
              </div>
              {/* <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Wishlist
                </Button>
              </div> */}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#D72638] focus:ring-[#D72638] h-11 touch-manipulation"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 h-11 touch-manipulation bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-gray-700">
                <SelectItem
                  value="date"
                  className="text-white hover:bg-gray-800"
                >
                  Event Date
                </SelectItem>
                <SelectItem
                  value="added"
                  className="text-white hover:bg-gray-800"
                >
                  Recently Added
                </SelectItem>
                <SelectItem
                  value="name"
                  className="text-white hover:bg-gray-800"
                >
                  Event Name
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Wishlist Content */}
          {sortedWishlist.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {searchQuery ? "No events found" : "Your wishlist is empty"}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms to find events in your wishlist."
                  : "Start exploring events and save the ones you love to see them here."}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button className="bg-[#D72638] hover:bg-[#B91E2F] text-white">
                    Discover Events
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedWishlist.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-lg shadow-sm border border-[#333] overflow-hidden hover:shadow-md hover:border-gray-500 transition-all"
                >
                  {/* Event Image */}
                  <div className="relative h-48 sm:h-52">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleRemoveFromWishlist(event.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors touch-manipulation">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(event.tags) ? event.tags : []).slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-black/70 text-white text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-4 sm:p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Added {new Date(event.addedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-[#D72638]">
                          {event.price}
                        </p>
                      </div>
                      <Link href={`/event/${event.id}`}>
                        <Button
                          size="sm"
                          className="bg-[#D72638] hover:bg-[#B91E2F] text-white touch-manipulation"
                        >
                          View Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions - Mobile Only */}
          {/* <div className="sm:hidden fixed bottom-24 right-4 z-40">
            <Button
              size="sm"
              variant="outline"
              className="bg-[#1a1a1a] shadow-lg border-gray-700 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
