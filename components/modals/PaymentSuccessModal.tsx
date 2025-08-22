"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Check, Download } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetTicket: () => void;
  totalPrice: number;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  onGetTicket,
  totalPrice,
}: PaymentSuccessModalProps) {
  const tax = 11.80;
  const orderTotal = totalPrice + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Payment Success</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-black hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-4 mt-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-green-500 mb-2">Payment Success!</h3>
            <p className="text-gray-300 text-sm">
              Your payment has been processed successfully
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Payment</span>
              <span className="font-bold">₦{orderTotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ref Number:</span>
              <span>000001702287</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Date:</span>
              <span>28 July 2025, 13:22</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Method:</span>
              <span>Paystack</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sender Name:</span>
              <span>Teniola</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3 font-semibold"
              onClick={onGetTicket}
            >
              Get Ticket
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-2 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}