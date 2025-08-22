import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/lib/api/services';
import { PurchaseTicketRequest, Ticket } from '@/lib/types/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Get ticket by ID
export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketService.getTicketById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get event ticket types
export const useEventTicketTypes = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId, 'ticket-types'],
    queryFn: () => ticketService.getEventTicketTypes(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Ticket purchase mutation
export const useTicketPurchase = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (purchaseData: PurchaseTicketRequest) => 
      ticketService.purchaseTicket(purchaseData),
    onSuccess: (ticket: Ticket) => {
      // Invalidate user tickets to show new purchase
      queryClient.invalidateQueries({ queryKey: ['user', 'tickets'] });
      
      // Show success message
      toast.success('Ticket purchased successfully!');
      
      // Redirect to success page or ticket details
      router.push(`/payment-success?ticketId=${ticket.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase ticket');
    }
  });
};

// Ticket validation (for QR scanning)
export const useTicketValidation = () => {
  return useMutation({
    mutationFn: ({ ticketId, qrCode }: { ticketId: string; qrCode: string }) =>
      ticketService.validateTicket(ticketId, qrCode),
    onSuccess: (result) => {
      if (result.valid) {
        toast.success('Ticket is valid!');
      } else {
        toast.error('Invalid ticket');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to validate ticket');
    }
  });
};

// RSVP for free events
export const useRSVPFreeEvent = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (rsvpData: {
      eventId: string;
      attendeeFullName: string;
      attendeeEmail: string;
      attendeePhone: string;
    }) => ticketService.rsvpFreeEvent(rsvpData),
    onSuccess: (result) => {
      // Invalidate user tickets to show new RSVP
      queryClient.invalidateQueries({ queryKey: ['user', 'tickets'] });
      
      // Show success message
      toast.success('RSVP successful! Your free ticket has been created.');
      
      // Call the success callback if provided (to close modal)
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to my-raves page to show the ticket
      router.push('/my-raves');
    },
    onError: (error: any) => {
      if (error.message && error.message.includes('already have a ticket')) {
        toast.error('You have already RSVP\'d for this event');
      } else {
        toast.error(error.message || 'Failed to RSVP for event');
      }
    }
  });
};