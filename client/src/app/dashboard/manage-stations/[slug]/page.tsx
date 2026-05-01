import { StationDetail } from "@/components/dashboard/manage-stations/StationDetail";

interface StationDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StationDetailPage({ params }: StationDetailPageProps) {
  const { slug } = await params;
  const stationId = decodeURIComponent(slug);

  return <StationDetail stationId={stationId} backHref="/dashboard/manage-stations" />;
}
