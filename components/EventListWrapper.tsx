'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useFilter } from '@/lib/contexts/FilterContext';

const EventList = dynamic(() => import('./EventList').then(mod => ({ default: mod.EventList })), {
  loading: () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading events...</span>
    </div>
  ),
  ssr: false
});

interface EventListWrapperProps {
  searchQuery?: string;
  tags?: string;
  location?: string;
}

export function EventListWrapper(props: EventListWrapperProps) {
  const { getDateFilter } = useFilter();
  const filterParams = getDateFilter();

  return <EventList {...props} {...filterParams} />;
}