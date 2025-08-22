"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaystackPayment } from "./PaystackPayment";
import {
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Ticket,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const attendeeSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type AttendeeFormData = z.infer<typeof attendeeSchema>;

interface AttendeeInfo extends AttendeeFormData {
  id: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    start_date: string;
    start_time: string;
    end_time: string;
    location: string;
    banner_image_url?: string;
  };
  selectedTickets: Array<{
    ticketTypeId: string;
    ticketTypeName: string;
    quantity: number;
    price: number;
  }>;
  userEmail: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  event,
  selectedTickets,
  userEmail,
}: PaymentModalProps) {
  const [step, setStep] = useState<"details" | "payment">("details");
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);

  // Calculate total number of tickets
  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      email: userEmail,
    },
  });

  // Calculate totals
  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );
  const processingFee = subtotal * 0.015; // 1.5% processing fee
  const total = subtotal + processingFee;

  const onSubmitAttendeeDetails = (data: AttendeeFormData) => {
    const newAttendee: AttendeeInfo = {
      ...data,
      id: `attendee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedAttendees = [...attendees];
    updatedAttendees[currentAttendeeIndex] = newAttendee;
    setAttendees(updatedAttendees);

    // Check if we need more attendees
    if (currentAttendeeIndex + 1 < totalTickets) {
      // Move to next attendee
      setCurrentAttendeeIndex(currentAttendeeIndex + 1);

      // Reset form for next attendee, but keep email if it's the first attendee's email
      reset({
        fullName: "",
        email: currentAttendeeIndex === 0 ? userEmail : "",
        phone: "",
      });

      toast.success(`Attendee ${currentAttendeeIndex + 1} details saved!`);
    } else {
      // All attendees collected, proceed to payment
      setStep("payment");
    }
  };

  const goToPreviousAttendee = () => {
    if (currentAttendeeIndex > 0) {
      // Save current form data first
      const currentData = {
        fullName: register("fullName").name,
        email: register("email").name,
        phone: register("phone").name,
      };

      setCurrentAttendeeIndex(currentAttendeeIndex - 1);

      // Load previous attendee data if exists
      const prevAttendee = attendees[currentAttendeeIndex - 1];
      if (prevAttendee) {
        setValue("fullName", prevAttendee.fullName);
        setValue("email", prevAttendee.email);
        setValue("phone", prevAttendee.phone);
      }
    }
  };

  const skipToPayment = () => {
    // Fill remaining attendees with the first attendee's data
    const firstAttendee = attendees[0];
    if (firstAttendee) {
      const filledAttendees = Array(totalTickets)
        .fill(null)
        .map(
          (_, index) =>
            attendees[index] || {
              ...firstAttendee,
              id: `attendee_${Date.now()}_${index}`,
            }
        );
      setAttendees(filledAttendees);
      setStep("payment");
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    toast.success("Payment successful! Check your email for ticket details.");
    onClose();
    reset();
    setStep("details");
    setAttendees([]);
    setCurrentAttendeeIndex(0);

    // Redirect to My Raves page after a short delay
    setTimeout(() => {
      window.location.href = "/my-raves";
    }, 2000);
  };

  const handlePaymentClose = () => {
    // Close the entire modal when Paystack payment starts
    // This provides a better UX by removing z-index conflicts
    onClose();
  };

  const handleModalClose = () => {
    onClose();
    reset();
    setStep("details");
    setAttendees([]);
    setCurrentAttendeeIndex(0);
  };

  if (selectedTickets.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === "details"
              ? `Attendee Details (${
                  currentAttendeeIndex + 1
                } of ${totalTickets})`
              : "Complete Payment"}
          </DialogTitle>
          {step === "details" && totalTickets > 1 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                {Array(totalTickets)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < currentAttendeeIndex
                          ? "bg-green-500"
                          : index === currentAttendeeIndex
                          ? "bg-[#D72638]"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-gray-600">
                {attendees.length} of {totalTickets} attendees completed
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.start_date), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {event.start_time} - {event.end_time}
                </div>
              </div>

              <Separator />

              {/* Ticket Summary */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Selected Tickets
                </h4>
                <div className="space-y-2">
                  {selectedTickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{ticket.ticketTypeName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {ticket.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₦{(ticket.price * ticket.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₦{ticket.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee (1.5%)</span>
                  <span>₦{processingFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Content */}
          <div>
            {step === "details" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {totalTickets > 1
                      ? `Attendee ${currentAttendeeIndex + 1} Information`
                      : "Attendee Information"}
                  </CardTitle>
                  {totalTickets > 1 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Please provide details for each person attending the event
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit(onSubmitAttendeeDetails)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email address"
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      {currentAttendeeIndex > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousAttendee}
                          className="flex-1"
                        >
                          Previous
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleModalClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>

                      {totalTickets > 1 &&
                        currentAttendeeIndex === 0 &&
                        attendees.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={skipToPayment}
                            className="flex-1"
                          >
                            Use Same Details for All
                          </Button>
                        )}

                      <Button
                        type="submit"
                        className="flex-1 bg-[#D72638] hover:bg-[#B91E2F]"
                      >
                        {currentAttendeeIndex + 1 < totalTickets
                          ? `Next Attendee (${
                              currentAttendeeIndex + 2
                            }/${totalTickets})`
                          : "Continue to Payment"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendees.length > 0 && (
                    <div className="space-y-4">
                      {/* Attendees Summary */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-3">
                          {attendees.length === 1
                            ? "Attendee Details"
                            : `${attendees.length} Attendees`}
                        </h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {attendees.map((attendee, index) => (
                            <div
                              key={attendee.id}
                              className="border-l-4 border-[#D72638] pl-3"
                            >
                              <div className="font-medium text-sm">
                                Attendee {index + 1}
                              </div>
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span>{attendee.fullName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  <span>{attendee.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  <span>{attendee.phone}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Button */}
                      <PaystackPayment
                        email={attendees[0].email} // Use first attendee's email for payment
                        eventId={event.id}
                        eventTitle={event.title}
                        ticketDetails={selectedTickets}
                        attendeeData={attendees[0]} // Primary attendee for payment
                        allAttendees={attendees} // Pass all attendees
                        onSuccess={handlePaymentSuccess}
                        onClose={handlePaymentClose}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("details")}
                        className="w-full"
                      >
                        Back to Attendee Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
