<template>
  <div class="filters-container">
    <h3>Filters</h3>

    <div class="filter-group">
      <label for="status">Status</label>
      <select
        id="status"
        v-model="localFilters.status"
        @change="applyFilters"
        class="filter-select"
      >
        <option value="">All</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="powerOutput">Min Power Output (kW)</label>
      <input
        id="powerOutput"
        v-model.number="localFilters.powerOutput"
        type="number"
        min="0"
        @input="applyFilters"
        class="filter-input"
        placeholder="e.g., 50"
      />
    </div>

    <div class="filter-group">
      <label for="connectorType">Connector Type</label>
      <select
        id="connectorType"
        v-model="localFilters.connectorType"
        @change="applyFilters"
        class="filter-select"
      >
        <option value="">All</option>
        <option value="Type 1">Type 1</option>
        <option value="Type 2">Type 2</option>
        <option value="CCS">CCS</option>
        <option value="CHAdeMO">CHAdeMO</option>
        <option value="Tesla Supercharger">Tesla Supercharger</option>
      </select>
    </div>

    <button @click="clearFilters" class="clear-btn">Clear Filters</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { StationFilters } from '@/types'
import { useStationsStore } from '@/stores/stations'

const stationsStore = useStationsStore()

const localFilters = ref<StationFilters>({
  status: '',
  powerOutput: undefined,
  connectorType: '',
})

const applyFilters = () => {
  const filters: StationFilters = {}

  if (localFilters.value.status) {
    filters.status = localFilters.value.status
  }

  if (localFilters.value.powerOutput) {
    filters.powerOutput = localFilters.value.powerOutput
  }

  if (localFilters.value.connectorType) {
    filters.connectorType = localFilters.value.connectorType
  }

  stationsStore.setFilters(filters)
}

const clearFilters = () => {
  localFilters.value = {
    status: '',
    powerOutput: undefined,
    connectorType: '',
  }
  stationsStore.clearFilters()
}
</script>

<style scoped>
.filters-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filters-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #2563eb;
}

.clear-btn {
  width: 100%;
  padding: 0.5rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #4b5563;
}
</style>
