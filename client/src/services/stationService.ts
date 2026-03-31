import { ChargingStation } from "@/models/station";
import { ApiResponse } from "@/type/share";
import {apiClient, publicApiClient} from "@/lib/apiClient";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type searchResult = {
  
  id: string,
  name: string,
  address: string
  
}

export async function getStationById(
  stationId: string
): Promise<ChargingStation> {
  console.log("in f");
  
  const response = await publicApiClient.get<ApiResponse<ChargingStation>>(
    `api/stations/${stationId}`
  )
  return response.data.responseData;
}




export const searchStation = async(
  keyword: string
): Promise<searchResult[]> => {
  const response = await publicApiClient.get<ApiResponse<searchResult[]>>(
    "/api/stations/search",
    {
      params:{keyword},
    }
  );
  return  response.data.responseData;
}




