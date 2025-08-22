import { apiClient } from '../client';

export interface HostDashboardStats {
  total_events: number;
  total_revenue: number;
  total_attendees: number;
  total_views?: number;
  monthly_revenue: number;
  revenue_change?: number;
  events_change?: number;
  attendees_change?: number;
  views_change?: number;
}

export interface MonthlyRevenueData {
  month: number;
  revenue: number;
  attendees: number;
  count: number;
}

export interface EventAnalytics {
  total_views: number;
  unique_views: number;
  tickets_sold: number;
  revenue: number;
  conversion_rate: number;
}

export interface Review {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  event_title: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}

export interface Payout {
  id: string;
  hostId: string;
  eventId: string;
  event: {
    id: string;
    title: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  reference: string;
  payoutDate: string;
  processedAt?: string;
  createdAt: string;
}

export interface HostEarnings {
  total_earnings: number;
  monthly_earnings: number;
  pending_payouts: number;
  next_payout_date: string;
}

export const hostService = {
  // Dashboard & Analytics
  async getDashboardStats(): Promise<HostDashboardStats> {
    try {
      const response = await apiClient.get<{ data: HostDashboardStats }>('/hosts/me/analytics/dashboard');
      return response.data;
    } catch (error) {
      // If the endpoint doesn't exist, return default stats
      return {
        total_events: 0,
        total_revenue: 0,
        total_attendees: 0,
        monthly_revenue: 0,
        total_views: 0,
        revenue_change: 0,
        events_change: 0,
        attendees_change: 0,
        views_change: 0
      };
    }
  },

  async getMonthlyRevenue(year?: number): Promise<{ data: MonthlyRevenueData[] }> {
    try {
      const params = year ? { year: year.toString() } : {};
      const response = await apiClient.get<{ data: MonthlyRevenueData[] }>('/hosts/me/analytics/revenue', params);
      return { data: response.data };
    } catch (error) {
      // If the endpoint doesn't exist, return empty data
      return { data: [] };
    }
  },

  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    const response = await apiClient.get<{ data: { performance: EventAnalytics } }>(`/events/${eventId}/analytics`);
    return response.data.performance;
  },

  // Reviews
  async getHostReviews(page = 1, limit = 10): Promise<{ data: Review[]; stats: ReviewStats; has_more?: boolean }> {
    try {
      const response = await apiClient.get<{ data: { reviews: Review[]; stats: ReviewStats } }>('/hosts/me/reviews', {
        page,
        limit,
      });
      return {
        data: response.data.reviews,
        stats: response.data.stats,
        has_more: response.data.reviews.length === limit
      };
    } catch (error) {
      // If the endpoint doesn't exist, return empty data
      return {
        data: [],
        stats: {
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: {}
        },
        has_more: false
      };
    }
  },

  async getEventReviews(eventId: string, page = 1, limit = 10): Promise<{ data: Review[]; stats: ReviewStats; has_more?: boolean }> {
    const response = await apiClient.get<{ data: { reviews: Review[]; stats: ReviewStats } }>(`/events/${eventId}/reviews`, {
      page,
      limit,
    });
    return {
      data: response.data.reviews,
      stats: response.data.stats,
      has_more: response.data.reviews.length === limit
    };
  },

  async createReview(eventId: string, rating: number, comment: string): Promise<Review> {
    const response = await apiClient.post<{ data: Review }>('/reviews', {
      eventId,
      rating,
      comment,
    });
    return response.data;
  },

  async markReviewHelpful(reviewId: string): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/helpful`);
  },

  // Payments & Earnings
  async getEarnings(): Promise<HostEarnings> {
    const response = await apiClient.get<{ data: HostEarnings }>('/hosts/me/payments/earnings');
    return response.data;
  },

  async getPayouts(page = 1, limit = 10): Promise<Payout[]> {
    const response = await apiClient.get<{ data: Payout[] }>('/hosts/me/payments/payouts', {
      page,
      limit,
    });
    return response.data;
  },

  async getPendingPayouts(): Promise<Payout[]> {
    const response = await apiClient.get<{ data: Payout[] }>('/hosts/me/payments/pending');
    return response.data;
  },

  async getEventRevenue(eventId: string): Promise<number> {
    const response = await apiClient.get<{ data: { revenue: number } }>(`/events/${eventId}/revenue`);
    return response.data.revenue;
  },

  // Analytics tracking
  async recordEventView(eventId: string): Promise<void> {
    try {
      await apiClient.post(`/events/${eventId}/view`);
    } catch (error) {
      // Silently fail for analytics tracking
      console.warn('Failed to record event view:', error);
    }
  },
};