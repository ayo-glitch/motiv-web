import { apiClient } from "./client";
import { Event, CreateEventRequest, UpdateEventRequest, ApiResponse } from "@/lib/types/api";

export interface LocationData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  manualDescription?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationData?: LocationData | null;
  tags: string[];
  bannerImageURL: string;
  eventType: "free" | "ticketed";
  status?: "draft" | "active";
  ticketTypes?: Array<{
    name: string;
    price: number;
    description: string;
    total_quantity?: number;
  }>;
}

export interface DraftEventData extends Partial<CreateEventData> {
  id?: string;
}

export const eventsApi = {
  // Create a new event
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const requestData = {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      locationData: eventData.locationData,
      tags: eventData.tags,
      bannerImageURL: eventData.bannerImageURL,
      eventType: eventData.eventType,
      status: eventData.status || "active", // Default to active if not specified
      ticketTypes: eventData.ticketTypes?.map(ticket => ({
        name: ticket.name,
        price: ticket.price,
        description: ticket.description,
        totalQuantity: ticket.total_quantity || 100,
      })) || [],
    };

    const response = await apiClient.post<Event>("/hosts/me/events", requestData);
    return response;
  },

  // Update an existing event
  async updateEvent(eventId: string, eventData: Partial<CreateEventData>): Promise<Event> {
    const updateData: any = {};
    
    if (eventData.title !== undefined) updateData.Title = eventData.title;
    if (eventData.description !== undefined) updateData.Description = eventData.description;
    if (eventData.startDate !== undefined) updateData.StartDate = eventData.startDate;
    if (eventData.startTime !== undefined) updateData.StartTime = eventData.startTime;
    if (eventData.endTime !== undefined) updateData.EndTime = eventData.endTime;
    if (eventData.location !== undefined) updateData.Location = eventData.location;
    if (eventData.locationData !== undefined) updateData.LocationData = eventData.locationData;
    if (eventData.tags !== undefined) updateData.Tags = eventData.tags;
    if (eventData.bannerImageURL !== undefined) updateData.BannerImageURL = eventData.bannerImageURL;
    if (eventData.eventType !== undefined) updateData.EventType = eventData.eventType;
    if (eventData.status !== undefined) updateData.Status = eventData.status;

    const response = await apiClient.put<Event>(`/hosts/me/events/${eventId}`, updateData);
    return response;
  },

  // Save event as draft
  async saveDraft(draftData: DraftEventData): Promise<Event> {
    const eventData: CreateEventData = {
      title: draftData.title || "",
      description: draftData.description || "",
      startDate: draftData.startDate || "",
      startTime: draftData.startTime || "",
      endTime: draftData.endTime || "",
      location: draftData.location || "",
      tags: draftData.tags || [],
      bannerImageURL: draftData.bannerImageURL || "",
      eventType: draftData.eventType || "ticketed",
      status: "draft",
    };

    if (draftData.id) {
      // Update existing draft
      return await this.updateEvent(draftData.id, eventData);
    } else {
      // Create new draft
      return await this.createEvent(eventData);
    }
  },

  // Get event by ID
  async getEvent(eventId: string): Promise<Event> {
    console.log("Fetching event with ID:", eventId);
    try {
      const response = await apiClient.get<any>(`/events/${eventId}`);
      console.log("Event API raw response:", response);
      
      // Handle different response formats
      let eventData: Event;
      if (response.data && typeof response.data === 'object') {
        // Standard ApiResponse format
        eventData = response.data;
      } else if (response && typeof response === 'object' && response.id) {
        // Direct event object
        eventData = response;
      } else {
        throw new Error("Invalid response format");
      }
      
      console.log("Processed event data:", eventData);
      return eventData;
    } catch (error) {
      console.error("Event API error:", error);
      throw error;
    }
  },

  // Get user's events (for hosts)
  async getUserEvents(): Promise<Event[]> {
    const response = await apiClient.get<Event[]>("/hosts/me/events");
    return response;
  },

  // Get drafts (filter by status on frontend)
  async getDrafts(): Promise<Event[]> {
    const events = await this.getUserEvents();
    return events.filter(event => event.status === 'draft');
  },

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/hosts/me/events/${eventId}`);
  },

  // Publish draft (change status from draft to active)
  async publishEvent(eventId: string): Promise<Event> {
    return await this.updateEvent(eventId, { status: "active" });
  },

  // Update only the status field (to avoid foreign key issues)
  async updateEventStatus(eventId: string, status: "draft" | "active" | "cancelled"): Promise<Event> {
    // First get the current event data
    const currentEvent = await apiClient.get<Event>(`/events/${eventId}`);
    
    // Then update with all current data plus the new status
    const updateData = {
      Title: currentEvent.title,
      Description: currentEvent.description,
      StartDate: currentEvent.start_date,
      StartTime: currentEvent.start_time,
      EndTime: currentEvent.end_time,
      Location: currentEvent.location,
      Tags: currentEvent.tags,
      BannerImageURL: currentEvent.banner_image_url,
      EventType: currentEvent.event_type,
      Status: status
    };
    
    const response = await apiClient.put<Event>(`/hosts/me/events/${eventId}`, updateData);
    return response;
  },

  // Bulk update all draft events to active (temporary fix)
  async publishAllDrafts(): Promise<Event[]> {
    const events = await this.getUserEvents();
    const draftEvents = events.filter(event => event.status === 'draft');
    
    const publishedEvents = await Promise.all(
      draftEvents.map(event => this.updateEvent(event.id, { status: "active" }))
    );
    
    return publishedEvents;
  },
};