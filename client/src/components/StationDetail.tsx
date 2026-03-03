import React, { useState } from "react";
import { ChargingStation } from "@/models/station";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { FaRoute } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Bar } from "react-chartjs-2";
import { useRoutingStore } from "@/store/useRoutingStore";
import { useUserStore } from "@/store/useUserStore";

import "chart.js/auto";
import RatingModal from "./RatingModal";

type StationDetailProps = {
  station: ChargingStation;
  onClose: () => void;
  distance?: number; // Added optional distance property
};

const statusColor = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  maintenance: "bg-orange-100 text-orange-700",
};

const StationDetail = ({ station, onClose, distance }: StationDetailProps) => {
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Usage (kWh)",
        data: station.usageData || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  const isSaved = useUserStore((state) =>
    state.user.savedStation.includes(station.id),
  );
  const { setRouting } = useRoutingStore();
  const { saveStation, deleteStation } = useUserStore();
  const [openRating, setOpenRating] = useState(false);

  const toggleSave = () => {
    isSaved ? deleteStation(station.id) : saveStation(station.id);
  };

  //helper for rating section

  const ratings = station.ratings ?? [];

  const totalRatings = ratings.length;

  const avgRating =
    totalRatings === 0
      ? 0
      : ratings.reduce((s, r) => s + r.point, 0) / totalRatings;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.point === star).length,
  }));
  //

  return (
    <div className="fixed bottom-0 left-0  z-[1000] h-[86%] w-sm rounded-tr-xl bg-white  shadow-xl flex flex-col ">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-400 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{station.name}</h2>
          <p className="text-sm text-gray-500">{station.addressInfor}</p>
          {distance && (
            <p className="text-sm text-gray-500">
              Distance: {distance.toFixed(2)} km
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div className=" overflow-y-auto">
        <div>
          <img
            src={station.img ? (station.img[0] ?? undefined) : undefined}
            alt=""
          />
        </div>

        {/* Charging points list */}
        <div className="flex-1  px-4 space-y-3 ">
          <div className="py-3 flex items-center gap-3 mb-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusColor["active"] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              CÓ SẴN
            </span>

            <span className="text-sm text-gray-600">
              {station.totalPoints} điểm sạc
            </span>
          </div>
          {station.chargingPoints.map((point) =>
            point.id <= 303 ? (
              <div
                key={point.id}
                className=" shadow-md/30 shadow-green-500 rounded-2xl p-3 flex flex-row items-center "
              >
                <BsFillLightningChargeFill className="text-green-500 mr-[8px]" />

                {/* Connectors */}
                <div className="space-y-2 w-full">
                  {point.Connectors.map((connector) => (
                    <div
                      key={connector.id}
                      className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{connector.type}</p>
                        <p className="text-gray-500">
                          {connector.voltageV} V · {connector.maxPowerKW} kW
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null,
          )}

          <div className="py-3 flex items-center gap-3 mb-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusColor["maintenance"] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              ĐANG BẬN
            </span>

            <span className="text-sm text-gray-600">
              {station.totalPoints} điểm sạc
            </span>
          </div>
        </div>
        {station.chargingPoints.map((point) =>
          point.id >= 303 ? (
            <div
              key={point.id}
              className=" shadow-md/30 shadow-orange-500 rounded-2xl p-3 flex flex-row items-center "
            >
              <BsFillLightningChargeFill className="text-orange-500 mr-[8px]" />

              {/* Connectors */}
              <div className="space-y-2 w-full">
                {point.Connectors.map((connector) => (
                  <div
                    key={connector.id}
                    className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{connector.type}</p>
                      <p className="text-gray-500">
                        {connector.voltageV} V · {connector.maxPowerKW} kW
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}

        {/* Data Summary Chart */}
        <div className="px-4 py-3">
          <h3 className="text-md font-semibold">Usage Summary</h3>
          <Bar data={chartData} />
        </div>
        {/* Ratings and Comments */}
        <div className="px-4 py-3">
          <div className="px-4 py-3">
            <h3 className="text-md font-semibold mb-3">Ratings & Reviews</h3>

            <div className="flex gap-6">
              {/* Average */}
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-gray-500">{totalRatings} reviews</p>
              </div>

              {/* Distribution */}
              <div className="flex-1 space-y-1">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2">
                    <span className="text-sm w-4">{d.star}</span>

                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-green-500 rounded"
                        style={{
                          width:
                            totalRatings === 0
                              ? "0%"
                              : `${(d.count / totalRatings) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs text-gray-500 w-6">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {station.ratings?.map((rating, index) => (
            <div key={index} className="mt-2">
              <p>
                <strong>{rating.user}:</strong> {rating.comment}
              </p>
              <p>Rating: {rating.point}/5</p>
            </div>
          ))}
        </div>
      </div>
      {openRating && (
        <RatingModal
          onClose={() => setOpenRating(false)}
          onSubmit={(rating, comment) => {
            console.log("FAKE SUBMIT", rating, comment);
            // later:
            // POST /api/stations/:id/review
          }}
        />
      )}

      {/* Actions */}
      <div className="border-t border-green-400 px-4 py-3 flex  place-content-around ">
        <div
          onClick={() => setOpenRating(true)}
          className=" text-green-600 flex flex-col  items-center gap-2 cursor-pointer hover:text-green-700"
        >
          <TfiWrite className="text-xl" />
          <p>Đánh giá</p>
        </div>
        <div
          onClick={toggleSave}
          className=" text-green-600 flex flex-col  items-center gap-2 cursor-pointer"
        >
          {!isSaved ? (
            <>
              <FaRegStar className="text-xl  hover:text-green-700" />
              <p>Lưu</p>
            </>
          ) : (
            <>
              <FaStar className="text-xl text-yellow-400 hover:text-yellow-600" />
              <p className=" text-yellow-400 hover:text-yellow-600">Đã lưu</p>
            </>
          )}
        </div>
        <div
          onClick={() => setRouting(station.coordinate)}
          className=" text-green-600 flex flex-col  items-center gap-2 cursor-pointer hover:text-green-700"
        >
          <FaRoute className="text-xl" />
          <p>Dẫn đường</p>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;
