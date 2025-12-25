<template>
  <div class="stations-page">
    <div class="page-header">
      <h1>Charging Stations</h1>
      <button @click="showForm = true" class="btn-add">+ Add Station</button>
    </div>

    <div class="content-layout">
      <aside class="filters-sidebar">
        <StationFilters />
      </aside>

      <main class="stations-content">
        <LoadingSpinner v-if="stationsStore.loading" message="Loading stations..." />

        <div v-else-if="stationsStore.error" class="error-state">
          <p>{{ stationsStore.error }}</p>
          <button @click="stationsStore.fetchStations()" class="btn-retry">Try Again</button>
        </div>

        <div v-else-if="stationsStore.stations.length === 0" class="empty-state">
          <p>No charging stations found.</p>
          <p>Try adjusting your filters or add a new station.</p>
        </div>

        <div v-else class="stations-grid">
          <StationCard
            v-for="station in stationsStore.stations"
            :key="station._id"
            :station="station"
            @edit="editStation"
            @delete="deleteStation"
          />
        </div>
      </main>
    </div>

    <StationForm
      v-if="showForm"
      :station="selectedStation"
      @close="closeForm"
      @saved="onStationSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ChargingStation } from '@/types'
import { useStationsStore } from '@/stores/stations'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StationCard from '@/components/stations/StationCard.vue'
import StationFilters from '@/components/stations/StationFilters.vue'
import StationForm from '@/components/stations/StationForm.vue'

const stationsStore = useStationsStore()

const showForm = ref(false)
const selectedStation = ref<ChargingStation | null>(null)

onMounted(() => {
  stationsStore.fetchStations()
})

const editStation = (station: ChargingStation) => {
  selectedStation.value = station
  showForm.value = true
}

const deleteStation = async (id: string) => {
  if (confirm('Are you sure you want to delete this station?')) {
    {
      await stationsStore.deleteStation(id)
    }
  }
}

const closeForm = () => {
  showForm.value = false
  selectedStation.value = null
}

const onStationSaved = () => {
  // Station saved successfully, form will close automatically
}
</script>

<style scoped>
.stations-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #1d4ed8;
}

.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.filters-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.stations-content {
  min-height: 400px;
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-retry:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }

  .stations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
