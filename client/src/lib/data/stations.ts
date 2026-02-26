export type StationStatus = "AVAILABLE" | "BUSY" | "FULL" | "OFF";

export interface ChargingPoint {
  id: string;
  stationId: string;
  price: number;
  voltage: number;
  maxPower: number;
  connectorType: string;
  status: StationStatus;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  district: string;
  status: StationStatus;
  totalPoints: number;
  availablePoints: number;
  interestedPoints: number;
  lat: number;
  lng: number;
  imageUrl: string;
  chargingPoints: ChargingPoint[];
}

export const stations: Station[] = [
  {
    id: "STN001",
    name: "Downtown Charging Hub",
    address: "123 Main Street, City Center",
    district: "Downtown",
    status: "AVAILABLE",
    totalPoints: 12,
    availablePoints: 8,
    interestedPoints: 342,
    lat: 40.7128,
    lng: -74.006,
    imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=300&fit=crop",
    chargingPoints: [
      {
        id: "CP001",
        stationId: "STN001",
        price: 0.45,
        voltage: 400,
        maxPower: 150,
        connectorType: "CCS",
        status: "AVAILABLE",
      },
      {
        id: "CP002",
        stationId: "STN001",
        price: 0.45,
        voltage: 400,
        maxPower: 150,
        connectorType: "CCS",
        status: "AVAILABLE",
      },
      {
        id: "CP003",
        stationId: "STN001",
        price: 0.35,
        voltage: 230,
        maxPower: 22,
        connectorType: "Type 2",
        status: "BUSY",
      },
      {
        id: "CP004",
        stationId: "STN001",
        price: 0.35,
        voltage: 230,
        maxPower: 22,
        connectorType: "Type 2",
        status: "BUSY",
      },
    ],
  },
  {
    id: "STN002",
    name: "Airport Terminal Charging",
    address: "456 Airport Road",
    district: "Airport",
    status: "BUSY",
    totalPoints: 20,
    availablePoints: 3,
    interestedPoints: 567,
    lat: 40.7589,
    lng: -73.9851,
    imageUrl: "https://images.unsplash.com/photo-1617281537395-56b3b3b1b5e5?w=500&h=300&fit=crop",
    chargingPoints: [
      {
        id: "CP005",
        stationId: "STN002",
        price: 0.55,
        voltage: 400,
        maxPower: 200,
        connectorType: "CCS",
        status: "BUSY",
      },
      {
        id: "CP006",
        stationId: "STN002",
        price: 0.55,
        voltage: 400,
        maxPower: 200,
        connectorType: "CCS",
        status: "BUSY",
      },
    ],
  },
  {
    id: "STN003",
    name: "Shopping Mall Parking",
    address: "789 Commerce Boulevard",
    district: "Commerce",
    status: "FULL",
    totalPoints: 16,
    availablePoints: 0,
    interestedPoints: 289,
    lat: 40.7282,
    lng: -73.7949,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
    chargingPoints: [
      {
        id: "CP007",
        stationId: "STN003",
        price: 0.4,
        voltage: 230,
        maxPower: 22,
        connectorType: "Type 2",
        status: "FULL",
      },
    ],
  },
  {
    id: "STN004",
    name: "Highway Rest Stop",
    address: "Highway 101 Mile Marker 45",
    district: "Suburban",
    status: "AVAILABLE",
    totalPoints: 8,
    availablePoints: 6,
    interestedPoints: 156,
    lat: 40.758,
    lng: -73.9855,
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop",
    chargingPoints: [
      {
        id: "CP008",
        stationId: "STN004",
        price: 0.5,
        voltage: 400,
        maxPower: 150,
        connectorType: "CCS",
        status: "AVAILABLE",
      },
      {
        id: "CP009",
        stationId: "STN004",
        price: 0.5,
        voltage: 400,
        maxPower: 150,
        connectorType: "CCS",
        status: "AVAILABLE",
      },
    ],
  },
  {
    id: "STN005",
    name: "Business Park Station",
    address: "321 Tech Park Avenue",
    district: "Tech Park",
    status: "OFF",
    totalPoints: 10,
    availablePoints: 0,
    interestedPoints: 42,
    lat: 40.6895,
    lng: -74.0345,
    imageUrl: "https://images.unsplash.com/photo-1555097462-c2dfc7bb38a0?w=500&h=300&fit=crop",
    chargingPoints: [],
  },
  {
    id: "STN006",
    name: "Harbor View Charging",
    address: "555 Waterfront Drive",
    district: "Harbor",
    status: "AVAILABLE",
    totalPoints: 14,
    availablePoints: 11,
    interestedPoints: 421,
    lat: 40.7489,
    lng: -73.968,
    imageUrl: "https://images.unsplash.com/photo-1626844601200-1ef145c3f63f?w=500&h=300&fit=crop",
    chargingPoints: [
      {
        id: "CP010",
        stationId: "STN006",
        price: 0.42,
        voltage: 400,
        maxPower: 150,
        connectorType: "CCS",
        status: "AVAILABLE",
      },
      {
        id: "CP011",
        stationId: "STN006",
        price: 0.35,
        voltage: 230,
        maxPower: 22,
        connectorType: "Type 2",
        status: "AVAILABLE",
      },
      {
        id: "CP012",
        stationId: "STN006",
        price: 0.35,
        voltage: 230,
        maxPower: 22,
        connectorType: "Type 2",
        status: "BUSY",
      },
    ],
  },
];

