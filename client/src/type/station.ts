import { Coordinate } from "./share";
export type StationMarkerData = {
  id: string,
  name: string,
  manufacturer: string;
  coordinate: Coordinate;
  status: string;
}
export type Connector = {
  id: string;
  type: number;
  voltage: number;
  maxPower: number;
  available: boolean;
};

export type StationDetail = {
  id: string;
  name: string;
  manufacturer: string;
  position: Coordinate;
  address: string;
  district: string;
  isAvailable: boolean;
  imageUrl: string;
  connectors: Connector[];
  status: number;
};