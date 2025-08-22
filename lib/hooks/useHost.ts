import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hostService, HostDashboardStats, MonthlyRevenueData, Review, ReviewStats, Payout, HostEarnings } from '@/lib/api/services/hostService';
import { toast } from 'sonner';

// Dashboard & Analytics
export const useHostDashboard = () => {
  return useQuery({
    queryKey: ['host', 'dashboard'],
    queryFn: hostService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMonthlyRevenue = (year?: number) => {
  return useQuery({
    queryKey: ['host', 'revenue', 'monthly', year],
    queryFn: () => hostService.getMonthlyRevenue(year),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEventAnalytics = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId, 'analytics'],
    queryFn: () => hostService.getEventAnalytics(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Reviews
export const useHostReviews = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['host', 'reviews', page, limit],
    queryFn: () => hostService.getHostReviews(page, limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useEventReviews = (eventId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['events', eventId, 'reviews', page, limit],
    queryFn: () => hostService.getEventReviews(eventId, page, limit),
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: ({ eventId, rating, comment }: { eventId: string; rating: number; comment: string }) =>
      hostService.createReview(eventId, rating, comment),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'reviews'] });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: string) => hostService.markReviewHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Marked as helpful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark as helpful');
    },
  });

  return {
    createReview: createReviewMutation.mutate,
    markHelpful: markHelpfulMutation.mutate,
    isCreatingReview: createReviewMutation.isPending,
    isMarkingHelpful: markHelpfulMutation.isPending,
  };
};

// Payments & Earnings
export const useHostEarnings = () => {
  return useQuery({
    queryKey: ['host', 'earnings'],
    queryFn: hostService.getEarnings,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useHostPayouts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['host', 'payouts', page, limit],
    queryFn: () => hostService.getPayouts(page, limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePendingPayouts = () => {
  return useQuery({
    queryKey: ['host', 'payouts', 'pending'],
    queryFn: hostService.getPendingPayouts,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useEventRevenue = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId, 'revenue'],
    queryFn: () => hostService.getEventRevenue(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Analytics tracking
export const useEventViewTracking = () => {
  const recordViewMutation = useMutation({
    mutationFn: (eventId: string) => hostService.recordEventView(eventId),
    // Silent mutation - no success/error handling needed
  });

  return {
    recordView: recordViewMutation.mutate,
  };
};