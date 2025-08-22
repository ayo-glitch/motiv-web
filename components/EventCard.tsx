"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useIsInWishlist, useWishlistMutations } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";

interface EventCardProps {
  image: string;
  title: string;
  location: string;
  time: string;
  month: string;
  day: string;
  price?: string;
  interested?: number;
  isFree?: boolean;
  id?: string | number;
  isSoldOut?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string | number) => void;
  tags?: string[];
  showTags?: boolean;
}

export function EventCard({
  image,
  title,
  location,
  time,
  month,
  day,
  price,
  interested,
  isFree = false,
  id,
  isSoldOut = false,
  isWishlisted = false,
  onWishlistToggle,
  tags = [],
  showTags = false,
}: EventCardProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  // Handle event ID more robustly
  const eventId = useMemo(() => {
    if (typeof id === "string" && id.length > 10) {
      // Check if it's a valid UUID pattern
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        return id;
      }
    }

    if (id && typeof id === "number" && id !== 0) {
      return id.toString();
    }

    // Fallback to title-based slug
    return title.toLowerCase().replace(/\s+/g, "-");
  }, [id, title]);

  // Get wishlist status from API - only after mounting and with valid event ID
  const { data: isInWishlist = false } = useIsInWishlist(
    mounted && user && eventId ? eventId : ""
  );
  const { toggleWishlist, isTogglingWishlist } = useWishlistMutations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!user) {
      alert("Please sign in to add events to your wishlist");
      return;
    }

    // Check if we have a valid event ID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(eventId)) {
      console.error("Invalid event ID for wishlist:", eventId);
      alert("Unable to add to wishlist - invalid event ID");
      return;
    }

    // Toggle wishlist via API
    toggleWishlist(eventId, isInWishlist);

    if (onWishlistToggle) {
      onWishlistToggle(eventId);
    }
  };

  return (
    <Link href={`/event/${eventId}`} className="block">
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-[#333] overflow-hidden hover:border-gray-500 transition-all duration-300 hover:shadow-lg group cursor-pointer hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <Image
              src={image}
              alt={`${title} event`}
              width={400}
              height={200}
              className={`w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
                isSoldOut ? "grayscale opacity-75" : ""
              }`}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Sold Out Badge */}
            {isSoldOut && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                SOLD OUT
              </div>
            )}

            {/* Tags Overlay */}
            {showTags && tags.length > 0 && (
              <div className="absolute bottom-3 left-3">
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-black/70 text-white text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 2 && (
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      +{tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {mounted && (
              <button
                onClick={handleWishlistClick}
                disabled={isTogglingWishlist}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-110 touch-manipulation disabled:opacity-50 backdrop-blur-sm"
                title={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isInWishlist
                      ? "text-red-500 fill-red-500 scale-110"
                      : "text-white hover:text-red-300"
                  }`}
                />
                {isTogglingWishlist && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            )}
          </div>

          <div className="p-3 sm:p-4 relative">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
              <div className="text-center min-w-[35px] sm:min-w-[45px] md:min-w-[50px]">
                <div className="text-[#D72638] font-bold text-xs sm:text-sm">
                  {month}
                </div>
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                  {day}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-1 group-hover:text-gray-200 transition-colors duration-300 truncate">
                  {title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-1 flex items-center gap-1 truncate">
                  <span className="w-1 h-1 bg-[#D72638] rounded-full flex-shrink-0"></span>
                  <span className="truncate">{location}</span>
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">
                  {time}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                  {isSoldOut ? (
                    <span className="text-red-400 font-bold bg-red-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                      SOLD OUT
                    </span>
                  ) : isFree ? (
                    <span className="text-[#D72638] font-bold bg-[#D72638]/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                      FREE
                    </span>
                  ) : (
                    <>
                      {price && (
                        <span className="text-white flex items-center gap-1 bg-gray-800/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm truncate">
                          {price}
                        </span>
                      )}
                      {interested && (
                        <span className="text-gray-400 flex items-center gap-1 text-xs sm:text-sm truncate">
                          ⭐{interested} interested
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
