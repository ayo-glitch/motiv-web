"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, CreditCard } from "lucide-react";

interface SelectedTicket {
  ticket: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onPayNow: () => void;
  attendeeData: {
    fullName: string;
    email: string;
  };
  totalPrice: number;
  selectedTickets: SelectedTicket[];
}

export function OrderSummaryModal({
  isOpen,
  onClose,
  onBack,
  onPayNow,
  attendeeData,
  totalPrice,
  selectedTickets,
}: OrderSummaryModalProps) {
  const tax = 11.80;
  const orderTotal = totalPrice + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-black hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-lg font-semibold">Order Summary</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="text-center mb-6">
            <div className="space-y-2">
              {selectedTickets.map((item, index) => (
                <div key={item.ticket.id} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium inline-block mx-1">
                  {item.ticket.name} x{item.quantity}
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <p>{attendeeData.fullName}</p>
              <p>{attendeeData.email}</p>
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block mt-1">
                Paystack
              </div>
            </div>
          </div>
          
          <div className="space-y-3 border-t border-gray-600 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Sub Total:</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Tax:</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-3">
              <span>Order Total:</span>
              <span className="text-green-500">₦{orderTotal.toLocaleString()}</span>
            </div>
          </div>
          
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold mt-6 flex items-center justify-center gap-2"
            onClick={onPayNow}
          >
            <CreditCard className="h-5 w-5" />
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}