export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChargingStation {
  _id?: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'Active' | 'Inactive';
  powerOutput: number;
  connectorType: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla Supercharger';
  owner?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface StationFilters {
  status?: string;
  powerOutput?: number;
  connectorType?: string;
}