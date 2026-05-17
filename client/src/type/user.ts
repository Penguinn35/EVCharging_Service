import { Coordinate } from "./share";

export type StationSaved = {
  id: string;
  name: string;
  address: string;
  position: Coordinate;
};

export type UserRole = "CLIENT" | "BUSINESS" | "ADMIN";

export type UserLoginResponse = {
  token: string;
  user: {
    username: string;
    fullName: string;
    email: string;
    address: string;
    role: UserRole;
  };
};

export type UserDetailResponse = {
  fullName: string;
  email: string;
  address: string | null;
  savedStationList: StationSaved[];
};
