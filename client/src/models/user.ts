export type registerType = {
  userName: string,
  password: string,
  email: string,
  fullName: string
}

export type loginType = {
  username: string,
  password: string
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'operator';
}

export interface EnterpriseProfile {
  id: number;
  userId: number;
  companyName: string;
  taxCode: string;
  address: string;
}
