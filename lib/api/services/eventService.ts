import { apiClient } from '../client';
import { 
  Event, 
  CreateEventRequest, 
  UpdateEventRequest,
  PaginatedResponse 
} from '@/lib/types/api';

export const eventService = {
  // Public event endpoints
  async getAllEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    eventType?: string;
  }): Promise<PaginatedResponse<Event>> {
    // Convert frontend params to backend params
    const backendParams: any = {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      tags: params?.tags,
      location: params?.location,
      date_from: params?.dateFrom,
      date_to: params?.dateTo,
      event_type: params?.eventType,
    };

    // Remove undefined values
    Object.keys(backendParams).forEach(key => {
      if (backendParams[key] === undefined || backendParams[key] === '') {
        delete backendParams[key];
      }
    });

    const response = await apiClient.get<any>('/events', backendParams);
    
    // Handle both old format (simple array) and new format (paginated response)
    if (Array.isArray(response)) {
      // Old backend format - convert to paginated response and sort by latest
      const sortedEvents = response.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.start_date).getTime();
        const dateB = new Date(b.createdAt || b.start_date).getTime();
        return dateB - dateA; // Latest first
      });
      return {
        data: sortedEvents,
        total: sortedEvents.length,
        page: params?.page || 1,
        limit: params?.limit || 12,
        hasMore: false
      };
    }
    
    // New backend format - sort the data and return
    const paginatedResponse = response as PaginatedResponse<Event>;
    if (paginatedResponse.data) {
      paginatedResponse.data = paginatedResponse.data.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.start_date).getTime();
        const dateB = new Date(b.createdAt || b.start_date).getTime();
        return dateB - dateA; // Latest first
      });
    }
    return paginatedResponse;
  },

  async getEventById(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  // Host event endpoints (require authentication)
  async getMyEvents(): Promise<{ data: Event[] }> {
    const events = await apiClient.get<Event[]>('/hosts/me/events');
    // Sort events by latest first (createdAt or start_date as fallback)
    const sortedEvents = events.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.start_date).getTime();
      const dateB = new Date(b.createdAt || b.start_date).getTime();
      return dateB - dateA; // Latest first
    });
    return { data: sortedEvents };
  },

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    return apiClient.post<Event>('/hosts/me/events', eventData);
  },

  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
    // Map frontend field names to backend field names (Go expects capitalized fields)
    const updateData: any = {};
    
    if (eventData.title !== undefined) updateData.Title = eventData.title;
    if (eventData.description !== undefined) updateData.Description = eventData.description;
    if (eventData.location !== undefined) updateData.Location = eventData.location;
    if (eventData.status !== undefined) updateData.Status = eventData.status;
    
    return apiClient.put<Event>(`/hosts/me/events/${id}`, updateData);
  },

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`/hosts/me/events/${id}`);
  },

  // Bulk update all draft events to active (temporary fix)
  async publishAllDrafts(): Promise<Event[]> {
    try {
      const eventsResponse = await this.getMyEvents();
      const events = eventsResponse.data;
      const draftEvents = events.filter(event => event.status === 'draft');
      
      if (draftEvents.length === 0) {
        return [];
      }
      
      // Update each event individually and handle errors gracefully
      const publishedEvents: Event[] = [];
      
      for (const event of draftEvents) {
        try {
          // Only update the status field
          const updatedEvent = await apiClient.put<Event>(`/hosts/me/events/${event.id}`, { 
            Status: "active" 
          });
          publishedEvents.push(updatedEvent);
        } catch (error) {
          console.error(`Failed to publish event ${event.id}:`, error);
          // Continue with other events even if one fails
        }
      }
      
      return publishedEvents;
    } catch (error) {
      console.error('Failed to publish drafts:', error);
      throw error;
    }
  },

  // Event search and filtering
  async searchEvents(query: string, filters?: {
    tags?: string[];
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    eventType?: 'free' | 'ticketed';
    priceMin?: number;
    priceMax?: number;
  }): Promise<Event[]> {
    const params: any = {
      search: query,
      location: filters?.location,
      date_from: filters?.dateFrom,
      date_to: filters?.dateTo,
      event_type: filters?.eventType,
      tags: filters?.tags?.join(','),
    };
    
    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    
    const response = await apiClient.get<PaginatedResponse<Event>>('/events', params);
    return response.data;
  },

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];
    return apiClient.get<string[]>('/events/suggestions', { q: query });
  }
};