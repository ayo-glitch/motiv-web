import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/services';
import { User, Event } from '@/lib/types/api';
import { toast } from 'sonner';

// Get user's tickets
export const useUserTickets = () => {
  return useQuery({
    queryKey: ['user', 'tickets'],
    queryFn: userService.getMyTickets,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get user's wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ['user', 'wishlist'],
    queryFn: userService.getMyWishlist,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Check if event is in wishlist
export const useIsInWishlist = (eventId: string) => {
  return useQuery({
    queryKey: ['user', 'wishlist', 'check', eventId],
    queryFn: () => userService.isInWishlist(eventId),
    enabled: !!eventId && typeof window !== 'undefined',
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Wishlist mutations
export const useWishlistMutations = () => {
  const queryClient = useQueryClient();

  const addToWishlistMutation = useMutation({
    mutationFn: (eventId: string) => userService.addToWishlist(eventId),
    onMutate: async (eventId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', 'wishlist', 'check', eventId] });
      
      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['user', 'wishlist', 'check', eventId]);
      
      // Optimistically update to true
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], true);
      
      // Return a context object with the snapshotted value
      return { previousStatus };
    },
    onSuccess: (_, eventId) => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user', 'wishlist'] });
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], true);
      toast.success('Added to wishlist!');
    },
    onError: (error: any, eventId, context) => {
      // Rollback to previous value on error
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], context?.previousStatus);
      toast.error(error.message || 'Failed to add to wishlist');
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (eventId: string) => userService.removeFromWishlist(eventId),
    onMutate: async (eventId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', 'wishlist', 'check', eventId] });
      
      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['user', 'wishlist', 'check', eventId]);
      
      // Optimistically update to false
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], false);
      
      // Return a context object with the snapshotted value
      return { previousStatus };
    },
    onSuccess: (_, eventId) => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user', 'wishlist'] });
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], false);
      toast.success('Removed from wishlist');
    },
    onError: (error: any, eventId, context) => {
      // Rollback to previous value on error
      queryClient.setQueryData(['user', 'wishlist', 'check', eventId], context?.previousStatus);
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  });

  // Toggle wishlist status
  const toggleWishlist = async (eventId: string, isCurrentlyInWishlist: boolean) => {
    if (isCurrentlyInWishlist) {
      removeFromWishlistMutation.mutate(eventId);
    } else {
      addToWishlistMutation.mutate(eventId);
    }
  };

  return {
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    toggleWishlist,
    
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    isTogglingWishlist: addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
  };
};