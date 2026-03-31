import { Coordinate } from "./share"

export type StationSavedList = {
    id: string,
    name: string, 
    address: string,
    position: Coordinate
}


export type UserLoginResponse = {
 token: string,
 user: {
    id: string
 }
}
export type UserDetailResponse = {
    fullName: string,
    email: string,
    address: string | null,
    savedStationList:StationSavedList[]
}

