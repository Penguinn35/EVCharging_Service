export interface ChargingSession {
  id: number;
  connectorId: number;     // FK -> Connector.id
  pointId: number;         // FK -> ChargingPoint.id
  startAt: string;         // ISO datetime
  endAt?: string;          // nullable when charging
  status: 'charging' | 'completed' | 'cancelled' | string;
}
export interface Rating {
  id: number;
  userId: number;          // FK -> User.id
  stationId: number;       // FK -> ChargingStation.id
  point: 1 | 2 | 3 | 4 | 5;
  description: string;
}
export interface Suggestion {
  id: number;
  userId: number;          // FK -> User.id
  stationId?: number;      // nullable if suggesting new location
  detail: string;
  addressInfo: string;
}
