"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/lib/hooks";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: suggestions = [] } = useSearchSuggestions(searchQuery);

  useEffect(() => {
    setShowSuggestions(searchQuery.length >= 2 && suggestions.length > 0);
  }, [searchQuery, suggestions]);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    
    if (location.trim()) {
      params.set('location', location.trim());
    }
    
    // Navigate to search page with query parameters
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
    onClose(); // Close the modal
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Search Events</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search for events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.length >= 2 && suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                    >
                      <Search size={14} className="inline mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
              >
                <Search size={16} />
              </Button>
            </div>
            
            {/* Search suggestions or recent searches can go here */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["Concerts", "Festivals", "Nightlife", "Comedy Shows"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                      onClose();
                    }}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded-full transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}