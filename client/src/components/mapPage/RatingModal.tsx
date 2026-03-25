"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

type Props = {
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
};

export default function RatingModal({ onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-xl w-[400px] p-5">
        <h2 className="text-lg font-semibold mb-4">
          Đánh giá trạm sạc
        </h2>

        {/* Stars */}
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(star => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Write your comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => {
              onSubmit(rating, comment);
              onClose();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
