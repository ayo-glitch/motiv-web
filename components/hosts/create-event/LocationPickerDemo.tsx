"use client";

import { useState } from "react";
import { LocationPicker, LocationData } from "./LocationPicker";
import { Button } from "@/components/ui/button";

export function LocationPickerDemo() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleReset = () => {
    setLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">OpenStreetMap Location Picker Demo</h3>
        <p className="text-blue-700 text-sm">
          This component demonstrates the free OpenStreetMap integration for event location selection.
          You can search for locations, click on the map, or use the quick select dropdown. Completely free with no API limits!
        </p>
      </div>

      <LocationPicker
        value={location}
        onChange={setLocation}
      />

      {location && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? "Hide" : "Show"} JSON Data
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset Location
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Selected Location</h4>
            <div className="space-y-1 text-sm text-green-800">
              <p><strong>Address:</strong> {location.address}</p>
              <p><strong>Latitude:</strong> {location.coordinates.lat.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.coordinates.lng.toFixed(6)}</p>
              {location.placeId && <p><strong>Place ID:</strong> {location.placeId}</p>}
            </div>
          </div>

          {showJson && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">JSON Data</h4>
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(location, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}