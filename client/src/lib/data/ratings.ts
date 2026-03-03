export interface Rating {
  id: number;
  userId: number;
  stationId: string;
  point: 1 | 2 | 3 | 4 | 5;
  description: string;
  createdAt: Date;
}

export const ratings: Rating[] = [
  {
    id: 1,
    userId: 101,
    stationId: "STN001",
    point: 5,
    description: "Excellent charging speed and very convenient location!",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: 2,
    userId: 102,
    stationId: "STN001",
    point: 4,
    description: "Good service, but it was crowded during peak hours.",
    createdAt: new Date("2024-02-19"),
  },
  {
    id: 3,
    userId: 103,
    stationId: "STN002",
    point: 5,
    description: "Best charging station at the airport! Quick and efficient.",
    createdAt: new Date("2024-02-21"),
  },
  {
    id: 4,
    userId: 104,
    stationId: "STN002",
    point: 3,
    description: "Average experience. Payment method limited.",
    createdAt: new Date("2024-02-18"),
  },
  {
    id: 5,
    userId: 105,
    stationId: "STN003",
    point: 2,
    description: "Usually full. Very inconvenient to use.",
    createdAt: new Date("2024-02-17"),
  },
  {
    id: 6,
    userId: 106,
    stationId: "STN003",
    point: 3,
    description: "Good location in shopping mall but limited availability.",
    createdAt: new Date("2024-02-16"),
  },
  {
    id: 7,
    userId: 107,
    stationId: "STN004",
    point: 4,
    description: "Perfect for highway travel. Clean facilities.",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: 8,
    userId: 108,
    stationId: "STN004",
    point: 4,
    description: "Great rest stop charging. Highly recommended.",
    createdAt: new Date("2024-02-14"),
  },
  {
    id: 9,
    userId: 109,
    stationId: "STN005",
    point: 1,
    description: "Station is offline. Not working at all!",
    createdAt: new Date("2024-02-13"),
  },
  {
    id: 10,
    userId: 110,
    stationId: "STN006",
    point: 5,
    description: "Beautiful location with excellent service. Love it!",
    createdAt: new Date("2024-02-12"),
  },
  {
    id: 11,
    userId: 111,
    stationId: "STN006",
    point: 4,
    description: "Good charging speed and friendly staff.",
    createdAt: new Date("2024-02-11"),
  },
  {
    id: 12,
    userId: 112,
    stationId: "STN001",
    point: 4,
    description: "Reliable charger. Only minor complaint about parking.",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: 13,
    userId: 113,
    stationId: "STN002",
    point: 5,
    description: "Fast charging and convenient for business travelers.",
    createdAt: new Date("2024-02-09"),
  },
  {
    id: 14,
    userId: 114,
    stationId: "STN003",
    point: 2,
    description: "Frequently out of service. Not reliable.",
    createdAt: new Date("2024-02-08"),
  },
  {
    id: 15,
    userId: 115,
    stationId: "STN006",
    point: 5,
    description: "Premium charging experience with excellent amenities.",
    createdAt: new Date("2024-02-07"),
  },
];
