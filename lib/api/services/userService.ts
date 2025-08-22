import { apiClient } from '../client';
import { 
  User, 
  Ticket, 
  Wishlist,
  Event 
} from '@/lib/types/api';

export const userService = {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/users/me', userData);
  },

  async getMyTickets(): Promise<Ticket[]> {
    return apiClient.get<Ticket[]>('/users/me/tickets');
  },

  async getMyWishlist(): Promise<Event[]> {
    const wishlistItems = await apiClient.get<Wishlist[]>('/users/me/wishlist');
    // Extract events from wishlist items, filtering out null/undefined events
    return wishlistItems
      .map(item => item.event)
      .filter(event => event != null);
  },

  async addToWishlist(eventId: string): Promise<void> {
    return apiClient.post<void>('/users/me/wishlist', { event_id: eventId });
  },

  async removeFromWishlist(eventId: string): Promise<void> {
    // Use query parameter for DELETE request
    return apiClient.delete<void>(`/users/me/wishlist?event_id=${eventId}`);
  },

  // Check if event is in user's wishlist - using dedicated endpoint for better performance
  async isInWishlist(eventId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ is_in_wishlist: boolean }>(`/users/me/wishlist/check?event_id=${eventId}`);
      return response.is_in_wishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }
};