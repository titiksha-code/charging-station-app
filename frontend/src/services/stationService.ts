import api from './api';
import type { ChargingStation, StationFilters } from '@/types';

export const stationService = {
  // Get all stations with optional filters
  async getStations(filters?: StationFilters): Promise<ChargingStation[]> {
    const response = await api.get<ChargingStation[]>('/stations', {
      params: filters,
    });
    return response.data;
  },

  // Get single station by ID
  async getStation(id: string): Promise<ChargingStation> {
    const response = await api.get<ChargingStation>(`/stations/${id}`);
    return response.data;
  },

  // Create new station
  async createStation(station: Omit<ChargingStation, '_id' | 'owner'>): Promise<ChargingStation> {
    const response = await api.post<ChargingStation>('/stations', station);
    return response.data;
  },

  // Update existing station
  async updateStation(id: string, station: Partial<ChargingStation>): Promise<ChargingStation> {
    const response = await api.put<ChargingStation>(`/stations/${id}`, station);
    return response.data;
  },

  // Delete station
  async deleteStation(id: string): Promise<void> {
    await api.delete(`/stations/${id}`);
  },
};