<template>
  <div class="map-view">
    <div class="map-header">
      <h1>Charging Stations Map</h1>
      <div class="map-stats">
        <span class="stat-item">
          <span class="stat-value">{{ stations.length }}</span>
          Total Stations
        </span>
        <span class="stat-item">
          <span class="stat-value active">{{ activeCount }}</span>
          Active
        </span>
        <span class="stat-item">
          <span class="stat-value inactive">{{ inactiveCount }}</span>
          Inactive
        </span>
      </div>
    </div>

    <div class="map-content">
      <LoadingSpinner v-if="stationsStore.loading" message="Loading stations..." />

      <div v-else-if="stationsStore.error" class="error-state">
        <p>{{ stationsStore.error }}</p>
        <button @click="stationsStore.fetchStations()" class="btn-retry">Try Again</button>
      </div>

      <StationMap v-else :stations="stations" @station-click="handleStationClick" />
    </div>

    <!-- Station Details Modal -->
    <div v-if="selectedStation" class="modal-overlay" @click="selectedStation = null">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedStation.name }}</h2>

        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span :class="['detail-value', selectedStation.status.toLowerCase()]">
            {{ selectedStation.status }}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Power Output:</span>
          <span class="detail-value">{{ selectedStation.powerOutput }} kW</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Connector Type:</span>
          <span class="detail-value">{{ selectedStation.connectorType }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">
            {{ selectedStation.location.latitude.toFixed(6) }},
            {{ selectedStation.location.longitude.toFixed(6) }}
          </span>
        </div>

        <div v-if="selectedStation.owner" class="detail-row">
          <span class="detail-label">Owner:</span>
          <span class="detail-value">{{ selectedStation.owner.name }}</span>
        </div>

        <button @click="selectedStation = null" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ChargingStation } from '@/types'
import { useStationsStore } from '@/stores/stations'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StationMap from '@/components/stations/StationMap.vue'

const stationsStore = useStationsStore()
const selectedStation = ref<ChargingStation | null>(null)

const stations = computed(() => stationsStore.stations)
const activeCount = computed(() => stations.value.filter((s) => s.status === 'Active').length)
const inactiveCount = computed(() => stations.value.filter((s) => s.status === 'Inactive').length)

onMounted(() => {
  stationsStore.fetchStations()
})

const handleStationClick = (station: ChargingStation) => {
  selectedStation.value = station
}
</script>

<style scoped>
.map-view {
  height: calc(100vh - 60px); /* Subtract navbar height */
  display: flex;
  flex-direction: column;
  background: white;
}

.map-header {
  background: white;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Prevent header from shrinking */
}

.map-header h1 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.map-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-value.active {
  color: #10b981;
}

.stat-value.inactive {
  color: #ef4444;
}

.map-content {
  flex: 1;
  position: relative;
  overflow: hidden; /* Prevent overflow */
  width: 100%; /* Ensure full width */
}

/* Rest of the styles remain the same... */
</style>
