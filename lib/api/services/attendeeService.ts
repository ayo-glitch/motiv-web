import { apiClient } from '../client';
import { PaginatedResponse } from '@/lib/types/api';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  event_title: string;
  ticket_type: string;
  purchase_date: string;
  amount: number;
  status: 'active' | 'checked_in' | 'cancelled';
  check_in_time?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendeeFilters {
  event_id?: string;
  ticket_type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const attendeeService = {
  // Get all attendees for host's events
  async getAttendees(filters: AttendeeFilters = {}): Promise<PaginatedResponse<Attendee>> {
    const params = new URLSearchParams();
    
    if (filters.event_id) params.append('event_id', filters.event_id);
    if (filters.ticket_type) params.append('ticket_type', filters.ticket_type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return apiClient.get<PaginatedResponse<Attendee>>(`/hosts/me/attendees?${params.toString()}`);
  },

  // Get attendees for a specific event
  async getEventAttendees(eventId: string, filters: Omit<AttendeeFilters, 'event_id'> = {}): Promise<PaginatedResponse<Attendee>> {
    const params = new URLSearchParams();
    
    if (filters.ticket_type) params.append('ticket_type', filters.ticket_type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return apiClient.get<PaginatedResponse<Attendee>>(`/hosts/me/events/${eventId}/attendees?${params.toString()}`);
  },

  // Get single attendee
  async getAttendee(attendeeId: string): Promise<Attendee> {
    return apiClient.get<Attendee>(`/hosts/me/attendees/${attendeeId}`);
  },

  // Check in attendee
  async checkInAttendee(attendeeId: string): Promise<Attendee> {
    return apiClient.post<Attendee>(`/hosts/me/attendees/${attendeeId}/check-in`);
  },

  // Cancel attendee ticket
  async cancelAttendee(attendeeId: string, reason?: string): Promise<void> {
    return apiClient.post(`/hosts/me/attendees/${attendeeId}/cancel`, { reason });
  },

  // Update attendee information
  async updateAttendee(attendeeId: string, data: Partial<Pick<Attendee, 'name' | 'email' | 'phone'>>): Promise<Attendee> {
    return apiClient.put<Attendee>(`/hosts/me/attendees/${attendeeId}`, data);
  },

  // Export attendees to CSV
  async exportAttendees(filters: AttendeeFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.event_id) params.append('event_id', filters.event_id);
    if (filters.ticket_type) params.append('ticket_type', filters.ticket_type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hosts/me/attendees/export?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('motiv_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export attendees');
    }

    return response.blob();
  },

  // Get attendee statistics
  async getAttendeeStats(): Promise<{
    total_attendees: number;
    checked_in: number;
    active: number;
    cancelled: number;
    by_event: Array<{
      event_id: string;
      event_title: string;
      attendee_count: number;
    }>;
  }> {
    return apiClient.get('/hosts/me/attendees/stats');
  },
};