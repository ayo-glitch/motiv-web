/**
 * Format a date string or Date object to a human-readable relative time
 * @param dateInput - Date string, Date object, or review object with date fields
 * @returns Formatted date string
 */
export function formatRelativeTime(dateInput: string | Date | any): string {
  let date: Date;
  
  // Handle different input types
  if (typeof dateInput === 'object' && dateInput !== null && !(dateInput instanceof Date)) {
    // If it's an object (like a review), try to extract the date
    const dateString = dateInput.created_at || dateInput.CreatedAt || dateInput.createdAt;
    if (!dateString) {
      return 'Recently';
    }
    date = new Date(dateString);
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Recently';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Recently';
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  // Handle future dates
  if (diffInMs < 0) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Return appropriate relative time
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks === 1) {
    return '1 week ago';
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  } else if (diffInMonths === 1) {
    return '1 month ago';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else if (diffInYears === 1) {
    return '1 year ago';
  } else {
    return `${diffInYears} years ago`;
  }
}

/**
 * Format a date to a standard format (MMM DD, YYYY)
 * @param dateInput - Date string, Date object, or review object with date fields
 * @returns Formatted date string
 */
export function formatStandardDate(dateInput: string | Date | any): string {
  let date: Date;
  
  // Handle different input types
  if (typeof dateInput === 'object' && dateInput !== null && !(dateInput instanceof Date)) {
    const dateString = dateInput.created_at || dateInput.CreatedAt || dateInput.createdAt;
    if (!dateString) return 'Unknown date';
    date = new Date(dateString);
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Unknown date';
  }
  
  if (isNaN(date.getTime())) {
    return 'Unknown date';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}