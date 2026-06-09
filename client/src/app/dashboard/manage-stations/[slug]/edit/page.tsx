import { StationForm } from "@/components/dashboard/manage-stations/StationForm";
import { getStationById } from "@/services/stationService";
import { StationPayload, ChargingPointPayload } from "@/services/enterpriseService";

interface EditStationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditStationPage({ params }: EditStationPageProps) {
  const { slug } = await params;
  const stationId = decodeURIComponent(slug);

  let stationData = null;
  try {
    stationData = await getStationById(stationId);
  } catch (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Không thể tải dữ liệu trạm sạc. Vui lòng thử lại sau.
      </div>
    );
  }

  // Thuật toán gom nhóm các connector có cùng chargingPointId
  const groupedPointsMap = stationData.connectors.reduce((acc, connector) => {
    const pointId = connector.chargingPointId;
    
    // Nếu điểm sạc chưa tồn tại trong Map, tạo mới
    if (!acc[pointId]) {
      acc[pointId] = {
        id: pointId,
        status: 1, // Có thể set mặc định hoặc lấy từ API nếu Backend có trả thêm
        connectors: [],
      };
    }

    // Nhét đầu sạc vào đúng điểm sạc của nó
    acc[pointId].connectors.push({
      id: connector.id,
      type: connector.type,
      price: connector.price,
      voltage: connector.voltage,
      maxPower: connector.maxPower,
      available: (connector as any).available ?? (connector.status === "AVAILABLE"),
    });

    return acc;
  }, {} as Record<string, ChargingPointPayload>);

  // Ép sang đúng StationPayload
  const mappedInitialData: StationPayload = {
    id: stationData.id,
    name: stationData.name,
    address: stationData.address,
    district: stationData.district,
    position: stationData.position,
    chargingPoints: Object.values(groupedPointsMap),
  };

  return <StationForm initialData={mappedInitialData} />;
}