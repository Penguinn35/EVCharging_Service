"use client";
import { useEffect } from "react";
import { useStationStore } from "@/store/useStationStore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { points, loading, error, fetchPoints } = useStationStore();
  const router = useRouter();

  useEffect(() => {
    fetchPoints(1);
  }, [fetchPoints]);
  const navigateMap = () => {
    router.push("/Map");
  };
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Charging Points</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {points.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="font-bold text-lg mb-2">
              #{p.id} - {p.type}
            </h2>
            <p>Power: {p.power} kW</p>
            <p
              className={
                p.status === "Available" ? "text-green-600" : "text-yellow-600"
              }
            >
              Status: {p.status}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={navigateMap}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Map
      </button>
    </div>
  );
}
