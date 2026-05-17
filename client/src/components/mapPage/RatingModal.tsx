"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useStationStore } from "@/store/useStationStore";
import { toast } from "react-toastify";
import { ratingStation } from "@/services/stationService";

type Props = {
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
};

export default function RatingModal({ onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stationId = useStationStore.getState().selectedStation?.id;

  const onSubmit = async (ratingValue: number, commentValue: string) => {
    if (!stationId) {
      toast.error("ID trạm không hợp lệ");
      return;
    }

    if (ratingValue === 0) {
      toast.error("Vui lòng chọn số sao để đánh giá");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await ratingStation({
        stationId,
        point: ratingValue,
        comment: commentValue,
      });

      if (result) {
        await onSuccess?.();
        toast.success("Cảm ơn bạn đã đánh giá");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Gửi đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="w-[400px] rounded-xl bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Đánh giá trạm sạc</h2>

        <div className="mb-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => {
                if (!isSubmitting) {
                  setRating(star);
                }
              }}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } ${isSubmitting ? "pointer-events-none opacity-70" : ""}`}
            />
          ))}
        </div>

        <textarea
          className="mb-4 w-full rounded border p-2 disabled:bg-gray-100"
          rows={4}
          placeholder="Viết đánh giá của bạn..."
          value={comment}
          disabled={isSubmitting}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            className="cursor-pointer rounded bg-green-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={() => void onSubmit(rating, comment)}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
