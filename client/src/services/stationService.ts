import { ChargingPoint } from "@/types/Station";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStationPoints(stationId: number): Promise<ChargingPoint[]> {
  const res = await fetch(`${baseUrl}/points/station/${stationId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to fetch station ${stationId}`);
  return res.json();
}
