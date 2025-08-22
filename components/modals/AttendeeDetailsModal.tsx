"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface SelectedTicket {
  ticket: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface AttendeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  eventData: {
    title: string;
    date: string;
  };
  attendeeData: {
    fullName: string;
    email: string;
    phone: string;
    acceptTerms: boolean;
  };
  setAttendeeData: (data: any) => void;
  totalPrice: number;
  totalTickets: number;
  selectedTickets: SelectedTicket[];
}

export function AttendeeDetailsModal({
  isOpen,
  onClose,
  onContinue,
  eventData,
  attendeeData,
  setAttendeeData,
  totalPrice,
  totalTickets,
  selectedTickets,
}: AttendeeDetailsModalProps) {
  const isFormValid = attendeeData.fullName && 
                     attendeeData.email && 
                     attendeeData.phone && 
                     attendeeData.acceptTerms;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-black hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-lg font-semibold">Attendee Details</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">{eventData.title}</h3>
            <p className="text-gray-400 text-sm">{eventData.date}</p>
            <div className="space-y-2 mt-3">
              {selectedTickets.map((item, index) => (
                <div key={item.ticket.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block mx-1">
                  {item.ticket.name}: {item.quantity} Ticket{item.quantity > 1 ? 's' : ''}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter attendee full name"
                value={attendeeData.fullName}
                onChange={(e) => setAttendeeData((prev: any) => ({...prev, fullName: e.target.value}))}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={attendeeData.email}
                onChange={(e) => setAttendeeData((prev: any) => ({...prev, email: e.target.value}))}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-white">Mobile / Phone Number</Label>
              <Input
                id="phone"
                placeholder="+234 7000 000 000"
                value={attendeeData.phone}
                onChange={(e) => setAttendeeData((prev: any) => ({...prev, phone: e.target.value}))}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              />
            </div>
            
            <div className="flex items-start gap-2 mt-4">
              <Checkbox
                id="terms"
                checked={attendeeData.acceptTerms}
                onCheckedChange={(checked) => setAttendeeData((prev: any) => ({...prev, acceptTerms: !!checked}))}
                className="border-gray-600 data-[state=checked]:bg-[#D72638] data-[state=checked]:border-[#D72638]"
              />
              <Label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                I accept the Terms of Service and have read the Privacy Policy
              </Label>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Total:</span>
              <span className="font-bold text-lg">₦{totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Qty: {totalTickets}</span>
                <span className="text-gray-400">Total: ₦{totalPrice.toLocaleString()}</span>
              </div>
              
              <Button
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3 font-semibold"
                onClick={onContinue}
                disabled={!isFormValid}
              >
                Continue to Checkout
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}