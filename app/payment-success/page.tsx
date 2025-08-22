"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const totalAmount = searchParams.get('amount') || '1,411.80';
  const eventTitle = searchParams.get('event') || 'Afrochella Nights';
  const ticketType = searchParams.get('ticketType') || 'Standard Ticket';
  const quantity = searchParams.get('quantity') || '1';

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-12 w-12 text-white" />
          </div>
          
          {/* Success Message */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">
              Payment Success!
            </h1>
            <p className="text-gray-300 text-lg">
              Your payment has been processed successfully
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Your tickets are being generated and will be sent to your email within a few minutes
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Please check your spam folder if you don't see the email in your inbox
            </p>
          </div>
          
          {/* Event Details */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-600 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-center">Event Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Event:</span>
                <span className="font-semibold">{eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Type:</span>
                <span>{ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span>{quantity}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-600 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-center">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Payment:</span>
                <span className="font-bold text-lg">₦{totalAmount}</span>
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
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <Button
              className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-[#D72638]/25 hover:shadow-xl transition-all duration-300"
            >
              Get Ticket
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-gray-600 text-black bg-white hover:bg-gray-100 hover:text-black py-3 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Receipt
            </Button>
            
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full text-gray-400 py-3 flex items-center justify-center gap-2 hover:bg-transparent hover:text-gray-400"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}