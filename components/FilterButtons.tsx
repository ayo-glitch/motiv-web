"use client";

import { Badge } from "@/components/ui/badge";
import { useFilter, FilterType } from "@/lib/contexts/FilterContext";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
  { label: "Free", value: "free" }
];

export function FilterButtons() {
  const { activeFilter, setActiveFilter } = useFilter();

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filters.map((filter) => (
        <Badge
          key={filter.value}
          variant={activeFilter === filter.value ? "secondary" : "outline"}
          className={
            activeFilter === filter.value
              ? "bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white hover:opacity-90 shadow-lg border-0 transition-all duration-300 cursor-pointer"
              : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-all duration-300 cursor-pointer"
          }
          onClick={() => setActiveFilter(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  );
}