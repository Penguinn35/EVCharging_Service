"use client";

import { stations } from "@/lib/data/stations";
import { getStatistics } from "@/lib/data/sessions";
import { FiZap, FiCheckCircle, FiTrendingUp, FiBarChart2 } from "react-icons/fi";

export function StatisticsCards() {
  const stats = getStatistics();
  const activeStations = stations.filter((s) => s.status !== "OFF").length;
  const totalPoints = stations.reduce((sum, s) => sum + s.totalPoints, 0);
  const availablePoints = stations.reduce((sum, s) => sum + s.availablePoints, 0);
  const utilizationRate = Math.round(((totalPoints - availablePoints) / totalPoints) * 100);

  const cards = [
    {
      title: "Total Stations",
      value: stations.length.toString(),
      subtitle: `${activeStations} active`,
      icon: FiBarChart2,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      iconColor: "bg-green-100",
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions.toString(),
      subtitle: `${stats.completedSessions} completed`,
      icon: FiZap,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "bg-blue-100",
    },
    {
      title: "Available Points",
      value: availablePoints.toString(),
      subtitle: `${totalPoints} total points`,
      icon: FiCheckCircle,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      iconColor: "bg-purple-100",
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate}%`,
      subtitle: `${totalPoints - availablePoints} in use`,
      icon: FiTrendingUp,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      iconColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${card.bgColor} rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className={`${card.textColor} text-3xl font-bold mt-2`}>
                  {card.value}
                </p>
                <p className="text-gray-600 text-xs mt-1">{card.subtitle}</p>
              </div>
              <div className={`${card.iconColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
