import { apiClient } from '../client';

export interface Review {
  id: string;
  event_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  helpful: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: string]: number;
  };
}

export interface CreateReviewRequest {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export const reviewService = {
  // Get reviews for an event
  async getEventReviews(eventId: string, page: number = 1, limit: number = 10): Promise<ReviewsResponse> {
    const response = await apiClient.get<{ data: ReviewsResponse }>(`/events/${eventId}/reviews`, {
      page,
      limit
    });
    return response.data;
  },

  // Create a new review
  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<{ data: Review }>('/reviews', reviewData);
    return response.data;
  },

  // Update a review
  async updateReview(reviewId: string, updates: { rating?: number; comment?: string }): Promise<void> {
    await apiClient.put(`/reviews/${reviewId}`, updates);
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  // Mark review as helpful
  async markReviewHelpful(reviewId: string): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/helpful`);
  },

  // Get host reviews
  async getHostReviews(page: number = 1, limit: number = 10): Promise<ReviewsResponse> {
    const response = await apiClient.get<{ data: ReviewsResponse }>('/hosts/me/reviews', {
      page,
      limit
    });
    return response.data;
  }
};