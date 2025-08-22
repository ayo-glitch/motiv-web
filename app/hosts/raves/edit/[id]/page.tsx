"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreateEventSteps } from "@/components/hosts/CreateEventSteps";
import { EditStep } from "@/components/hosts/create-event/EditStep";
import { BannerStep } from "@/components/hosts/create-event/BannerStep";
import { TicketingStep } from "@/components/hosts/create-event/TicketingStep";
import { ReviewStep } from "@/components/hosts/create-event/ReviewStep";
import { useEventCreation, EventFormData, LocationData } from "@/hooks/useEventCreation";
import { toast } from "sonner";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  totalQuantity?: number;
  soldQuantity?: number;
  total_quantity?: number;
  sold_quantity?: number;
}

export default function EditRavePage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const eventId = params.id as string;
  console.log("Edit page eventId:", eventId, "params:", params);

  const { 
    isLoading, 
    isSaving, 
    isUploading, 
    event, 
    loadError,
    updateEvent,
    uploadImage,
    resetUploadState 
  } = useEventCreation(eventId);

  // Redirect if no event ID
  useEffect(() => {
    if (!eventId) {
      console.log("No eventId found, redirecting to raves page");
      router.push("/hosts/raves");
    }
  }, [eventId, router]);

  // Load existing event data when editing
  useEffect(() => {
    if (event && !formData) {
      try {
        console.log("Processing event data:", event);
        console.log("Event as any:", event as any);
        
        // Handle location data - check if we have coordinates or just address
        let locationData: LocationData | null = null;
        if (event.location) {
          const eventAny = event as any;
          
          // Check if event has coordinate data from the database
          const hasCoordinates = (eventAny.latitude && eventAny.longitude) || 
                                (eventAny.Latitude && eventAny.Longitude);
          
          if (hasCoordinates) {
            locationData = {
              address: event.location,
              manualDescription: eventAny.manual_description || eventAny.ManualDescription || "",
              coordinates: {
                lat: eventAny.latitude || eventAny.Latitude,
                lng: eventAny.longitude || eventAny.Longitude
              },
              placeId: eventAny.place_id || eventAny.PlaceID,
            };
          } else {
            // Manual address - no coordinates
            locationData = {
              address: event.location,
              manualDescription: eventAny.manual_description || eventAny.ManualDescription || "",
              // No coordinates - this will be handled as manual address
            };
          }
        }

        // Better event type detection - check if there are ticket types with prices > 0
        const eventAny = event as any;
        const ticketTypes = eventAny.ticket_types || eventAny.TicketTypes || [];
        const hasTicketTypes = ticketTypes.length > 0 && ticketTypes.some((ticket: any) => ticket.price > 0);
        
        console.log("Ticket types found:", ticketTypes);
        console.log("Has ticket types:", hasTicketTypes);

        // Better date/time parsing - handle multiple formats
        let startDate = "";
        let startTime = "";
        let endTime = "";

        console.log("Raw event dates:", {
          start_date: event.start_date,
          start_time: event.start_time,
          end_time: event.end_time
        });

        // Check for separate start_date and start_time fields (correct format)
        if (event.start_date && event.start_time) {
          // Extract just the date part if start_date is a datetime string
          if (event.start_date.includes('T')) {
            startDate = event.start_date.split('T')[0];
          } else {
            startDate = event.start_date;
          }
          startTime = event.start_time.substring(0, 5); // Ensure it's HH:MM format
          console.log("Using separate fields - start date:", startDate, "start time:", startTime);
        } 
        // Fallback: check for datetime in start_time field
        else if (event.start_time) {
          try {
            const startDateTime = new Date(event.start_time);
            if (!isNaN(startDateTime.getTime())) {
              startDate = startDateTime.toISOString().split('T')[0];
              startTime = startDateTime.getHours().toString().padStart(2, '0') + ':' + startDateTime.getMinutes().toString().padStart(2, '0');
              console.log("Parsed from datetime - start date:", startDate, "start time:", startTime);
            }
          } catch (e) {
            console.error("Error parsing start_time as datetime:", e);
          }
        }

        // Handle end_time
        if (event.end_time) {
          // If it's just time (HH:MM format)
          if (event.end_time.match(/^\d{2}:\d{2}$/)) {
            endTime = event.end_time;
            console.log("Using time format - end time:", endTime);
          } 
          // If it's a full datetime
          else {
            try {
              const endDateTime = new Date(event.end_time);
              if (!isNaN(endDateTime.getTime())) {
                endTime = endDateTime.getHours().toString().padStart(2, '0') + ':' + endDateTime.getMinutes().toString().padStart(2, '0');
                console.log("Parsed from datetime - end time:", endTime);
              }
            } catch (e) {
              console.error("Error parsing end_time:", e);
              // Fallback: try to extract time if it's in HH:MM:SS format
              if (event.end_time.includes(':')) {
                endTime = event.end_time.substring(0, 5);
              }
            }
          }
        }

        console.log("Final parsed times:", { startDate, startTime, endTime });

        const eventFormData: EventFormData = {
          title: event.title,
          description: event.description,
          eventType: hasTicketTypes ? "ticketed" : "free",
          startDate,
          startTime,
          endTime,
          location: locationData,
          tags: event.tags || [],
          bannerImage: null,
          bannerImageURL: event.banner_image_url || "",
          ticketTypes: ticketTypes.map((ticket: any) => ({
            id: ticket.id || ticket.ID || "",
            name: ticket.name || ticket.Name || "",
            price: ticket.price || ticket.Price || 0,
            description: ticket.description || ticket.Description || "",
            quantity: ticket.total_quantity || ticket.totalQuantity || ticket.TotalQuantity || ticket.quantity || ticket.Quantity || 100,
            totalQuantity: ticket.total_quantity || ticket.totalQuantity || ticket.TotalQuantity || ticket.quantity || ticket.Quantity || 100,
            soldQuantity: ticket.sold_quantity || ticket.soldQuantity || ticket.SoldQuantity || 0
          }))
        };
        
        console.log("Final form data:", eventFormData);
        setFormData(eventFormData);
        setLoadingError(null);
      } catch (error) {
        console.error("Error processing event data:", error);
        setLoadingError("Failed to process event data");
      }
    }
  }, [event, formData]);

  const steps = [
    { number: 1, title: "Edit", active: currentStep === 1 },
    { number: 2, title: "Banner", active: currentStep === 2 },
    { number: 3, title: "Ticketing", active: currentStep === 3 },
    { number: 4, title: "Review", active: currentStep === 4 },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (updates: Partial<EventFormData>) => {
    if (formData) {
      setFormData(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setSaveError(null);
    try {
      await updateEvent(formData);
      toast.success("Event updated successfully!");
      router.push("/hosts/raves");
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save event";
      setSaveError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const renderCurrentStep = () => {
    if (!formData) return null;
    
    switch (currentStep) {
      case 1:
        return (
          <EditStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onNext={handleNext}
            isEdit={true}
          />
        );
      case 2:
        return (
          <BannerStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
            isUploading={isUploading}
            isEdit={true}
            onUploadImage={uploadImage}
            onResetUpload={resetUploadState}
          />
        );
      case 3:
        return (
          <TicketingStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
            isEdit={true}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onBack={handleBack}
            onSave={handleSave}
            isLoading={isSaving}
            isEdit={true}
            event={event}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event data...</p>
          <p className="mt-2 text-sm text-gray-500">This should only take a few seconds</p>
        </div>
      </div>
    );
  }

  if (loadingError || loadError) {
    const errorMessage = loadingError || loadError || "Unknown error occurred";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Event</h2>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push("/hosts/raves")}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Event Not Found</h2>
            <p className="text-yellow-600 mb-4">The event you're trying to edit could not be found.</p>
            <button
              onClick={() => router.push("/hosts/raves")}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638] mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Rave</h1>
          <p className="text-gray-600 mt-1">Update your event details</p>
          {saveError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{saveError}</p>
            </div>
          )}
        </div>
        <CreateEventSteps steps={steps} />
        {renderCurrentStep()}
      </div>
    </div>
  );
}