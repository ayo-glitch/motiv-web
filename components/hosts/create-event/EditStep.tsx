"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventFormData, LocationData } from "@/hooks/useEventCreation";
import { TagsSelector } from "./TagsSelector";
import { LocationPicker } from "./LocationPicker";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface EditStepProps {
  formData: EventFormData;
  onUpdate: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onSaveDraft?: () => Promise<void>;
  isSaving?: boolean;
  isEdit?: boolean;
}

export function EditStep({ formData, onUpdate, onNext, onSaveDraft, isSaving = false, isEdit = false }: EditStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Please enter a rave title");
      return;
    }
    
    if (!formData.startDate) {
      alert("Please select a start date");
      return;
    }
    
    if (!formData.startTime) {
      alert("Please select a start time");
      return;
    }
    
    if (!formData.location || !formData.location.address.trim()) {
      alert("Please enter a location");
      return;
    }
    
    if (!formData.location.manualDescription || !formData.location.manualDescription.trim()) {
      alert("Please provide detailed address description to help guests find your venue");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Please enter a rave description");
      return;
    }
    
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/hosts/dashboard">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Rave Details" : "Create a New Rave"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rave Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rave Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Rave Title *
              </label>
              <Input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter the name of your event"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rave Type *
              </label>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ● Single Rave
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Session(s) * Start Date *
                </label>
                <Input
                  id="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => onUpdate({ startDate: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => onUpdate({ startTime: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => onUpdate({ endTime: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where will your rave take place? *
            </label>
            <LocationPicker
              value={formData.location || undefined}
              onChange={(location: LocationData) => onUpdate({ location })}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Rave Description *
              </label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Describe what's special about your rave & what ravers should expect"
                rows={4}
                className="w-full resize-none"
              />
            </div>

            {/* Tags Section */}
            <div>
              <TagsSelector
                selectedTags={formData.tags}
                onTagsChange={(tags) => onUpdate({ tags })}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between">
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-6"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Draft"
              )}
            </Button>
          )}
          
          <Button
            type="submit"
            className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-8 py-2 ml-auto"
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}