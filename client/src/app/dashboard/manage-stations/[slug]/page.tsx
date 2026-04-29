import { notFound } from "next/navigation";
import { StationDetail } from "@/components/dashboard/manage-stations/StationDetail";
import { stations } from "@/lib/data/stations";

interface StationDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StationDetailPage({ params }: StationDetailPageProps) {
  const { slug } = await params;
  const stationId = decodeURIComponent(slug);
  const station = stations.find((item) => item.id === stationId);

  if (!station) {
    notFound();
  }

  return <StationDetail station={station} backHref="/dashboard/manage-stations" />;
}
