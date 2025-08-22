"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FilterType = 'all' | 'today' | 'tomorrow' | 'weekend' | 'free';

interface FilterContextType {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  getDateFilter: () => { dateFrom?: string; dateTo?: string; eventType?: string };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getDateFilter = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    switch (activeFilter) {
      case 'today':
        return { 
          dateFrom: formatDate(today), 
          dateTo: formatDate(today) 
        };
      case 'tomorrow':
        return { 
          dateFrom: formatDate(tomorrow), 
          dateTo: formatDate(tomorrow) 
        };
      case 'weekend':
        // Get this weekend (Saturday and Sunday)
        const nextSaturday = new Date(today);
        const daysUntilSaturday = (6 - today.getDay()) % 7;
        if (daysUntilSaturday === 0 && today.getDay() !== 6) {
          // If today is Sunday, get next Saturday
          nextSaturday.setDate(today.getDate() + 6);
        } else {
          nextSaturday.setDate(today.getDate() + daysUntilSaturday);
        }
        
        const nextSunday = new Date(nextSaturday);
        nextSunday.setDate(nextSaturday.getDate() + 1);
        
        return { 
          dateFrom: formatDate(nextSaturday), 
          dateTo: formatDate(nextSunday) 
        };
      case 'free':
        return { eventType: 'free' };
      default:
        return {};
    }
  };

  return (
    <FilterContext.Provider value={{ activeFilter, setActiveFilter, getDateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}