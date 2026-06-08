import { Coordinate } from "./share";

export type StationImage = {
  key: string;
  url: string;
};

export type StationMarkerData = {
  id: string;
  name: string;
  manufacturer: string;
  position: Coordinate;
  status: string;
};

export type Connector = {
  id: string;
  type: number;
  price: number;
  voltage: number;
  maxPower: number;
  status: "OFFLINE" | "AVAILABLE" | "MAINTENANCE" | "IN_USE";
};

export type StationDetail = {
  id: string;
  name: string;
  manufacturer: string;
  position: Coordinate;
  address: string;
  district: string;
  status: number;
  images: StationImage[];
  connectors: Connector[];
};
