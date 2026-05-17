"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useStationStore } from "@/store/useStationStore";
import { toast } from "react-toastify";
import { ratingStation } from "@/services/stationService";
type Props = {
  onClose: () => void;
};

export default function RatingModal({ onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const stationId = useStationStore.getState().selectedStation?.id;
  const onSubmit = async (rating: number, comment: string) => {
    if (!stationId) {
      toast.error("ID trạm không hợp lệ");
      return;
    }
    try {
      const data = {
      stationId: stationId,
      point: rating,
      comment: comment,
    };
    const result = await ratingStation(data);
    console.log("after rating: ", result);
    if(result){
      toast.success("Cảm ơn bạn đã đánh giá");
    }
    } catch (error) {
     console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-xl w-[400px] p-5">
        <h2 className="text-lg font-semibold mb-4">Đánh giá trạm sạc</h2>

        {/* Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Viết đánh giá của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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
