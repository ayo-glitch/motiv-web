"use client";

import { useEventReviewsNew } from "@/lib/hooks";

interface ReviewDebugProps {
  eventId: string;
}

export function ReviewDebug({ eventId }: ReviewDebugProps) {
  const { data: reviewsData, isLoading } = useEventReviewsNew(eventId);

  if (isLoading) return <div>Loading reviews...</div>;

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <h3 className="text-white font-bold mb-2">Review Debug Info</h3>
      <div className="text-xs text-gray-300">
        <p>Total reviews: {reviews.length}</p>
        {reviews.slice(0, 2).map((review: any, index: number) => (
          <div key={index} className="mt-2 p-2 bg-gray-700 rounded">
            <p><strong>Review {index + 1}:</strong></p>
            <p>ID: {review.id}</p>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            <p>User: {review.user?.name}</p>
            <p>created_at: {review.created_at}</p>
            <p>CreatedAt: {review.CreatedAt}</p>
            <p>createdAt: {review.createdAt}</p>
            <p>Raw object: {JSON.stringify(review, null, 2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}