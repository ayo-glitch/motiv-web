"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2, FileText } from "lucide-react";

export interface LocationData {
  address: string;
  manualDescription?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

interface LocationPickerProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  className?: string;
}

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const [searchValue, setSearchValue] = useState(value?.address || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function for suggestions
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use Nominatim API for geocoding (free OpenStreetMap service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ng&limit=5&addressdetails=1`
      );
      const results = await response.json();
      
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);

    // Update the location with manual address (no coordinates)
    onChange({
      ...value,
      address: query,
    });

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search suggestions
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 500);
  };

  // Handle search result selection (this will add coordinates)
  const handleResultSelect = (result: any) => {
    const location: LocationData = {
      address: result.display_name,
      manualDescription: value?.manualDescription || "",
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      placeId: result.place_id?.toString(),
    };
    
    setSearchValue(location.address);
    onChange(location);
    setShowResults(false);
    setSearchResults([]);
  };

  // Handle manual description change
  const handleManualDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    onChange({
      ...value,
      address: value?.address || "",
      manualDescription: description,
    });
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Map Location Input with Search Suggestions */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Location *
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
            <Input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search for your event location on the map"
              className="pl-10 pr-10"
              required
            />
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            This will be used to show your event location on the map for guests
          </p>
        </div>

        {/* Manual Address Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Description *
          </label>
          <Textarea
            value={value?.manualDescription || ""}
            onChange={handleManualDescriptionChange}
            placeholder="Add detailed directions or description for guests (e.g., 'House Number 24, Behind the big blue building, look for the red door')"
            rows={3}
            className="w-full resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide additional details to help guests find your venue easily (Required)
          </p>
        </div>

        {/* Selected Location Display */}
        {value?.address && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              {/* Map Location */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D72638] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Map Location</p>
                  <p className="text-sm text-gray-700">{value.address}</p>
                  {value.coordinates && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Map coordinates available
                    </p>
                  )}
                  {!value.coordinates && (
                    <p className="text-xs text-amber-600 mt-1">
                      Select from search results to add map coordinates
                    </p>
                  )}
                </div>
              </div>

              {/* Manual Description */}
              {value.manualDescription && (
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                  <FileText className="w-4 h-4 text-[#D72638] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Additional Details</p>
                    <p className="text-sm text-gray-700">{value.manualDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}