import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, CreateReviewRequest, Review, ReviewsResponse } from '@/lib/api/services/reviewService';
import { toast } from 'sonner';

// Get reviews for an event
export const useEventReviews = (eventId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['reviews', 'event', eventId, page, limit],
    queryFn: () => reviewService.getEventReviews(eventId, page, limit),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get host reviews
export const useHostReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['reviews', 'host', page, limit],
    queryFn: () => reviewService.getHostReviews(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Review mutations
export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: CreateReviewRequest) => reviewService.createReview(reviewData),
    onSuccess: (newReview: Review) => {
      // Invalidate event reviews to refetch
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'event', newReview.event_id] 
      });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    }
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, updates }: { reviewId: string; updates: { rating?: number; comment?: string } }) => 
      reviewService.updateReview(reviewId, updates),
    onSuccess: () => {
      // Invalidate all review queries to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update review');
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      // Invalidate all review queries to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete review');
    }
  });

  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.markReviewHelpful(reviewId),
    onSuccess: () => {
      // Invalidate all review queries to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Marked as helpful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark as helpful');
    }
  });

  return {
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    markReviewHelpful: markHelpfulMutation.mutate,
    
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
    isMarkingHelpful: markHelpfulMutation.isPending,
  };
};