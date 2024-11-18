import React from 'react';
import Image from 'next/image';
import ExpandableReview from '@/components/UI/ExpandableReview'; // Import the ExpandableReview component

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="border-2 border-[#661F30] rounded-xl p-6 shadow-sm">
      {/* Rating Section */}
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={
                index < review.rating ? 'text-[#E44D61]' : 'text-black'
              }
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{review.rating}/5</p>
      </div>

      {/* Expandable Review Text */}
      <ExpandableReview content={review.review} />

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mt-4">
        <Image
          src="/placeholder-user.jpg" // Replace with user avatar if available
          alt={review.reviewer}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h4 className="text-md font-medium text-black">{review.reviewer}</h4>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
