export interface ChargingStation {
  id: number;
  name: string;
  operatorId: number;    
  addressInfor: string;
  totalPoints: number;
  chargingPoints: ChargingPoint[];
  status: 'active' | 'inactive' | 'maintenance' | string;
  location: {
    latitude: number;
    longitude: number;
  };
  img?: string[];
  ratings?: {
    user: string;
    point: number;
    comment: string;
  }[];
  usageData?: number[];
}
export interface ChargingPoint {
  id: number;
  stationId: number;
  Connectors: Connector[]
  status: 'available' | 'busy' | 'offline' | string;
}

export interface Connector {
  id: number;
  pointId: number;       
  type: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | string;
  maxPowerKW: number;
  voltageV: number;
}
