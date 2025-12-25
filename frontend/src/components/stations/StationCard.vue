<template>
  <div class="station-card">
    <div class="station-header">
      <h3 class="station-name">{{ station.name }}</h3>
      <span :class="['status-badge', station.status.toLowerCase()]">
        {{ station.status }}
      </span>
    </div>

    <div class="station-info">
      <div class="info-item">
        <span class="info-label">Power Output:</span>
        <span class="info-value">{{ station.powerOutput }} kW</span>
      </div>

      <div class="info-item">
        <span class="info-label">Connector:</span>
        <span class="info-value">{{ station.connectorType }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">Location:</span>
        <span class="info-value">
          {{ station.location.latitude.toFixed(4) }},
          {{ station.location.longitude.toFixed(4) }}
        </span>
      </div>

      <div v-if="station.owner" class="info-item">
        <span class="info-label">Owner:</span>
        <span class="info-value">{{ station.owner.name }}</span>
      </div>
    </div>

    <div v-if="isOwner" class="station-actions">
      <button @click="$emit('edit', station)" class="btn btn-edit">Edit</button>
      <button @click="handleDelete" class="btn btn-delete">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChargingStation } from '@/types'
import { useAuthStore } from '@/stores/auth'

interface Props {
  station: ChargingStation
}

const props = defineProps<Props>()
const authStore = useAuthStore()

const emit = defineEmits<{
  edit: [station: ChargingStation]
  delete: [id: string]
}>()

const isOwner = computed(() => {
  return props.station.owner?.id === authStore.user?.id
})

const handleDelete = () => {
  if (props.station._id) {
    emit('delete', props.station._id)
  }
}
</script>

<style scoped>
.station-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.station-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.station-name {
  margin: 0;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background: #10b981;
  color: white;
}

.status-badge.inactive {
  background: #ef4444;
  color: white;
}

.station-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.station-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>
