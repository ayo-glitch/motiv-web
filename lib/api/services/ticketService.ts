import { apiClient } from '../client';
import { 
  Ticket, 
  PurchaseTicketRequest,
  TicketType 
} from '@/lib/types/api';

export const ticketService = {
  async purchaseTicket(purchaseData: PurchaseTicketRequest): Promise<Ticket> {
    return apiClient.post<Ticket>('/tickets/purchase', purchaseData);
  },

  async getTicketById(id: string): Promise<Ticket> {
    return apiClient.get<Ticket>(`/tickets/${id}`);
  },

  async getUserTickets(): Promise<Ticket[]> {
    return apiClient.get<Ticket[]>('/users/me/tickets');
  },

  // Get available ticket types for an event
  // Note: This endpoint might need to be added to backend
  async getEventTicketTypes(eventId: string): Promise<TicketType[]> {
    try {
      return apiClient.get<TicketType[]>(`/events/${eventId}/ticket-types`);
    } catch (error) {
      // Fallback - return empty array if endpoint doesn't exist yet
      console.warn('Ticket types endpoint not implemented yet');
      return [];
    }
  },

  // Validate ticket (for QR code scanning)
  async validateTicket(ticketId: string, qrCode: string): Promise<{ valid: boolean; ticket?: Ticket }> {
    return apiClient.post<{ valid: boolean; ticket?: Ticket }>('/tickets/validate', {
      ticketId,
      qrCode
    });
  },

  // RSVP for free events
  async rsvpFreeEvent(rsvpData: {
    eventId: string;
    attendeeFullName: string;
    attendeeEmail: string;
    attendeePhone: string;
  }): Promise<{ message: string; ticket: Ticket }> {
    return apiClient.post<{ message: string; ticket: Ticket }>('/tickets/rsvp', rsvpData);
  }
};