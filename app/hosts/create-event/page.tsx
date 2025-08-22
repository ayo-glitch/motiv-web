"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreateEventSteps } from "@/components/hosts/CreateEventSteps";
import { EditStep } from "@/components/hosts/create-event/EditStep";
import { BannerStep } from "@/components/hosts/create-event/BannerStep";
import { TicketingStep } from "@/components/hosts/create-event/TicketingStep";
import { ReviewStep } from "@/components/hosts/create-event/ReviewStep";
import { useEventCreation, EventFormData } from "@/hooks/useEventCreation";
import { Loader2 } from "lucide-react";

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity?: number;
  totalQuantity?: number;
  soldQuantity?: number;
}

export interface LocationData {
  address: string;
  manualDescription?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  eventType: "ticketed",
  startDate: "",
  startTime: "",
  endTime: "",
  location: {
    address: "",
    manualDescription: ""
  },
  tags: [],
  bannerImage: null,
  bannerImageURL: "",
  ticketTypes: [
    {
      id: "1",
      name: "",
      price: 0,
      description: ""
    }
  ]
};

export default function CreateEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("id");
  const isEdit = !!eventId;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  
  const { 
    isLoading, 
    isSaving, 
    isUploading, 
    event, 
    draftId, 
    saveDraft, 
    publishEvent, 
    updateEvent,
    uploadImage,
    resetUploadState
  } = useEventCreation(eventId || undefined);

  // Load existing event data when editing
  useEffect(() => {
    if (event && isEdit) {
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

      setFormData({
        title: event.title || "",
        description: event.description || "",
        eventType: event.event_type || "ticketed",
        startDate: event.start_date || "",
        startTime: event.start_time || "",
        endTime: event.end_time || "",
        location: locationData,
        tags: event.tags || [],
        bannerImage: null,
        bannerImageURL: event.banner_image_url || "",
        ticketTypes: (event as any).ticket_types && (event as any).ticket_types.length > 0
          ? (event as any).ticket_types.map((ticket: any, index: number) => ({
              id: (index + 1).toString(),
              name: ticket.name || ticket.Name || "",
              price: ticket.price || ticket.Price || 0,
              description: ticket.description || ticket.Description || "",
              quantity: ticket.total_quantity || ticket.TotalQuantity || 100
            }))
          : [
              {
                id: "1",
                name: "",
                price: 0,
                description: ""
              }
            ]
      });
    }
  }, [event, isEdit]);

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
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = async () => {
    try {
      const savedDraftId = await saveDraft(formData);
      // Update URL to include draft ID for future saves
      if (!eventId) {
        router.replace(`/hosts/create-event?id=${savedDraftId}`);
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      // Don't update URL if there was an error
      // The error toast will be shown by the hook
    }
  };

  const handlePublish = async () => {
    console.log("handlePublish called, isEdit:", isEdit, "formData:", formData);
    try {
      if (isEdit) {
        console.log("Updating event with ID:", eventId);
        await updateEvent(formData);
        router.push("/hosts/raves");
      } else {
        console.log("Publishing new event");
        await publishEvent(formData);
        router.push("/hosts/dashboard");
      }
    } catch (error) {
      console.error("Failed to publish event:", error);
      // Don't navigate if there was an error
      // The error toast will be shown by the hook
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EditStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            isEdit={isEdit}
          />
        );
      case 2:
        return (
          <BannerStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            isUploading={isUploading}
            isEdit={isEdit}
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
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            isEdit={isEdit}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onBack={handleBack}
            onSave={handlePublish}
            isLoading={isLoading}
            isEdit={isEdit}
            event={event}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <CreateEventSteps steps={steps} />
        {renderCurrentStep()}
      </div>
    </div>
  );
}