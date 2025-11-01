import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({ 
  rating = 0, 
  totalReviews = 0, 
  size = "md", 
  interactive = false, 
  onRatingChange = null,
  showText = true 
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const handleStarClick = (starIndex) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <img
              key={i}
              className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}`}
              src={i < Math.floor(rating) ? assets.star_icon : assets.star_dull_icon}
              alt={`star ${i + 1}`}
              onClick={() => handleStarClick(i)}
            />
          ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600 ml-1">
          {rating > 0 ? `${rating.toFixed(1)}` : '0.0'}
          {totalReviews > 0 && ` (${totalReviews} review${totalReviews !== 1 ? 's' : ''})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
