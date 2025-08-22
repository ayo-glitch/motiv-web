import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery 
} from '@tanstack/react-query';
import { eventService } from '@/lib/api/services';
import { 
  Event, 
  CreateEventRequest, 
  UpdateEventRequest,
  PaginatedResponse 
} from '@/lib/types/api';
import { toast } from 'sonner';

// Get all events with pagination
export const useEvents = (params?: {
  search?: string;
  tags?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  eventType?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ['events', 'all', params],
    queryFn: ({ pageParam = 1 }) => 
      eventService.getAllEvents({ 
        page: pageParam, 
        limit: 12,
        ...params 
      }),
    getNextPageParam: (lastPage: PaginatedResponse<Event>) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get host's events
export const useMyEvents = () => {
  return useQuery({
    queryKey: ['events', 'my-events'],
    queryFn: eventService.getMyEvents,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search events
export const useSearchEvents = (
  query: string,
  filters?: {
    tags?: string[];
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    priceMin?: number;
    priceMax?: number;
  }
) => {
  return useQuery({
    queryKey: ['events', 'search', query, filters],
    queryFn: () => eventService.searchEvents(query, filters),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

// Get search suggestions
export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['events', 'suggestions', query],
    queryFn: () => eventService.getSearchSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Event mutations for hosts
export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (eventData: CreateEventRequest) => eventService.createEvent(eventData),
    onSuccess: (newEvent: Event) => {
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) => 
      eventService.updateEvent(id, data),
    onSuccess: (updatedEvent: Event) => {
      // Update specific event in cache
      queryClient.setQueryData(['events', updatedEvent.id], updatedEvent);
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events', 'my-events'] });
      toast.success('Event updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['events', deletedId] });
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    }
  });

  const publishAllDraftsMutation = useMutation({
    mutationFn: () => eventService.publishAllDrafts(),
    onSuccess: () => {
      // Invalidate events list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('All draft events have been published!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to publish draft events');
    }
  });

  return {
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    publishAllDrafts: publishAllDraftsMutation.mutate,
    
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isPublishingDrafts: publishAllDraftsMutation.isPending,
  };
};