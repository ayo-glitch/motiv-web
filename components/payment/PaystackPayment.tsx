"use client";

import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

interface PaymentInitiationResponse {
  reference: string;
  amount: number;
  publicKey: string;
  paystackUrl: string;
  email: string;
  currency: string;
}

interface PaystackPaymentProps {
  email: string;
  eventId: string;
  eventTitle: string;
  ticketDetails: Array<{
    ticketTypeId: string;
    ticketTypeName: string;
    quantity: number;
    price: number;
  }>;
  attendeeData: {
    fullName: string;
    email: string;
    phone: string;
  };
  allAttendees?: Array<{
    fullName: string;
    email: string;
    phone: string;
  }>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PaystackPayment({
  email,
  eventId,
  eventTitle,
  ticketDetails,
  attendeeData,
  allAttendees,
  onSuccess,
  onClose,
  disabled = false,
  children,
}: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total amount
  const totalAmount = ticketDetails.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  const handlePayment = async () => {
    setIsProcessing(true);

    // Debug logging
    console.log('Starting payment for event:', eventId);
    console.log('Event title:', eventTitle);

    try {
      // First, initiate payment on the backend
      const response = await apiClient.post<PaymentInitiationResponse>(
        "/payments/initiate",
        {
          eventId,
          email,
          attendeeData,
          attendees: allAttendees || [attendeeData], // Send all attendees or just primary
          ticketDetails,
        }
      );

      const { reference, amount, publicKey } = response;

      // Configure Paystack
      const config = {
        reference,
        email,
        amount, // Amount in kobo from backend
        publicKey,
        currency: "NGN",
        metadata: {
          eventId,
          eventTitle,
          attendeeData,
          ticketDetails,
          custom_fields: [
            {
              display_name: "Event",
              variable_name: "event",
              value: eventTitle,
            },
            {
              display_name: "Attendee Name",
              variable_name: "attendee_name",
              value: attendeeData.fullName,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: attendeeData.phone,
            },
          ],
        },
      };

      // Initialize Paystack payment
      const initializePayment = usePaystackPayment(config);

      // Show feedback and close the payment modal before opening Paystack popup
      toast.info("Opening payment window...");
      onClose();

      initializePayment({
        onSuccess: async (paystackResponse: any) => {
          setIsProcessing(false);
          toast.success(
            "Payment successful! Your tickets will be processed shortly and sent to your email."
          );

          // In production, the webhook will handle ticket creation
          // Just redirect to success page or show confirmation
          onSuccess(paystackResponse.reference);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled");
          // Don't call onClose() here as the modal is already closed
        },
      });
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Payment initiation failed:", error);
      toast.error(error.response?.data?.error || "Failed to initiate payment");
    }
  };

  return (
    <>
      {children ? (
        <div onClick={handlePayment} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          onClick={handlePayment}
          disabled={disabled || isProcessing}
          className="w-full bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ₦${totalAmount.toLocaleString()}`
          )}
        </Button>
      )}
    </>
  );
}
