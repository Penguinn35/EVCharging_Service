export type SessionStatus = "CHARGING" | "COMPLETED";

export interface ChargingSession {
  id: string;
  pointId: string;
  stationId: string;
  startAt: Date;
  endAt: Date | null;
  status: SessionStatus;
  energyUsed: number;
}

const now = new Date();

export const sessions: ChargingSession[] = [
  {
    id: "SES001",
    pointId: "CP001",
    stationId: "STN001",
    startAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    endAt: null,
    status: "CHARGING",
    energyUsed: 45.5,
  },
  {
    id: "SES002",
    pointId: "CP003",
    stationId: "STN001",
    startAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    status: "COMPLETED",
    energyUsed: 62.3,
  },
  {
    id: "SES003",
    pointId: "CP005",
    stationId: "STN002",
    startAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    endAt: null,
    status: "CHARGING",
    energyUsed: 28.7,
  },
  {
    id: "SES004",
    pointId: "CP006",
    stationId: "STN002",
    startAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() - 30 * 60 * 1000),
    status: "COMPLETED",
    energyUsed: 75.2,
  },
  {
    id: "SES005",
    pointId: "CP008",
    stationId: "STN004",
    startAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    status: "COMPLETED",
    energyUsed: 88.0,
  },
  {
    id: "SES006",
    pointId: "CP010",
    stationId: "STN006",
    startAt: new Date(now.getTime() - 30 * 60 * 1000),
    endAt: null,
    status: "CHARGING",
    energyUsed: 12.5,
  },
  {
    id: "SES007",
    pointId: "CP011",
    stationId: "STN006",
    startAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    status: "COMPLETED",
    energyUsed: 55.8,
  },
];

// Generate mock data for the last 7 days
export function generateSessionsForChart() {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const completed = Math.floor(Math.random() * 15) + 8;
    const charging = Math.floor(Math.random() * 8) + 2;
    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed,
      charging,
      total: completed + charging,
    });
  }
  return data;
}

export function getStatistics() {
  const activeCount = sessions.filter((s) => s.status === "CHARGING").length;
  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalEnergy = sessions.reduce((sum, s) => sum + s.energyUsed, 0);

  return {
    activeSessions: activeCount,
    completedSessions: completedCount,
    totalEnergy: totalEnergy.toFixed(1),
    averageEnergyPerSession: (totalEnergy / sessions.length).toFixed(1),
  };
}
