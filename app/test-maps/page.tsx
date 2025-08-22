"use client";

import { LocationPickerDemo } from "@/components/hosts/create-event/LocationPickerDemo";

export default function TestMapsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">OpenStreetMap Integration Test</h1>
        <p className="text-gray-600 mb-8">
          Test the free OpenStreetMap location picker component for event creation.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LocationPickerDemo />
        </div>
      </div>
    </div>
  );
}