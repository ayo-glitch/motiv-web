import { useState, useCallback, useEffect } from "react";
import { eventsApi, CreateEventData, DraftEventData } from "@/lib/api/events";
import { Event } from "@/lib/types/api";
import upload from "@/lib/utils/upload";
import { toast } from "sonner";

export interface LocationData {
  address: string;
  manualDescription?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  eventType: "ticketed" | "free";
  startDate: string;
  startTime: string;
  endTime: string;
  location: LocationData | null;
  tags: string[];
  bannerImage: File | null;
  bannerImageURL?: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    quantity?: number;
    totalQuantity?: number;
    soldQuantity?: number;
  }>;
}

export const useEventCreation = (eventId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [draftId, setDraftId] = useState<string | null>(eventId || null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadEvent = useCallback(async (id: string) => {
    console.log("loadEvent called with id:", id);
    try {
      setIsLoading(true);
      setLoadError(null);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 15000); // 15 second timeout
      });
      
      console.log("Starting API call for event:", id);
      const eventData = await Promise.race([
        eventsApi.getEvent(id),
        timeoutPromise
      ]);
      
      console.log("Event data loaded successfully:", eventData);
      setEvent(eventData);
      setDraftId(id);
    } catch (error) {
      console.error("Failed to load event:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load event data";
      setLoadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log("loadEvent finished, setting isLoading to false");
      setIsLoading(false);
    }
  }, []);

  // Load existing event/draft
  useEffect(() => {
    console.log("useEventCreation useEffect - eventId:", eventId);
    if (eventId) {
      loadEvent(eventId);
    }
  }, [eventId, loadEvent]);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      console.log("Starting image upload for file:", file.name);
      setIsUploading(true);
      
      // Add timeout to prevent infinite uploading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Upload timeout")), 30000); // 30 second timeout
      });
      
      const imageUrl = await Promise.race([
        upload(file),
        timeoutPromise
      ]);
      
      console.log("Image upload completed successfully:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      console.log("Setting isUploading to false");
      setIsUploading(false);
    }
  };

  const resetUploadState = useCallback(() => {
    console.log("Resetting upload state");
    setIsUploading(false);
  }, []);

  const saveDraft = useCallback(async (formData: EventFormData): Promise<string> => {
    try {
      setIsSaving(true);
      
      let bannerImageURL = formData.bannerImageURL || "";
      
      // Upload image if there's a new file
      if (formData.bannerImage) {
        bannerImageURL = await uploadImage(formData.bannerImage);
      }

      // Prepare ticket types for ticketed events
      const ticketTypes = formData.eventType === "ticketed" 
        ? formData.ticketTypes
            .filter(ticket => ticket.name.trim())
            .map(ticket => ({
              name: ticket.name,
              price: ticket.price || 0,
              description: ticket.description,
              total_quantity: ticket.quantity || 100,
            }))
        : [];

      const draftData: DraftEventData = {
        id: draftId || undefined,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location?.address || "",
        locationData: formData.location ? {
          address: formData.location.address,
          manualDescription: formData.location.manualDescription || "",
          ...(formData.location.coordinates && { coordinates: formData.location.coordinates }),
          ...(formData.location.placeId && { placeId: formData.location.placeId })
        } : null,
        tags: formData.tags,
        bannerImageURL,
        eventType: formData.eventType,
        ticketTypes,
      };

      const savedEvent = await eventsApi.saveDraft(draftData);
      setEvent(savedEvent);
      setDraftId(savedEvent.id);

      // Only show success toast if we get here without errors
      toast.success("Your event has been saved as a draft");

      return savedEvent.id;
    } catch (error) {
      console.error("Failed to save draft:", error);
      
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : "Failed to save draft. Please try again.";
      
      toast.error(errorMessage);
      
      // Re-throw the error so the calling component knows it failed
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [draftId]);

  const publishEvent = useCallback(async (formData: EventFormData): Promise<Event> => {
    try {
      setIsLoading(true);
      
      let bannerImageURL = formData.bannerImageURL || "";
      
      // Upload image if there's a new file
      if (formData.bannerImage) {
        bannerImageURL = await uploadImage(formData.bannerImage);
      }

      // Prepare ticket types for ticketed events
      const ticketTypes = formData.eventType === "ticketed" 
        ? formData.ticketTypes
            .filter(ticket => ticket.name.trim() && ticket.price > 0)
            .map(ticket => ({
              name: ticket.name,
              price: ticket.price,
              description: ticket.description,
              total_quantity: ticket.quantity || 100,
            }))
        : [];

      const eventData: CreateEventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location?.address || "",
        locationData: formData.location ? {
          address: formData.location.address,
          manualDescription: formData.location.manualDescription || "",
          ...(formData.location.coordinates && { coordinates: formData.location.coordinates }),
          ...(formData.location.placeId && { placeId: formData.location.placeId })
        } : null,
        tags: formData.tags,
        bannerImageURL,
        eventType: formData.eventType,
        status: "active",
        ticketTypes,
      };

      let publishedEvent: Event;

      if (draftId) {
        // Update existing draft with all data and publish
        publishedEvent = await eventsApi.updateEvent(draftId, { ...eventData, status: "active" });
      } else {
        // Create new event directly as active
        publishedEvent = await eventsApi.createEvent(eventData);
      }

      setEvent(publishedEvent);

      // Only show success toast if we get here without errors
      toast.success(draftId ? "Your event has been updated successfully" : "Your event has been created and is now active.");

      return publishedEvent;
    } catch (error) {
      console.error("Failed to publish event:", error);
      
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : "Failed to publish event. Please try again.";
      
      toast.error(errorMessage);
      
      // Re-throw the error so the calling component knows it failed
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [draftId]);

  const updateEvent = useCallback(async (formData: EventFormData): Promise<Event> => {
    if (!eventId) {
      throw new Error("No event ID provided for update");
    }

    try {
      setIsLoading(true);
      
      let bannerImageURL = formData.bannerImageURL || "";
      
      // Upload image if there's a new file
      if (formData.bannerImage) {
        bannerImageURL = await uploadImage(formData.bannerImage);
      }

      // Prepare ticket types for ticketed events
      const ticketTypes = formData.eventType === "ticketed" 
        ? formData.ticketTypes
            .filter(ticket => ticket.name.trim() && ticket.price > 0)
            .map(ticket => ({
              name: ticket.name,
              price: ticket.price,
              description: ticket.description,
              total_quantity: ticket.quantity || 100,
            }))
        : [];

      const eventData: Partial<CreateEventData> = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location?.address || "",
        locationData: formData.location ? {
          address: formData.location.address,
          manualDescription: formData.location.manualDescription || "",
          ...(formData.location.coordinates && { coordinates: formData.location.coordinates }),
          ...(formData.location.placeId && { placeId: formData.location.placeId })
        } : null,
        tags: formData.tags,
        bannerImageURL,
        eventType: formData.eventType,
        ticketTypes,
      };

      const updatedEvent = await eventsApi.updateEvent(eventId, eventData);
      setEvent(updatedEvent);

      // Only show success toast if we get here without errors
      toast.success("Your event has been updated successfully");

      return updatedEvent;
    } catch (error) {
      console.error("Failed to update event:", error);
      
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : "Failed to update event. Please try again.";
      
      toast.error(errorMessage);
      
      // Re-throw the error so the calling component knows it failed
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  return {
    isLoading,
    isSaving,
    isUploading,
    event,
    draftId,
    loadError,
    saveDraft,
    publishEvent,
    updateEvent,
    uploadImage,
    resetUploadState,
  };
};