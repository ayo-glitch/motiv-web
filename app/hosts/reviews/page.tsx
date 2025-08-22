"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, MoreHorizontal, Loader2 } from "lucide-react";
import { useHostReviews, useMyEvents } from "@/lib/hooks";
import type { Review } from "@/lib/api/services/hostService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HostReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reviews data and events
  const { data: reviewsData, isLoading, error } = useHostReviews(currentPage, 10);
  const { data: eventsData, isLoading: eventsLoading } = useMyEvents();
  

  


  const reviews = reviewsData?.data ?? [];
  const reviewStats = reviewsData?.stats;
  const events = eventsData?.data ?? [];
  
  // Ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews = safeReviews.filter((review) => {
    // Safely access review properties with fallbacks
    const userName = review?.user_name || '';
    const eventTitle = review?.event_title || '';
    const eventId = review?.event_id || '';
    const comment = review?.comment || '';
    
    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
      selectedRating === "all" || (review?.rating || 0).toString() === selectedRating;
    const matchesEvent =
      selectedEvent === "all" || eventId === selectedEvent;
    return matchesSearch && matchesRating && matchesEvent;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Reviews
          </h1>
          <p className="text-gray-600 mt-1">View and manage event reviews</p>
        </div>
      </div>

      {/* Reviews Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            ) : reviewStats ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {reviewStats.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(reviewStats.average_rating))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviewStats.total_reviews} reviews
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">0.0</div>
                <div className="flex justify-center mb-2">
                  {renderStars(0)}
                </div>
                <p className="text-sm text-gray-600">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : reviewStats?.rating_distribution ? (
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviewStats.rating_distribution[stars] || 0;
                  const percentage = reviewStats.total_reviews > 0 
                    ? (count / reviewStats.total_reviews) * 100 
                    : 0;
                  
                  return (
                    <div key={stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm text-gray-600">{stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No rating data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#D72638] focus:ring-[#D72638]"
          />
        </div>

        <div className="flex gap-3 sm:gap-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="flex-1 sm:w-48">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="flex-1 sm:w-32">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading reviews...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Reviews feature not available</p>
            <p className="text-gray-500 text-sm">The reviews endpoint is not implemented in the backend yet.</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedRating !== "all" || selectedEvent !== "all"
                ? "No reviews match your filters" 
                : "No reviews yet"}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            // Safely access review properties with fallbacks
            const userName = review?.user_name || 'Anonymous';
            const eventTitle = review?.event_title || 'Unknown Event';
            const comment = review?.comment || '';
            const rating = review?.rating || 0;
            const createdAt = review?.created_at || new Date().toISOString();
            const reviewId = review?.id || '';
            
            const initials = userName
              .split(' ')
              .map((name: string) => name[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={reviewId} className="border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-[#D72638] rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {initials}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {userName}
                          </h4>
                          <p className="text-sm text-gray-600">{eventTitle}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(rating)}</div>
                          <span className="text-sm text-gray-500">
                            {new Date(createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{comment}</p>

                      <div className="flex items-center justify-end">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Load More */}
      {reviewsData?.has_more && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
