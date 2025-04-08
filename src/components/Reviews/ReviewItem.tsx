import React from 'react';
import Image from 'next/image';
import ExpandableReview from '@/components/UI/ExpandableReview';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="border-2 border-[#661F30] rounded-xl p-6 flex flex-col h-full">
      {/* Rating Section */}
      <div className="mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={
                index < review.rating ? 'text-[#E44D61]' : 'text-gray-300'
              }
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{review.rating}/5</p>
      </div>

      {/* Expandable Review Text */}
      <div className="flex-1">
        <ExpandableReview content={review.review} />
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mt-4">
        <Image
          src="/images/dummy-user.jpg"
          alt={review.reviewer || 'Reviewer'}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h4 className="text-md font-medium text-black">
            {review.reviewer || 'Anonymous'}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
