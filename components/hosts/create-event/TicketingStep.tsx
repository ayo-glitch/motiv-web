"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventFormData } from "@/hooks/useEventCreation";
import { TicketType } from "@/app/hosts/create-event/page";
import { ArrowLeft, Ticket, Plus, Trash2, Loader2 } from "lucide-react";

interface TicketingStepProps {
  formData: EventFormData;
  onUpdate: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft?: () => Promise<void>;
  isSaving?: boolean;
  isEdit?: boolean;
}

export function TicketingStep({ 
  formData, 
  onUpdate, 
  onNext, 
  onBack, 
  onSaveDraft, 
  isSaving = false, 
  isEdit = false 
}: TicketingStepProps) {
  const handleEventTypeChange = (eventType: "ticketed" | "free") => {
    onUpdate({ 
      eventType,
      ticketTypes: eventType === "free" ? [] : formData.ticketTypes
    });
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: string | number) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value
    };
    onUpdate({ ticketTypes: updatedTickets });
  };

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      description: "",
      totalQuantity: 100,
      soldQuantity: 0
    };
    onUpdate({ 
      ticketTypes: [...formData.ticketTypes, newTicket] 
    });
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length > 1) {
      const updatedTickets = formData.ticketTypes.filter((_: any, i: number) => i !== index);
      onUpdate({ ticketTypes: updatedTickets });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Ticketing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Type Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What type of event are you running?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ticketed Rave */}
            <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                formData.eventType === "ticketed"
                  ? "border-[#D72638] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleEventTypeChange("ticketed")}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Ticketed Rave</h3>
                <p className="text-sm text-gray-600">My rave requires tickets for entry</p>
              </div>
            </div>

            {/* Free Rave */}
            <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                formData.eventType === "free"
                  ? "border-[#D72638] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleEventTypeChange("free")}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">FREE</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Rave</h3>
                <p className="text-sm text-gray-600">I'm running a free rave</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Configuration - Only show if ticketed */}
        {formData.eventType === "ticketed" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                What tickets are you selling?
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={addTicketType}
                className="flex items-center gap-2 border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
              >
                <Plus className="w-4 h-4" />
                Add Ticket Type
              </Button>
            </div>

            <div className="space-y-4">
              {formData.ticketTypes.map((ticket: any, index: number) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                        placeholder="e.g. Regular, VIP, Early Bird"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₦
                        </span>
                        <Input
                          type="number"
                          required
                          min="0"
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(index, "price", parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Tickets
                      </label>
                      <Input
                        type="number"
                        required
                        min="1"
                        value={ticket.totalQuantity}
                        onChange={(e) => handleTicketChange(index, "totalQuantity", parseInt(e.target.value) || 1)}
                        placeholder="100"
                        className="w-full"
                      />
                      {isEdit && ticket.soldQuantity !== undefined && (
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Total: {ticket.totalQuantity || 0}</span>
                            <span>Sold: {ticket.soldQuantity || 0}</span>
                            <span className="font-medium text-green-600">
                              Remaining: {(ticket.totalQuantity || 0) - (ticket.soldQuantity || 0)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-[#D72638] h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${Math.min(((ticket.soldQuantity || 0) / (ticket.totalQuantity || 1)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                      placeholder="Brief description of what's included"
                      className="w-full"
                    />
                  </div>

                  {/* Remove button - only show if more than one ticket */}
                  {formData.ticketTypes.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTicketType(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Go back
          </Button>
          
          <div className="flex gap-3">
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="px-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
            )}
            
            <Button
              type="submit"
              className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-8"
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}