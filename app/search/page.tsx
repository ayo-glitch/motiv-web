"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventListWrapper as EventList } from "@/components/EventListWrapper";
import { FilterButtons } from "@/components/FilterButtons";
import { FilterProvider } from "@/lib/contexts/FilterContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';

  return (
    <FilterProvider>
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        
        <main className="px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Search Results
              </h1>
              {query && (
                <p className="text-gray-400">
                  Showing results for "{query}"
                  {location && ` in ${location}`}
                </p>
              )}
            </div>

            <FilterButtons />

            <EventList 
              searchQuery={query}
              location={location}
            />
          </div>
        </main>

        <Footer />
      </div>
    </FilterProvider>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading search...</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}