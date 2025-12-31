import { ChargingPoint } from "@/types/Station";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStationPoints(stationId: number): Promise<ChargingPoint[]> {
  const res = await fetch(`${baseUrl}/points/station/${stationId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to fetch station ${stationId}`);
  return res.json();
}

export async function getChargingStations() {
  const res = await fetch(
    "https://api.openchargemap.io/v3/poi/?output=json&latitude=10.7769&longitude=106.7009&distance=20&distanceunit=KM&maxresults=20",
    {
      headers: {
        "X-API-Key": "b7559585-323d-4672-a3fb-60c9e037d705"
      }
    }
  );

  const data = await res.json();
  console.log(data);
  return data;
}
