"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

// Mock tags data - in real app, this would come from API
const availableTags = [
  { id: "afrobeats", name: "Afrobeats", color: "bg-red-100 text-red-800" },
  { id: "hip-hop", name: "Hip Hop", color: "bg-blue-100 text-blue-800" },
  { id: "dancehall", name: "Dancehall", color: "bg-green-100 text-green-800" },
  { id: "amapiano", name: "Amapiano", color: "bg-purple-100 text-purple-800" },
  { id: "reggae", name: "Reggae", color: "bg-yellow-100 text-yellow-800" },
  { id: "electronic", name: "Electronic", color: "bg-indigo-100 text-indigo-800" },
  { id: "r&b", name: "R&B", color: "bg-pink-100 text-pink-800" },
  { id: "gospel", name: "Gospel", color: "bg-orange-100 text-orange-800" },
  { id: "highlife", name: "Highlife", color: "bg-teal-100 text-teal-800" },
  { id: "fuji", name: "Fuji", color: "bg-cyan-100 text-cyan-800" },
  { id: "outdoor", name: "Outdoor", color: "bg-emerald-100 text-emerald-800" },
  { id: "indoor", name: "Indoor", color: "bg-slate-100 text-slate-800" },
  { id: "rooftop", name: "Rooftop", color: "bg-sky-100 text-sky-800" },
  { id: "club", name: "Club", color: "bg-violet-100 text-violet-800" },
  { id: "festival", name: "Festival", color: "bg-rose-100 text-rose-800" },
  { id: "concert", name: "Concert", color: "bg-amber-100 text-amber-800" },
  { id: "party", name: "Party", color: "bg-lime-100 text-lime-800" },
  { id: "networking", name: "Networking", color: "bg-fuchsia-100 text-fuchsia-800" },
  { id: "vip", name: "VIP Experience", color: "bg-gold-100 text-gold-800" },
  { id: "all-ages", name: "All Ages", color: "bg-neutral-100 text-neutral-800" },
];

interface TagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsSelector({ selectedTags, onTagsChange }: TagsSelectorProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      // Remove tag
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      // Add tag (limit to 5 tags)
      if (selectedTags.length < 5) {
        onTagsChange([...selectedTags, tagId]);
      }
    }
  };

  const getTagInfo = (tagId: string) => {
    return availableTags.find(tag => tag.id === tagId);
  };

  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Tags
          </label>
          <p className="text-xs text-gray-500">
            Select up to 5 tags that best describe your event ({selectedTags.length}/5)
          </p>
        </div>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => {
              const tag = getTagInfo(tagId);
              if (!tag) return null;
              
              return (
                <span
                  key={tagId}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tag.color} border`}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tagId)}
                    className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Available Tags:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {displayedTags.map(tag => {
            const isSelected = selectedTags.includes(tag.id);
            const isDisabled = !isSelected && selectedTags.length >= 5;
            
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                disabled={isDisabled}
                className={`
                  inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                  ${isSelected 
                    ? `${tag.color} border-current shadow-sm` 
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {isSelected && <span className="mr-1">✓</span>}
                {tag.name}
              </button>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        {availableTags.length > 12 && (
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs"
            >
              {showAllTags ? (
                <>Show Less</>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  Show More Tags ({availableTags.length - 12} more)
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Popular Combinations Suggestions */}
      {selectedTags.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Popular Combinations:</p>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-600">Afrobeats + Party + Club:</span>
              <button
                type="button"
                onClick={() => onTagsChange(['afrobeats', 'party', 'club'])}
                className="text-xs text-[#D72638] hover:underline font-medium"
              >
                Apply
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-600">Amapiano + Outdoor + Festival:</span>
              <button
                type="button"
                onClick={() => onTagsChange(['amapiano', 'outdoor', 'festival'])}
                className="text-xs text-[#D72638] hover:underline font-medium"
              >
                Apply
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-600">Hip Hop + Indoor + VIP:</span>
              <button
                type="button"
                onClick={() => onTagsChange(['hip-hop', 'indoor', 'vip'])}
                className="text-xs text-[#D72638] hover:underline font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}