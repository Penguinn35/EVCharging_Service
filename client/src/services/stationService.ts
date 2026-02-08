import { ChargingPoint } from "@/types/Station";
import { ChargingStation } from "@/models/station";
import { sampleStations } from "@/sampleData/stations";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStationById(
  stationId: number
): Promise<ChargingStation | null> {
  return sampleStations.find(s => s.id === stationId) ?? null;
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



