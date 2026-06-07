"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";

export type HeatmapDateRange = {
  from: string;
  to: string;
};

type HeatmapDateRangeModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (range: HeatmapDateRange) => void;
  defaultFrom?: string;
  defaultTo?: string;
};

export function HeatmapDateRangeModal({
  open,
  onClose,
  onApply,
  defaultFrom = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  defaultTo = new Date().toISOString().slice(0, 10),
}: HeatmapDateRangeModalProps) {
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);

  useEffect(() => {
    if (!open) return;
    setFromDate(defaultFrom);
    setToDate(defaultTo);
  }, [open, defaultFrom, defaultTo]);

  const handleApply = () => {
    const from = fromDate <= toDate ? fromDate : toDate;
    const to = toDate >= fromDate ? toDate : fromDate;
    onApply({ from, to });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100]">
      <Modal open={open} onClose={onClose}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Chọn khoảng thời gian</h2>
          <p className="text-sm text-gray-600">Chọn ngày bắt đầu và kết thúc cho vùng đã chọn trên bản đồ.</p>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <span className="mt-5 text-sm text-gray-500">đến</span>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
