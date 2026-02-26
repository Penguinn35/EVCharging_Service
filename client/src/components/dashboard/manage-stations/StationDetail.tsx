"use client";

import { useState, useMemo } from "react";
import { Station } from "@/lib/data/stations";
import { ratings } from "@/lib/data/ratings";
import { FiArrowLeft, FiMapPin, FiZap, FiStar } from "react-icons/fi";

interface StationDetailProps {
  station: Station;
  onBack: () => void;
}

const RATINGS_PER_PAGE = 5;

export function StationDetail({ station, onBack }: StationDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Get ratings for this station
  const stationRatings = useMemo(() => {
    return ratings
      .filter((r) => r.stationId === station.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [station.id]);

  const totalPages = Math.ceil(stationRatings.length / RATINGS_PER_PAGE);
  const paginatedRatings = useMemo(() => {
    const startIndex = (currentPage - 1) * RATINGS_PER_PAGE;
    const endIndex = startIndex + RATINGS_PER_PAGE;
    return stationRatings.slice(startIndex, endIndex);
  }, [stationRatings, currentPage]);

  // Calculate average rating
  const avgRating =
    stationRatings.length > 0
      ? (stationRatings.reduce((sum, r) => sum + r.point, 0) / stationRatings.length).toFixed(1)
      : 0;

  // Get unique connector types
  const connectorTypes = Array.from(new Set(station.chargingPoints.map((cp) => cp.connectorType)));
  const maxPowers = Array.from(new Set(station.chargingPoints.map((cp) => cp.maxPower)));

  const statusColor = {
    AVAILABLE: "bg-green-100 text-green-700",
    BUSY: "bg-yellow-100 text-yellow-700",
    FULL: "bg-orange-100 text-orange-700",
    OFF: "bg-gray-100 text-gray-700",
  }[station.status];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Stations
      </button>

      {/* Station Image */}
      <div className="rounded-lg overflow-hidden border border-gray-200 h-80 bg-gray-100">
        <img
          src={station.imageUrl}
          alt={station.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&h=400&fit=crop";
          }}
        />
      </div>

      {/* Station Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="w-4 h-4" />
            <span>{station.address}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Status</div>
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
            {station.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">District</div>
          <div className="font-semibold text-gray-900">{station.district}</div>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 uppercase mb-2">Charging Points</div>
          <div className="text-2xl font-bold text-green-600">{station.totalPoints}</div>
          <div className="text-xs text-gray-500 mt-1">
            {station.availablePoints} available
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 uppercase mb-2">Coordinates</div>
          <div className="text-sm font-mono text-gray-900 break-all">
            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 uppercase mb-2">Connector Types</div>
          <div className="space-y-1">
            {connectorTypes.length > 0 ? (
              connectorTypes.map((type) => (
                <div key={type} className="text-sm font-medium text-gray-900">
                  {type}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No charging points</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 uppercase mb-2">Max Power</div>
          <div className="space-y-1">
            {maxPowers.length > 0 ? (
              maxPowers.map((power) => (
                <div key={power} className="text-sm font-medium text-gray-900">
                  {power}W
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Charging Points Details */}
      {station.chargingPoints.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Charging Points</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Point ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Connector Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Voltage</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Max Power</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {station.chargingPoints.map((point) => {
                  const pointStatusColor = {
                    AVAILABLE: "bg-green-100 text-green-700",
                    BUSY: "bg-yellow-100 text-yellow-700",
                    FULL: "bg-orange-100 text-orange-700",
                    OFF: "bg-gray-100 text-gray-700",
                  }[point.status];

                  return (
                    <tr key={point.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{point.id}</td>
                      <td className="px-4 py-3 text-gray-700">{point.connectorType}</td>
                      <td className="px-4 py-3 text-gray-700">{point.voltage}V</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{point.maxPower}W</td>
                      <td className="px-4 py-3 text-gray-700">${point.price.toFixed(2)}/kWh</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${pointStatusColor}`}>
                          {point.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ratings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">User Ratings</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">{avgRating}</span>
              <span className="text-sm text-gray-600">({stationRatings.length} reviews)</span>
            </div>
          </div>
        </div>

        {stationRatings.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedRatings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.point
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        User {rating.userId} • {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{rating.description}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {stationRatings.length > RATINGS_PER_PAGE && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                <div className="text-xs text-gray-600">
                  Showing {(currentPage - 1) * RATINGS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * RATINGS_PER_PAGE, stationRatings.length)} of{" "}
                  {stationRatings.length} ratings
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          currentPage === page
                            ? "bg-green-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">No ratings yet for this station.</div>
        )}
      </div>
    </div>
  );
}
