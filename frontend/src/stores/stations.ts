import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChargingStation, StationFilters } from '@/types'
import { stationService } from '@/services/stationService'
import type { AxiosError } from 'axios'

export const useStationsStore = defineStore('stations', () => {
  const stations = ref<ChargingStation[]>([])
  const currentStation = ref<ChargingStation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<StationFilters>({})

  async function fetchStations() {
    try {
      loading.value = true
      error.value = null
      stations.value = await stationService.getStations(filters.value)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || 'Failed to fetch stations'
    } finally {
      loading.value = false
    }
  }

  async function fetchStation(id: string) {
    try {
      loading.value = true
      error.value = null
      currentStation.value = await stationService.getStation(id)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || 'Failed to fetch station'
    } finally {
      loading.value = false
    }
  }

  async function createStation(station: Omit<ChargingStation, '_id' | 'owner'>) {
    try {
      loading.value = true
      error.value = null
      const newStation = await stationService.createStation(station)
      stations.value.push(newStation)
      return newStation
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || 'Failed to create station'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStation(id: string, updates: Partial<ChargingStation>) {
    try {
      loading.value = true
      error.value = null
      const updatedStation = await stationService.updateStation(id, updates)
      const index = stations.value.findIndex((s) => s._id === id)
      if (index !== -1) {
        stations.value[index] = updatedStation
      }
      return updatedStation
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || 'Failed to update station'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStation(id: string) {
    try {
      loading.value = true
      error.value = null
      await stationService.deleteStation(id)
      stations.value = stations.value.filter((s) => s._id !== id)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || 'Failed to delete station'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: StationFilters) {
    filters.value = newFilters
    fetchStations()
  }

  function clearFilters() {
    filters.value = {}
    fetchStations()
  }

  return {
    stations,
    currentStation,
    loading,
    error,
    filters,
    fetchStations,
    fetchStation,
    createStation,
    updateStation,
    deleteStation,
    setFilters,
    clearFilters,
  }
})
