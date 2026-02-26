export type PlugType = "Type2" | "CCS2" | "Both";

export interface UserPlugTypePreference {
  userId: number;
  plugType: PlugType;
}

export interface SavedStation {
  userId: number;
  stationId: string;
  savedAt: Date;
}

export interface StationSaveStats {
  stationId: string;
  totalUsersSaved: number;
  type2Users: number;
  css2Users: number;
  bothUsers: number;
}

// User plug type preferences
export const userPlugTypePreferences: UserPlugTypePreference[] = [
  {
    userId: 101,
    plugType: "CCS2",
  },
  {
    userId: 102,
    plugType: "Type2",
  },
  {
    userId: 103,
    plugType: "Both",
  },
  {
    userId: 104,
    plugType: "CCS2",
  },
  {
    userId: 105,
    plugType: "Type2",
  },
];

// Saved stations data - Enterprise view: shows how many users saved each station
export const stationSaveStats: StationSaveStats[] = [
  {
    stationId: "STN001",
    totalUsersSaved: 342,
    type2Users: 134,
    css2Users: 145,
    bothUsers: 63,
  },
  {
    stationId: "STN002",
    totalUsersSaved: 567,
    type2Users: 289,
    css2Users: 198,
    bothUsers: 80,
  },
  {
    stationId: "STN003",
    totalUsersSaved: 289,
    type2Users: 112,
    css2Users: 134,
    bothUsers: 43,
  },
  {
    stationId: "STN004",
    totalUsersSaved: 156,
    type2Users: 78,
    css2Users: 54,
    bothUsers: 24,
  },
  {
    stationId: "STN005",
    totalUsersSaved: 42,
    type2Users: 18,
    css2Users: 17,
    bothUsers: 7,
  },
  {
    stationId: "STN006",
    totalUsersSaved: 421,
    type2Users: 198,
    css2Users: 168,
    bothUsers: 55,
  },
];

// Legacy: Saved stations by individual user (kept for reference)
export const savedStations: SavedStation[] = [
  {
    userId: 101,
    stationId: "STN006",
    savedAt: new Date("2024-02-20"),
  },
  {
    userId: 101,
    stationId: "STN001",
    savedAt: new Date("2024-02-19"),
  },
  {
    userId: 101,
    stationId: "STN002",
    savedAt: new Date("2024-02-18"),
  },
  {
    userId: 101,
    stationId: "STN004",
    savedAt: new Date("2024-02-17"),
  },
  {
    userId: 101,
    stationId: "STN003",
    savedAt: new Date("2024-02-16"),
  },
];

// Brand comparison data (other charging networks)
export interface BrandStats {
  brandName: string;
  totalInterestPoints: number;
  stationsCount: number;
}

export const brandComparison: BrandStats[] = [
  {
    brandName: "Our Brand",
    totalInterestPoints: 1817, // Sum of all stations
    stationsCount: 6,
  },
  {
    brandName: "ElectroCharge",
    totalInterestPoints: 2145,
    stationsCount: 8,
  },
  {
    brandName: "FastPower",
    totalInterestPoints: 1654,
    stationsCount: 7,
  },
  {
    brandName: "GreenEnergy",
    totalInterestPoints: 1923,
    stationsCount: 6,
  },
  {
    brandName: "ChargeHub",
    totalInterestPoints: 1456,
    stationsCount: 5,
  },
];
