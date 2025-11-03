export interface ChargingPoint {
  id: number;
  type: string;
  power: number;
  status: "Available" | "InUse";
}
