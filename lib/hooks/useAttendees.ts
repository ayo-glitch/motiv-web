import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendeeService, Attendee, AttendeeFilters } from '@/lib/api/services/attendeeService';
import { toast } from 'sonner';

// Get all attendees for host's events
export const useAttendees = (filters: AttendeeFilters = {}) => {
  return useQuery({
    queryKey: ['attendees', filters],
    queryFn: () => attendeeService.getAttendees(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get attendees for a specific event
export const useEventAttendees = (eventId: string, filters: Omit<AttendeeFilters, 'event_id'> = {}) => {
  return useQuery({
    queryKey: ['events', eventId, 'attendees', filters],
    queryFn: () => attendeeService.getEventAttendees(eventId, filters),
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get single attendee
export const useAttendee = (attendeeId: string) => {
  return useQuery({
    queryKey: ['attendees', attendeeId],
    queryFn: () => attendeeService.getAttendee(attendeeId),
    enabled: !!attendeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get attendee statistics
export const useAttendeeStats = () => {
  return useQuery({
    queryKey: ['attendees', 'stats'],
    queryFn: attendeeService.getAttendeeStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Attendee mutations
export const useAttendeeMutations = () => {
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: (attendeeId: string) => attendeeService.checkInAttendee(attendeeId),
    onSuccess: (updatedAttendee) => {
      // Update attendee in cache
      queryClient.setQueryData(['attendees', updatedAttendee.id], updatedAttendee);
      // Invalidate attendees lists
      queryClient.invalidateQueries({ queryKey: ['attendees'] });
      queryClient.invalidateQueries({ queryKey: ['events', updatedAttendee.event_id, 'attendees'] });
      toast.success('Attendee checked in successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check in attendee');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ attendeeId, reason }: { attendeeId: string; reason?: string }) =>
      attendeeService.cancelAttendee(attendeeId, reason),
    onSuccess: (_, { attendeeId }) => {
      // Invalidate attendees lists
      queryClient.invalidateQueries({ queryKey: ['attendees'] });
      queryClient.removeQueries({ queryKey: ['attendees', attendeeId] });
      toast.success('Attendee ticket cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel attendee ticket');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ attendeeId, data }: { 
      attendeeId: string; 
      data: Partial<Pick<Attendee, 'name' | 'email' | 'phone'>> 
    }) => attendeeService.updateAttendee(attendeeId, data),
    onSuccess: (updatedAttendee) => {
      // Update attendee in cache
      queryClient.setQueryData(['attendees', updatedAttendee.id], updatedAttendee);
      // Invalidate attendees lists
      queryClient.invalidateQueries({ queryKey: ['attendees'] });
      toast.success('Attendee information updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update attendee information');
    },
  });

  const exportMutation = useMutation({
    mutationFn: (filters: AttendeeFilters = {}) => attendeeService.exportAttendees(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendees-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Attendees exported successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export attendees');
    },
  });

  return {
    checkIn: checkInMutation.mutate,
    cancel: cancelMutation.mutate,
    update: updateMutation.mutate,
    export: exportMutation.mutate,
    
    isCheckingIn: checkInMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isUpdating: updateMutation.isPending,
    isExporting: exportMutation.isPending,
  };
};